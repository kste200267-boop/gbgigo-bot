/* =====================================================================
   kb-loader.js — md 파일(또는 kb.js 백업)에서 지식을 불러오는 공용 로더
   - GitHub Pages 등 http(s) 환경: manifest.json의 md 파일들을 직접 읽어옴
   - 로컬에서 더블클릭(file://)으로 열면: 보안상 md를 못 읽으므로 kb.js 사용
   ===================================================================== */
(function (global) {
  // md 한 개 텍스트 → 카테고리 객체
  function parseMd(text, fileName) {
    const lines = text.split(/\r?\n/);
    let title = null, icon = "❓";
    const items = [];
    let cur = null, ans = [];
    const flush = () => { if (cur !== null) { items.push({ q: cur, a: ans.join("\n").trim() }); } cur = null; ans = []; };
    for (const raw of lines) {
      const s = raw.replace(/\s+$/, "");
      const im = s.trim().match(/^<!--\s*icon:\s*(.+?)\s*-->$/);
      if (im) { icon = im[1]; continue; }
      if (s.startsWith("## ")) { flush(); cur = s.slice(3).trim(); continue; }
      if (s.startsWith("# ")) { title = s.slice(2).trim(); continue; }
      if (cur !== null) ans.push(s);
    }
    flush();
    const base = (fileName || "").split("/").pop().replace(/\.md$/, "");
    const id = base.replace(/[^0-9a-zA-Z]/g, "") || base;
    return { id, icon, title: title || base, file: fileName, items: items.filter(it => it.q) };
  }

  async function loadFromMd() {
    const res = await fetch("manifest.json", { cache: "no-store" });
    if (!res.ok) throw new Error("no manifest");
    const list = (await res.json()).files || [];
    const cats = [];
    for (const f of list) {
      const r = await fetch(f, { cache: "no-store" });
      if (!r.ok) throw new Error("md fail: " + f);
      cats.push(parseMd(await r.text(), f));
    }
    if (!cats.length) throw new Error("empty");
    return cats;
  }

  // 외부 공개: KB.load() → Promise<카테고리배열>
  global.KB = {
    parseMd,
    async load() {
      try {
        return await loadFromMd();          // 1순위: md 파일
      } catch (e) {
        if (global.KB_FALLBACK) return global.KB_FALLBACK;  // 2순위: kb.js
        throw e;
      }
    }
  };
})(window);
