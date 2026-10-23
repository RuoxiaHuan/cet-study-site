/* ══════════════════════════════════════════════════════════
   store.js — 本地持久化层
   所有学习进度存在 localStorage，键名 cet-study-v1
   ══════════════════════════════════════════════════════════ */

const Store = (() => {
  const KEY = 'cet-study-v1';
  const VERSION = 1;

  function defaults() {
    return {
      version: VERSION,
      settings: {
        level: 'cet4',     // 当前词库：cet4 | cet6
        dailyNew: 20,      // 每日新词数
        accent: 'us',      // 发音口音：uk | us
        autoPlay: true,    // 翻牌后自动读音
        showSentence: true,// 单词卡默认展示例句
      },
      words: {},   // "cet4:abandon" -> SRS 记录
      wordbook: {},// "cet4:abandon" -> 加入时间戳
      wrong: [],   // 错题 [{id, at, chosen, type}]
      daily: {},   // "2026-10-23" -> {learned, reviewed, correct, answered}
      quizDone: {},// 题目 id -> {ok, at}
    };
  }

  let state = null;
  let saveTimer = null;

  function load() {
    if (state) return state;
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) {
        state = defaults();
      } else {
        const parsed = JSON.parse(raw);
        state = migrate(parsed);
      }
    } catch (e) {
      console.warn('[store] 读取失败，使用默认值', e);
      state = defaults();
    }
    return state;
  }

  function migrate(old) {
    const base = defaults();
    if (!old || typeof old !== 'object') return base;
    return {
      version: VERSION,
      settings: Object.assign(base.settings, old.settings || {}),
      words: old.words || {},
      wordbook: old.wordbook || {},
      wrong: Array.isArray(old.wrong) ? old.wrong : [],
      daily: old.daily || {},
      quizDone: old.quizDone || {},
    };
  }

  function save() {
    if (saveTimer) return;
    saveTimer = setTimeout(() => {
      saveTimer = null;
      try {
        localStorage.setItem(KEY, JSON.stringify(state));
      } catch (e) {
        console.warn('[store] 写入失败', e);
      }
    }, 120);
  }

  function saveNow() {
    if (saveTimer) { clearTimeout(saveTimer); saveTimer = null; }
    try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) {}
  }

  /* ── 日期工具 ── */
  function dayKey(d) {
    const dt = d || new Date();
    const y = dt.getFullYear();
    const m = String(dt.getMonth() + 1).padStart(2, '0');
    const day = String(dt.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  }

  function today() {
    if (!state.daily[dayKey()]) {
      state.daily[dayKey()] = { learned: 0, reviewed: 0, correct: 0, answered: 0 };
    }
    return state.daily[dayKey()];
  }

  /* ── 单词状态 ── */
  function key(level, word) { return `${level}:${word}`; }

  function wordState(level, word) {
    return state.words[key(level, word)] || null;
  }

  function setWordState(level, word, rec) {
    state.words[key(level, word)] = rec;
    save();
  }

  function allWordStates(level) {
    const prefix = level + ':';
    const out = [];
    for (const k in state.words) {
      if (k.startsWith(prefix)) {
        out.push({ key: k, word: k.slice(prefix.length), rec: state.words[k] });
      }
    }
    return out;
  }

  /** 学过的词（历史记录用），按首次学习时间倒序 */
  function historyList(level) {
    const prefix = level + ':';
    const out = [];
    for (const k in state.words) {
      if (!k.startsWith(prefix)) continue;
      const rec = state.words[k];
      if (!rec || !rec.seen) continue;
      out.push({ word: k.slice(prefix.length), rec });
    }
    out.sort((a, b) => (b.rec.first || b.rec.last || 0) - (a.rec.first || a.rec.last || 0));
    return out;
  }

  /* ── 统计 ── */
  function bump(field, n) {
    const d = today();
    d[field] = (d[field] || 0) + (n || 1);
    save();
  }

  function streak() {
    const keys = Object.keys(state.daily).sort();
    if (!keys.length) return 0;
    let count = 0;
    const d = new Date();
    // 今天还没学也算连续（从昨天往前推）
    let cursor = new Date(d.getFullYear(), d.getMonth(), d.getDate());
    const first = state.daily[dayKey(cursor)];
    if (!first || (!first.learned && !first.reviewed)) {
      cursor.setDate(cursor.getDate() - 1);
    }
    for (let i = 0; i < 400; i++) {
      const rec = state.daily[dayKey(cursor)];
      if (rec && (rec.learned || rec.reviewed)) {
        count++;
        cursor.setDate(cursor.getDate() - 1);
      } else break;
    }
    return count;
  }

  function last7Days() {
    const out = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const k = dayKey(d);
      out.push({ key: k, label: `${d.getMonth() + 1}/${d.getDate()}`, rec: state.daily[k] || null });
    }
    return out;
  }

  /* ── 生词本 ── */
  function inWordbook(level, word) { return !!state.wordbook[key(level, word)]; }

  function toggleWordbook(level, word) {
    const k = key(level, word);
    if (state.wordbook[k]) delete state.wordbook[k];
    else state.wordbook[k] = Date.now();
    save();
    return !!state.wordbook[k];
  }

  function wordbookList(level) {
    const out = [];
    const prefix = level ? level + ':' : '';
    for (const k in state.wordbook) {
      if (!prefix || k.startsWith(prefix)) {
        const idx = k.indexOf(':');
        out.push({ level: k.slice(0, idx), word: k.slice(idx + 1), at: state.wordbook[k] });
      }
    }
    return out.sort((a, b) => b.at - a.at);
  }

  /* ── 错题 ── */
  function addWrong(item) {
    const exists = state.wrong.findIndex(x => x.id === item.id);
    if (exists >= 0) {
      state.wrong[exists].at = Date.now();
      state.wrong[exists].chosen = item.chosen;
      state.wrong[exists].times = (state.wrong[exists].times || 1) + 1;
    } else {
      state.wrong.unshift(Object.assign({ at: Date.now(), times: 1 }, item));
    }
    if (state.wrong.length > 600) state.wrong.length = 600;
    save();
  }

  function removeWrong(id) {
    state.wrong = state.wrong.filter(x => x.id !== id);
    save();
  }

  function clearWrong() { state.wrong = []; save(); }

  /* ── 题目记录 ── */
  function markQuiz(id, ok) {
    state.quizDone[id] = { ok, at: Date.now() };
    save();
  }

  /* ── 数据导入导出 ── */
  function exportData() { return JSON.stringify(state, null, 2); }

  function importData(text) {
    const parsed = JSON.parse(text);
    state = migrate(parsed);
    saveNow();
  }

  function reset() {
    state = defaults();
    saveNow();
  }

  return {
    load, save, saveNow,
    get state() { return load(); },
    get settings() { return load().settings; },
    dayKey, today, touch: () => { load(); },
    key, wordState, setWordState, allWordStates, historyList,
    bump, streak, last7Days,
    inWordbook, toggleWordbook, wordbookList,
    addWrong, removeWrong, clearWrong,
    get wrong() { return load().wrong; },
    markQuiz, get quizDone() { return load().quizDone; },
    exportData, importData, reset,
  };
})();
