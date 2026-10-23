# -*- coding: utf-8 -*-
"""
补齐缺失音标
=============
从 kajweb/dict 的其它 CET 词书里，为当前词库中缺音标的单词补 uk/us 音标。

用法：python scripts/fill_phonetics.py
"""
import io
import json
import os
import sys
import urllib.request
import zipfile

BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA = os.path.join(BASE, "data")
RAW = "https://raw.githubusercontent.com/kajweb/dict/master/book/"

# 所有可能提供音标的 CET 词书
BOOKS = [
    ("1521164635506_CET4_2.zip", "CET4_2.json"),
    ("1521164643060_CET4_3.zip", "CET4_3.json"),
    ("1521164649209_CET4_1.zip", "CET4_1.json"),
    ("1523620217431_CET4luan_1.zip", "CET4luan_1.json"),
    ("1524052539052_CET4luan_2.zip", "CET4luan_2.json"),
    ("1521164633851_CET6_3.zip", "CET6_3.json"),
    ("1524052554766_CET6_2.zip", "CET6_2.json"),
    ("1521164668667_CET6_1.zip", "CET6_1.json"),
    ("1521164660466_CET6luan_1.zip", "CET6luan_1.json"),
]


def fetch(fname):
    req = urllib.request.Request(RAW + fname, headers={"User-Agent": "cet-study-site/1.0"})
    return urllib.request.urlopen(req, timeout=300).read()


def build_map():
    """从全部词书里汇总 word -> (uk, us)"""
    m = {}
    for fname, inner in BOOKS:
        print("  读取 %s" % fname)
        z = zipfile.ZipFile(io.BytesIO(fetch(fname)))
        text = z.read(inner).decode("utf-8")
        for line in text.split("\n"):
            line = line.strip()
            if not line:
                continue
            try:
                obj = json.loads(line)
                c = obj["content"]["word"]["content"]
            except (json.JSONDecodeError, KeyError):
                continue
            w = (obj.get("headWord") or "").strip().lower()
            if not w:
                continue
            uk = (c.get("ukphone") or "").strip()
            us = (c.get("usphone") or "").strip()
            if not uk and not us:
                continue
            cur = m.get(w, ("", ""))
            m[w] = (cur[0] or uk, cur[1] or us)
    return m


def main():
    print("[1/2] 汇总音标…")
    phonetic = build_map()
    print("  共 %d 个词有音标" % len(phonetic))

    print("\n[2/2] 补全词库…")
    total_filled = 0
    remaining = []
    for level in ("cet4", "cet6"):
        path = os.path.join(DATA, "words-%s.json" % level)
        words = json.load(open(path, encoding="utf-8"))
        filled = 0
        for w in words:
            if w.get("uk") or w.get("us"):
                continue
            got = phonetic.get(w["w"])
            if got and (got[0] or got[1]):
                w["uk"], w["us"] = got
                filled += 1
            else:
                remaining.append((level, w["w"]))
        json.dump(words, open(path, "w", encoding="utf-8"),
                  ensure_ascii=False, separators=(",", ":"))
        total_filled += filled
        print("  %s: 补了 %d 个" % (level, filled))

    print("\n共补全 %d 个音标" % total_filled)
    if remaining:
        print("仍缺音标 %d 个：" % len(remaining))
        for lv, w in remaining:
            print("   %s %s" % (lv, w))
    else:
        print("所有单词都有音标了 ✅")
    return 0


if __name__ == "__main__":
    sys.exit(main())
