/* ══════════════════════════════════════════════════════════
   quiz.js — 题型练习
     词汇题（词库真题例题）
     仔细阅读 / 选词填空 / 长篇阅读匹配（原创题库）
   ══════════════════════════════════════════════════════════ */

const Quiz = (() => {

  let state = null;   // {mode, ...}

  /* ───────────── 入口 ───────────── */

  async function render(root) {
    const level = Store.settings.level;
    await Data.loadLevel(level);

    if (!state) return renderMenu(root);
    switch (state.mode) {
      case 'words': return renderWords(root);
      case 'reading': return renderReading(root);
      case 'cloze': return renderCloze(root);
      case 'matching': return renderMatching(root);
      default: state = null; return renderMenu(root);
    }
  }

  function renderMenu(root) {
    const level = Store.settings.level;
    const data = Data.get(level);
    const exCount = data.list.filter(w => w.ex && w.ex.length).length;
    const reading = QUIZ.reading.filter(s => s.level === level);
    const cloze = QUIZ.cloze.filter(s => s.level === level);
    const matching = QUIZ.matching.filter(s => s.level === level);

    const card = (mode, icon, title, sub, count, disabled) => `
      <div class="list-row" ${disabled ? '' : `data-mode="${mode}"`} style="${disabled ? 'opacity:.5' : 'cursor:pointer'}">
        <span style="font-size:20px">${icon}</span>
        <span class="w" style="min-width:auto">${title}</span>
        <span class="tr">${sub}</span>
        <span class="tag-pill brand">${count}</span>
      </div>`;

    root.innerHTML = `
      <div class="page-head">
        <h1>题型练习</h1>
        <p>${level === 'cet4' ? '四级' : '六级'}题库 · 题目为本站原创编写，对标真题题型</p>
      </div>

      <div class="card">
        <h3 class="card-title">词汇题 <span class="sub">来自词库的真题例题，带逐题解析</span></h3>
        <div class="list">
          ${card('words', '📝', '单项选择', '看句子选词填空，附答案讲解', exCount + ' 题', exCount === 0)}
        </div>
      </div>

      <div class="card">
        <h3 class="card-title">阅读理解</h3>
        <div class="list">
          ${card('reading', '📖', '仔细阅读', '短文 + 5 道选择题，考察细节与推断', reading.length + ' 篇', !reading.length)}
        </div>
      </div>

      <div class="card">
        <h3 class="card-title">词汇与匹配</h3>
        <div class="list">
          ${card('cloze', '🧩', '选词填空', '15 选 10，考察词义与搭配', cloze.length + ' 篇', !cloze.length)}
          ${card('matching', '🔗', '长篇阅读匹配', '段落信息匹配，考察快速定位', matching.length + ' 篇', !matching.length)}
        </div>
      </div>`;

    root.querySelectorAll('[data-mode]').forEach(el => {
      el.addEventListener('click', () => {
        const mode = el.dataset.mode;
        if (mode === 'words') startWords();
        else startSet(mode);
        render(root);
      });
    });
  }

  /* ───────────── 词汇题 ───────────── */

  function startWords() {
    const level = Store.settings.level;
    const data = Data.get(level);
    const pool = data.list.filter(w => w.ex && w.ex.length);
    if (!pool.length) { state = null; return; }
    const w = pool[Math.floor(Math.random() * pool.length)];
    const exIdx = Math.floor(Math.random() * w.ex.length);
    state = {
      mode: 'words',
      level,
      word: w,
      ex: w.ex[exIdx],
      exIdx,
      answered: false,
      chosen: -1,
      round: 1,
      score: { right: 0, total: 0 },
    };
  }

  function renderWords(root) {
    const s = state;
    if (!s) return renderMenu(root);
    const ex = s.ex;
    const right = ex.r;

    let optHTML = '';
    ex.o.forEach((opt, i) => {
      let cls = 'option';
      if (s.answered) {
        cls += ' disabled';
        if (i === right) cls += ' right';
        else if (i === s.chosen) cls += ' wrong';
      }
      optHTML += `
        <div class="${cls}" data-opt="${i}">
          <span class="letter">${LETTERS[i]}</span>
          <span>${esc(opt)}</span>
        </div>`;
    });

    root.innerHTML = `
      <div class="page-head">
        <h1>词汇题</h1>
        <p>第 ${s.round} 题 · 正确 ${s.score.right} / ${s.score.total}</p>
      </div>

      <div class="card">
        <p class="q-stem">${esc(ex.q)}</p>
        <div class="options">${optHTML}</div>
        <div class="explain" ${s.answered ? '' : 'hidden'}>
          <b>答案：${LETTERS[right]}（${esc(ex.o[right])}）</b><br>${esc(ex.x || '暂无解析')}
        </div>
        <div style="margin-top:18px;display:flex;gap:10px;flex-wrap:wrap">
          <button class="btn btn-primary" data-next ${s.answered ? '' : 'disabled'}>下一题</button>
          <button class="btn" data-back>返回题型列表</button>
          <button class="btn" data-play-word>🔊 ${esc(s.word.w)}</button>
        </div>
      </div>`;

    root.querySelectorAll('[data-opt]').forEach(el => {
      el.addEventListener('click', () => {
        if (s.answered) return;
        s.chosen = Number(el.dataset.opt);
        s.answered = true;
        s.score.total++;
        if (s.chosen === right) s.score.right++;
        else Store.addWrong({
          id: `ex:${s.level}:${s.word.w}:${s.exIdx}`,
          type: 'word', level: s.level, word: s.word.w, chosen: s.chosen,
        });
        Store.bump('answered', 1);
        if (s.chosen === right) Store.bump('correct', 1);
        renderWords(root);
      });
    });

    root.querySelector('[data-next]')?.addEventListener('click', () => {
      const round = s.round + 1, score = s.score;
      startWords();
      state.round = round;
      state.score = score;
      renderWords(root);
    });

    root.querySelector('[data-back]')?.addEventListener('click', () => {
      state = null;
      renderMenu(root);
    });

    root.querySelector('[data-play-word]')?.addEventListener('click', () => {
      Sound.playWord(s.word.w, Store.settings.accent);
    });
  }

  /* ───────────── 阅读 / 填空 / 匹配 通用启动 ───────────── */

  function startSet(mode) {
    const level = Store.settings.level;
    const pool = QUIZ[mode].filter(x => x.level === level);
    if (!pool.length) { state = null; return; }
    const set = pool[Math.floor(Math.random() * pool.length)];
    state = {
      mode, level, set,
      answered: mode === 'reading' ? {} : undefined,
      picks: mode === 'matching' ? {} : undefined,
      filled: mode === 'cloze' ? {} : undefined,
      active: null,
      graded: false,
      score: mode === 'reading' ? { right: 0, total: 0 } : null,
    };
  }

  /* ───────────── 仔细阅读 ───────────── */

  function renderReading(root) {
    const s = state;
    const set = s.set;

    let passageHTML = set.passage.map(p => `<p>${esc(p)}</p>`).join('');

    let qHTML = '';
    set.questions.forEach((q, qi) => {
      const done = s.answered[qi] != null;
      let optHTML = '';
      q.options.forEach((opt, oi) => {
        let cls = 'option';
        if (done) {
          cls += ' disabled';
          if (oi === q.answer) cls += ' right';
          else if (oi === s.answered[qi]) cls += ' wrong';
        }
        optHTML += `
          <div class="${cls}" data-q="${qi}" data-opt="${oi}">
            <span class="letter">${LETTERS[oi]}</span>
            <span>${esc(opt)}</span>
          </div>`;
      });
      qHTML += `
        <div class="question">
          <p class="q-stem"><span class="q-num">${qi + 1}</span>${esc(q.q)}</p>
          <div class="options">${optHTML}</div>
          <div class="explain" ${done ? '' : 'hidden'}>
            <b>答案：${LETTERS[q.answer]}</b>　${esc(q.explain)}
          </div>
        </div>`;
    });

    const answeredCount = Object.keys(s.answered).length;
    const allDone = answeredCount === set.questions.length;
    let scoreHTML = '';
    if (allDone) {
      const right = set.questions.reduce((n, q, i) => n + (s.answered[i] === q.answer ? 1 : 0), 0);
      scoreHTML = `<div class="explain" style="margin-top:16px;border-left-color:var(--ok)">
        <b>本篇得分：${right} / ${set.questions.length}</b>（正确率 ${pct(right, set.questions.length)}%）
      </div>`;
    }

    root.innerHTML = `
      <div class="page-head">
        <h1>仔细阅读</h1>
        <p>${esc(set.title)} · 已答 ${answeredCount} / ${set.questions.length}</p>
      </div>

      <div class="card">
        <h3 class="card-title">短文</h3>
        <div class="passage">${passageHTML}</div>
      </div>

      <div class="card">
        <h3 class="card-title">题目</h3>
        ${qHTML}
        ${scoreHTML}
        <div style="margin-top:18px;display:flex;gap:10px;flex-wrap:wrap">
          <button class="btn" data-back>返回题型列表</button>
          <button class="btn" data-again>换一篇</button>
        </div>
      </div>`;

    root.querySelectorAll('[data-opt]').forEach(el => {
      el.addEventListener('click', () => {
        const qi = Number(el.dataset.q);
        if (s.answered[qi] != null) return;
        const oi = Number(el.dataset.opt);
        s.answered[qi] = oi;
        Store.bump('answered', 1);
        const q = set.questions[qi];
        if (oi === q.answer) Store.bump('correct', 1);
        else Store.addWrong({
          id: `rd:${set.id}:${qi}`,
          type: 'reading', level: s.level, title: set.title, q: qi, chosen: oi,
        });
        renderReading(root);
      });
    });

    root.querySelector('[data-back]')?.addEventListener('click', () => { state = null; renderMenu(root); });
    root.querySelector('[data-again]')?.addEventListener('click', () => { startSet('reading'); renderReading(root); });
  }

  /* ───────────── 选词填空 ───────────── */

  function renderCloze(root) {
    const s = state;
    const set = s.set;
    const answers = set.answers;

    let passageHTML = set.passage.split('\n\n').map(para => {
      const html = esc(para).replace(/__(\d+)__/g, (m, n) => {
        const val = s.filled[n] || '';
        let cls = 'blank';
        if (s.graded) {
          cls += (val === answers[n]) ? ' ok' : ' no';
        } else if (val) {
          cls += ' filled';
        }
        if (s.active === n) cls += ' active';
        return `<span class="${cls}" data-n="${n}">${val || n}</span>`;
      });
      return `<p>${html}</p>`;
    }).join('');

    const used = new Set(Object.values(s.filled).filter(Boolean));
    const bankHTML = set.wordbank.map(w => {
      let cls = 'bank-item';
      if (used.has(w)) cls += ' used';
      if (s.graded) {
        const hit = Object.keys(s.filled).some(n => s.filled[n] === w && answers[n] === w);
        if (hit) cls += ' ok';
      }
      return `<span class="${cls}" data-w="${esc(w)}">${esc(w)}</span>`;
    }).join('');

    const filledCount = Object.keys(s.filled).filter(n => s.filled[n]).length;
    let scoreHTML = '';
    if (s.graded) {
      const right = Object.keys(answers).filter(n => s.filled[n] === answers[n]).length;
      const total = Object.keys(answers).length;
      scoreHTML = `<div class="explain" style="margin-top:16px;border-left-color:var(--ok)">
        <b>本篇得分：${right} / ${total}</b>（正确率 ${pct(right, total)}%）
      </div>`;
    }

    root.innerHTML = `
      <div class="page-head">
        <h1>选词填空</h1>
        <p>${esc(set.title)} · 已填 ${filledCount} / 10</p>
      </div>

      <div class="card">
        <h3 class="card-title">备选词 <span class="sub">先点空格，再点单词</span></h3>
        <div class="wordbank">${bankHTML}</div>
        <div class="passage">${passageHTML}</div>
        ${scoreHTML}
        <div style="margin-top:18px;display:flex;gap:10px;flex-wrap:wrap">
          ${s.graded
            ? '<button class="btn btn-primary" data-again>换一篇</button><button class="btn" data-clear>重做本篇</button>'
            : '<button class="btn btn-primary" data-submit>提交答案</button><button class="btn" data-clear>清空</button>'}
          <button class="btn" data-back>返回题型列表</button>
        </div>
      </div>`;

    if (s.graded) {
      root.querySelectorAll('.blank').forEach(el => {
        el.addEventListener('click', () => {
          const n = el.dataset.n;
          const exp = (set.explains || {})[n];
          if (exp) toast(`第 ${n} 空：${answers[n]} — ${exp}`);
        });
      });
    } else {
      root.querySelectorAll('.blank').forEach(el => {
        el.addEventListener('click', () => {
          s.active = s.active === el.dataset.n ? null : el.dataset.n;
          renderCloze(root);
        });
      });
      root.querySelectorAll('[data-w]').forEach(el => {
        el.addEventListener('click', () => {
          if (el.classList.contains('used')) return;
          const w = el.dataset.w;
          if (!s.active) {
            // 没选空格时，找第一个空着的
            const target = Object.keys(answers).find(n => !s.filled[n]);
            if (!target) { toast('所有空都填好了'); return; }
            s.active = target;
          }
          s.filled[s.active] = w;
          s.active = null;
          renderCloze(root);
        });
      });
    }

    root.querySelector('[data-submit]')?.addEventListener('click', () => {
      const missing = Object.keys(answers).filter(n => !s.filled[n]);
      if (missing.length) { toast(`还有 ${missing.length} 个空没填`); return; }
      s.graded = true;
      const right = Object.keys(answers).filter(n => s.filled[n] === answers[n]).length;
      Store.bump('answered', 10);
      Store.bump('correct', right);
      Object.keys(answers).forEach(n => {
        if (s.filled[n] !== answers[n]) {
          Store.addWrong({ id: `cz:${set.id}:${n}`, type: 'cloze', level: s.level, title: set.title, blank: n });
        }
      });
      renderCloze(root);
    });

    root.querySelector('[data-clear]')?.addEventListener('click', () => {
      s.filled = {}; s.graded = false; s.active = null;
      renderCloze(root);
    });
    root.querySelector('[data-back]')?.addEventListener('click', () => { state = null; renderMenu(root); });
    root.querySelector('[data-again]')?.addEventListener('click', () => { startSet('cloze'); renderCloze(root); });
  }

  /* ───────────── 长篇阅读匹配 ───────────── */

  function renderMatching(root) {
    const s = state;
    const set = s.set;

    const passageHTML = set.paragraphs
      .map(p => `<p><span class="para-label">${p.label}</span>${esc(p.text)}</p>`)
      .join('');

    const labels = set.paragraphs.map(p => p.label);

    let listHTML = '';
    set.statements.forEach((st, i) => {
      const picked = s.picks[i] || '';
      let cls = 'match-item';
      if (s.graded) cls += (picked === st.answer) ? ' ok' : ' no';
      listHTML += `
        <div class="${cls}">
          <span class="idx">${i + 1}</span>
          <span class="stmt">${esc(st.text)}</span>
          <select data-i="${i}" ${s.graded ? 'disabled' : ''}>
            <option value="">--</option>
            ${labels.map(l => `<option value="${l}" ${picked === l ? 'selected' : ''}>${l}</option>`).join('')}
          </select>
        </div>`;
    });

    let scoreHTML = '';
    if (s.graded) {
      const right = set.statements.filter((st, i) => s.picks[i] === st.answer).length;
      scoreHTML = `<div class="explain" style="margin-top:16px;border-left-color:var(--ok)">
        <b>本篇得分：${right} / ${set.statements.length}</b>（正确率 ${pct(right, set.statements.length)}%）
      </div>`;
    }

    root.innerHTML = `
      <div class="page-head">
        <h1>长篇阅读匹配</h1>
        <p>${esc(set.title)} · 已选 ${Object.values(s.picks).filter(Boolean).length} / ${set.statements.length}</p>
      </div>

      <div class="card">
        <h3 class="card-title">原文 <span class="sub">段落已标注字母</span></h3>
        <div class="passage">${passageHTML}</div>
      </div>

      <div class="card">
        <h3 class="card-title">把每句话匹配到对应段落</h3>
        <div class="match-list">${listHTML}</div>
        ${scoreHTML}
        <div style="margin-top:18px;display:flex;gap:10px;flex-wrap:wrap">
          ${s.graded
            ? '<button class="btn btn-primary" data-again>换一篇</button>'
            : '<button class="btn btn-primary" data-submit>提交答案</button>'}
          <button class="btn" data-back>返回题型列表</button>
        </div>
      </div>`;

    root.querySelectorAll('select[data-i]').forEach(sel => {
      sel.addEventListener('change', () => {
        s.picks[Number(sel.dataset.i)] = sel.value;
        renderMatching(root);
      });
    });

    root.querySelector('[data-submit]')?.addEventListener('click', () => {
      const missing = set.statements.filter((st, i) => !s.picks[i]).length;
      if (missing) { toast(`还有 ${missing} 题没选`); return; }
      s.graded = true;
      const right = set.statements.filter((st, i) => s.picks[i] === st.answer).length;
      Store.bump('answered', set.statements.length);
      Store.bump('correct', right);
      set.statements.forEach((st, i) => {
        if (s.picks[i] !== st.answer) {
          Store.addWrong({ id: `mt:${set.id}:${i}`, type: 'matching', level: s.level, title: set.title, q: i });
        }
      });
      renderMatching(root);
    });

    root.querySelector('[data-back]')?.addEventListener('click', () => { state = null; renderMenu(root); });
    root.querySelector('[data-again]')?.addEventListener('click', () => { startSet('matching'); renderMatching(root); });
  }

  return {
    render,
    reset() { state = null; },
    /* 供自测脚本调用 */
    __test: {
      startSet, startWords, get state() { return state; },
      renderReading, renderCloze, renderMatching, renderWords, renderMenu,
    },
  };
})();
