#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
build-kb.py — md/ 폴더의 질문/답변 → kb.js + manifest.json 자동 생성
사용법:  이 파일이 있는 agent 폴더에서  ->  python build-kb.py
(브라우저 '수정 모드(edit.html)'로도 같은 결과를 만들 수 있어요. 이건 코드로 일괄 생성용)
"""
import os, re, json, glob

BASE = os.path.dirname(os.path.abspath(__file__))   # = agent 폴더
MDDIR = os.path.join(BASE, "md")

cats = []
for path in sorted(glob.glob(os.path.join(MDDIR, "*.md"))):
    title, icon, items, cur, ans = None, "❓", [], None, []
    def flush():
        global cur, ans
        if cur is not None:
            items.append({"q": cur, "a": "\n".join(ans).strip()})
        cur, ans = None, []
    with open(path, encoding="utf-8") as f:
        for line in f:
            s = line.rstrip("\n")
            m = re.match(r"<!--\s*icon:\s*(.+?)\s*-->", s.strip())
            if m: icon = m.group(1); continue
            if s.startswith("## "): flush(); cur = s[3:].strip(); continue
            if s.startswith("# "): title = s[2:].strip(); continue
            if cur is not None: ans.append(s)
    flush()
    fn = os.path.basename(path)
    cid = re.sub(r"[^0-9a-zA-Z]", "", os.path.splitext(fn)[0]) or ("c" + str(len(cats)))
    cats.append({"id": cid, "icon": icon, "title": title or cid, "file": fn,
                 "items": [it for it in items if it["q"]]})

with open(os.path.join(BASE, "kb.js"), "w", encoding="utf-8") as f:
    f.write("/* 자동 생성 파일 (md 폴더 기반). 직접 수정하지 말고 md 또는 수정모드에서 편집하세요. */\n"
            "window.KB_FALLBACK = " + json.dumps(cats, ensure_ascii=False, indent=2) + ";\n")

with open(os.path.join(BASE, "manifest.json"), "w", encoding="utf-8") as f:
    json.dump({"files": ["md/" + c["file"] for c in cats]}, f, ensure_ascii=False, indent=2)

print("OK  categories:", len(cats), " items:", sum(len(c["items"]) for c in cats))
