# -*- coding: utf-8 -*-
"""
手工补齐最后一批缺失音标
========================
自动从其它词书补全后仍有 36 个词缺音标（多为专有名词、合成词、拼写变体），
这里用人工整理的对照表补上。同时修正一处源数据拼写错误：reservior -> reservoir。

用法：python scripts/fix_missing_phonetics.py
"""
import json
import os
import sys

BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA = os.path.join(BASE, "data")

# 格式与词库保持一致：重音用 ' ，括号表可选音
TABLE = {
    "cet4": {
        "ampere":       ("'æmpeə(r)",      "'æmpɪr"),
        "anybody":      ("'enibɒdi",       "'enibɑːdi"),
        "aural":        ("'ɔːrəl",         "'ɔːrəl"),
        "brittle":      ("'brɪtl",         "'brɪtl"),
        "cigaret":      ("ˌsɪɡə'ret",      "'sɪɡəret"),
        "desk":         ("desk",           "desk"),
        "direction":    ("də'rekʃn",       "də'rekʃn"),
        "from":         ("frɒm",           "frʌm"),
        "lately":       ("'leɪtli",        "'leɪtli"),
        "mister":       ("'mɪstə(r)",      "'mɪstər"),
        "needless":     ("'niːdləs",       "'niːdləs"),
        "occasionally": ("ə'keɪʒnəli",     "ə'keɪʒnəli"),
        "ocean":        ("'əʊʃn",          "'oʊʃn"),
        "pale":         ("peɪl",           "peɪl"),
        "probably":     ("'prɒbəbli",      "'prɑːbəbli"),
        "professor":    ("prə'fesə(r)",    "prə'fesər"),
        "ray":          ("reɪ",            "reɪ"),
        "really":       ("'riːəli",        "'riːəli"),
        "reservior":    ("'rezəvwɑː(r)",   "'rezərvwɑːr"),
        "serve":        ("sɜːv",           "sɜːrv"),
        "silver":       ("'sɪlvə(r)",      "'sɪlvər"),
    },
    "cet6": {
        "anybody":        ("'enibɒdi",         "'enibɑːdi"),
        "commonsense":    ("ˌkɒmən'sens",      "ˌkɑːmən'sens"),
        "errand":         ("'erənd",           "'erənd"),
        "experimentally": ("ɪkˌsperɪ'mentli",  "ɪkˌsperɪ'mentli"),
        "fighter":        ("'faɪtə(r)",        "'faɪtər"),
        "islam":          ("'ɪzlɑːm",          "'ɪzlɑːm"),
        "pedlar":         ("'pedlə(r)",        "'pedlər"),
        "psychology":     ("saɪ'kɒlədʒi",      "saɪ'kɑːlədʒi"),
        "reptile":        ("'reptaɪl",         "'reptaɪl"),
        "saturn":         ("'sætɜːn",          "'sætɜːrn"),
        "sensitivity":    ("ˌsensə'tɪvəti",    "ˌsensə'tɪvəti"),
        "siren":          ("'saɪrən",          "'saɪrən"),
        "watchful":       ("'wɒtʃfl",          "'wɑːtʃfl"),
        "workpiece":      ("'wɜːkpiːs",        "'wɜːrkpiːs"),
        "xerox":          ("'zɪərɒks",         "'zɪrɑːks"),
    },
}

# 源数据拼写错误 -> 正确拼写
FIX_SPELLING = {"reservior": "reservoir"}


def main():
    total = 0
    for level, table in TABLE.items():
        path = os.path.join(DATA, "words-%s.json" % level)
        words = json.load(open(path, encoding="utf-8"))
        by_word = {w["w"]: w for w in words}
        fixed = 0

        for word, (uk, us) in table.items():
            target = FIX_SPELLING.get(word, word)
            rec = by_word.get(word)
            if rec is None and target != word:
                rec = by_word.get(target)
            if rec is None:
                print("  ! %s 找不到 %s，跳过" % (level, word))
                continue
            if rec.get("uk") or rec.get("us"):
                continue
            rec["uk"] = uk
            rec["us"] = us
            fixed += 1

            # 修正拼写错误（同等级没有重复词时直接改名）
            if target != word:
                if target in by_word:
                    # 已存在正确拼写，合并后删掉错词
                    keep = by_word[target]
                    for t in rec.get("tr", []):
                        if t not in keep.get("tr", []):
                            keep.setdefault("tr", []).append(t)
                    words.remove(rec)
                else:
                    rec["w"] = target
                    by_word[target] = rec
                    del by_word[word]

        words.sort(key=lambda x: x["w"])
        json.dump(words, open(path, "w", encoding="utf-8"),
                  ensure_ascii=False, separators=(",", ":"))
        print("  %s: 补了 %d 个" % (level, fixed))
        total += fixed

    # 复核
    print()
    for level in TABLE:
        data = json.load(open(os.path.join(DATA, "words-%s.json" % level), encoding="utf-8"))
        miss = [w["w"] for w in data if not w.get("uk") and not w.get("us")]
        print("%s: %d 词，缺音标 %d 个 %s" % (level, len(data), len(miss), miss or ""))
    print("\n共补 %d 个" % total)
    return 0


if __name__ == "__main__":
    sys.exit(main())
