/* ══════════════════════════════════════════════════════════
   data.js — 词库加载
   首次进入按需拉取对应等级的词库，之后缓存在内存
   ══════════════════════════════════════════════════════════ */

const Data = (() => {
  let index = null;
  const cache = {};       // level -> {list, byWord}
  const listeners = [];

  async function loadIndex() {
    if (index) return index;
    const res = await fetch('data/index.json', { cache: 'no-cache' });
    if (!res.ok) throw new Error('词库索引加载失败：' + res.status);
    index = await res.json();
    return index;
  }

  async function loadLevel(level) {
    if (cache[level]) return cache[level];
    const idx = await loadIndex();
    const meta = idx.books[level];
    if (!meta) throw new Error('未知词库：' + level);

    const res = await fetch(meta.file, { cache: 'no-cache' });
    if (!res.ok) throw new Error('词库加载失败：' + res.status);
    const list = await res.json();

    const byWord = new Map();
    for (const w of list) byWord.set(w.w, w);

    cache[level] = { list, byWord, meta };
    listeners.forEach(fn => fn(level));
    return cache[level];
  }

  function get(level) { return cache[level] || null; }

  function word(level, w) {
    const d = cache[level];
    return d ? d.byWord.get(w) : null;
  }

  function meta(level) {
    return (index && index.books[level]) || null;
  }

  function onLoad(fn) { listeners.push(fn); }

  return { loadIndex, loadLevel, get, word, meta, onLoad };
})();
