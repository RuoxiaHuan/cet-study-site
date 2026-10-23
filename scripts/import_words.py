# -*- coding: utf-8 -*-
"""
CET4/CET6 词库导入脚本（含音标、例句、真题例题）
================================================
数据源：kajweb/dict（开源，源自有道背单词词书）
  https://github.com/kajweb/dict

每本书是一个 zip，内含 JSONL（一行一个单词对象）。字段：
  content.word.content
    ├─ ukphone / usphone   英/美音标
    ├─ trans[]             释义 {pos, tranCn, tranOther}
    ├─ sentence.sentences[] 例句 {sContent, sCn}
    ├─ phrase.phrases[]    词组 {pContent, pCn}
    ├─ exam[]              真题例题 {question, choices[], answer{rightIndex, explain}}
    └─ star                难度星级

合并策略：同级两本书按单词合并；释义/例句/真题取并集，去重。
输出：data/words-cet4.json / data/words-cet6.json / data/index.json
"""
import io
import json
import os
import sys
import urllib.request
import zipfile

BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT_DIR = os.path.join(BASE, "data")

RAW = "https://raw.githubusercontent.com/kajweb/dict/master/book/"

BOOKS = {
    "cet4": [
        ("1521164635506_CET4_2.zip", "CET4_2.json"),      # 3739 词
        ("1521164643060_CET4_3.zip", "CET4_3.json"),      # 2607 词
    ],
    "cet6": [
        ("1521164633851_CET6_3.zip", "CET6_3.json"),      # 2345 词
        ("1524052554766_CET6_2.zip", "CET6_2.json"),      # 2078 词
    ],
}

MAX_SENTENCES = 3
MAX_PHRASES = 6
MAX_EXAMS = 2


def fetch_zip(fname):
    url = RAW + fname
    print("  下载 %s" % fname)
    req = urllib.request.Request(url, headers={"User-Agent": "cet-study-site/1.0"})
    return urllib.request.urlopen(req, timeout=300).read()


def parse_book(zip_bytes, inner_name):
    """解析一本词书，返回 {word: record}"""
    z = zipfile.ZipFile(io.BytesIO(zip_bytes))
    text = z.read(inner_name).decode("utf-8")
    out = {}
    for line in text.split("\n"):
        line = line.strip()
        if not line:
            continue
        try:
            obj = json.loads(line)
            c = obj["content"]["word"]["content"]
        except (json.JSONDecodeError, KeyError):
            continue

        word = (obj.get("headWord") or "").strip().lower()
        if not word:
            continue

        rec = {
            "uk": (c.get("ukphone") or "").strip(),
            "us": (c.get("usphone") or "").strip(),
            "tr": [],
            "s": [],
            "ph": [],
            "ex": [],
            "star": c.get("star") or 0,
        }

        seen_tr = set()
        for t in (c.get("trans") or []):
            cn = (t.get("tranCn") or "").strip()
            pos = (t.get("pos") or "").strip()
            if cn and (pos, cn) not in seen_tr:
                seen_tr.add((pos, cn))
                rec["tr"].append({"p": pos, "c": cn})

        sent = (c.get("sentence") or {}).get("sentences") or []
        for s in sent[:MAX_SENTENCES]:
            en = (s.get("sContent") or "").strip()
            cn = (s.get("sCn") or "").strip()
            if en:
                rec["s"].append({"e": en, "c": cn})

        phr = (c.get("phrase") or {}).get("phrases") or []
        for p in phr[:MAX_PHRASES]:
            pc = (p.get("pContent") or "").strip()
            pcn = (p.get("pCn") or "").strip()
            if pc:
                rec["ph"].append({"p": pc, "c": pcn})

        for e in (c.get("exam") or [])[:MAX_EXAMS]:
            choices = [str(ch.get("choice", "")).strip() for ch in (e.get("choices") or [])]
            ans = e.get("answer") or {}
            right = ans.get("rightIndex")
            try:
                right = int(right) - 1  # 1-based -> 0-based
            except (TypeError, ValueError):
                right = -1
            if len(choices) >= 2 and 0 <= right < len(choices):
                rec["ex"].append({
                    "q": (e.get("question") or "").strip(),
                    "o": choices,
                    "r": right,
                    "x": (ans.get("explain") or "").strip(),
                })

        if rec["tr"]:
            out[word] = rec
    return out


def merge(dst, src):
    """把 src 合入 dst：释义/例句/词组/真题取并集去重"""
    for word, rec in src.items():
        if word not in dst:
            dst[word] = rec
            continue
        cur = dst[word]
        if not cur["uk"]:
            cur["uk"] = rec["uk"]
        if not cur["us"]:
            cur["us"] = rec["us"]
        if rec["star"] > cur["star"]:
            cur["star"] = rec["star"]

        seen_tr = {(t["p"], t["c"]) for t in cur["tr"]}
        for t in rec["tr"]:
            if (t["p"], t["c"]) not in seen_tr:
                seen_tr.add((t["p"], t["c"]))
                cur["tr"].append(t)

        seen_s = {s["e"] for s in cur["s"]}
        for s in rec["s"]:
            if s["e"] not in seen_s and len(cur["s"]) < MAX_SENTENCES:
                seen_s.add(s["e"])
                cur["s"].append(s)

        seen_p = {p["p"] for p in cur["ph"]}
        for p in rec["ph"]:
            if p["p"] not in seen_p and len(cur["ph"]) < MAX_PHRASES:
                seen_p.add(p["p"])
                cur["ph"].append(p)

        seen_q = {e["q"] for e in cur["ex"]}
        for e in rec["ex"]:
            if e["q"] not in seen_q and len(cur["ex"]) < MAX_EXAMS:
                seen_q.add(e["q"])
                cur["ex"].append(e)


def write_level(level, words):
    items = []
    for w in sorted(words):
        r = words[w]
        items.append({
            "w": w,
            "uk": r["uk"],
            "us": r["us"],
            "tr": r["tr"][:4],
            "s": r["s"],
            "ph": r["ph"],
            "ex": r["ex"],
            "star": r["star"],
            "lv": level,
        })
    dest = os.path.join(OUT_DIR, "words-%s.json" % level)
    with open(dest, "w", encoding="utf-8") as f:
        json.dump(items, f, ensure_ascii=False, separators=(",", ":"))
    size = os.path.getsize(dest) / 1048576.0
    n_exam = sum(1 for x in items if x["ex"])
    n_sent = sum(1 for x in items if x["s"])
    print("  -> %d 词（%d 有例句，%d 有真题），%.2f MB" % (len(items), n_sent, n_exam, size))
    return {"count": len(items), "withSentences": n_sent, "withExam": n_exam}


def main():
    os.makedirs(OUT_DIR, exist_ok=True)
    summary = {}
    for level, books in BOOKS.items():
        print("[%s]" % level)
        merged = {}
        for fname, inner in books:
            raw = fetch_zip(fname)
            part = parse_book(raw, inner)
            print("    解析 %d 词" % len(part))
            merge(merged, part)
        summary[level] = write_level(level, merged)

    index = {
        "updated": "2026-10-23",
        "source": "kajweb/dict (github, open source)",
        "books": {
            "cet4": dict(lv="四级", file="data/words-cet4.json", **summary["cet4"]),
            "cet6": dict(lv="六级", file="data/words-cet6.json", **summary["cet6"]),
        },
    }
    with open(os.path.join(OUT_DIR, "index.json"), "w", encoding="utf-8") as f:
        json.dump(index, f, ensure_ascii=False, indent=2)
    print("\n完成:", json.dumps(summary, ensure_ascii=False))


if __name__ == "__main__":
    sys.exit(main())
