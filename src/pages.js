/* ══════════════════════════════════════════════════════════
   pages.js — 页面渲染（首页 / 学习 / 复习 / 生词本 / 错题本 / 统计 / 设置）
   ══════════════════════════════════════════════════════════ */

const Pages = (() => {

  /* 当前学习/复习会话 */
  let session = null;

  /* ───────────── 公共：单词卡 ───────────── */

  function wordCardHTML(w, opts) {
    const o = opts || {};
    const level = w.lv;
    const starred = Store.inWordbook(level, w.w);
    const uk = fmtPhonetic(w.uk);
    const us = fmtPhonetic(w.us);

    let phoneticHTML = '';
    if (uk || us) {
      phoneticHTML = '<div class="phonetics">';
      if (uk) phoneticHTML += `<span class="phonetic-item" data-play="uk" title="点击听英音"><span class="tag">英</span>${esc(uk)}</span>`;
      if (us) phoneticHTML += `<span class="phonetic-item" data-play="us" title="点击听美音"><span class="tag">美</span>${esc(us)}</span>`;
      phoneticHTML += '</div>';
    }

    return `
      <div class="wordcard" data-word="${esc(w.w)}">
        <div class="wordcard-top">
          <div class="word">${esc(w.w)}</div>
          ${phoneticHTML}
          <div class="word-actions">
            <button class="icon-btn" data-act="play-word" title="播放发音">🔊</button>
            <button class="icon-btn ${starred ? 'on' : ''}" data-act="star" title="加入生词本">${starred ? '★' : '☆'}</button>
          </div>
        </div>
        <div class="answer-zone" data-zone>
          ${o.revealed ? answerHTML(w) : revealHintHTML()}
        </div>
        ${o.grades === false ? '' : gradeHTML()}
      </div>`;
  }

  function revealHintHTML() {
    return `<div class="reveal-hint" data-act="reveal">
        点击显示释义　<span style="opacity:.6">或按 空格</span>
      </div>`;
  }

  function answerHTML(w) {
    let html = '';

    html += '<ul class="trans-list">';
    w.tr.forEach(t => {
      html += `<li><span class="trans-pos">${esc(t.p || '')}</span><span>${esc(t.c)}</span></li>`;
    });
    html += '</ul>';

    if (w.s && w.s.length) {
      html += '<div class="section-label">例句</div>';
      w.s.forEach(s => {
        html += `
          <div class="sentence">
            <div class="en">${highlight(s.e, w.w)}
              <button class="icon-btn btn-sm" data-act="play-sentence" data-text="${esc(s.e)}"
                      style="width:26px;height:26px;font-size:12px;margin-left:6px;">🔊</button>
            </div>
            ${s.c ? `<div class="cn">${esc(s.c)}</div>` : ''}
          </div>`;
      });
    }

    if (w.ph && w.ph.length) {
      html += '<div class="section-label">常用词组</div><div class="phrase-list">';
      w.ph.forEach(p => {
        html += `<div class="phrase"><b>${esc(p.p)}</b><span>${esc(p.c)}</span></div>`;
      });
      html += '</div>';
    }

    if (w.ex && w.ex.length) {
      html += '<div class="section-label">真题例题</div>';
      w.ex.forEach((e, i) => {
        html += `
          <div class="question" data-ex="${i}">
            <p class="q-stem">${esc(e.q)}</p>
            <div class="options">
              ${e.o.map((opt, j) => `
                <div class="option" data-opt="${j}">
                  <span class="letter">${LETTERS[j]}</span>
                  <span>${esc(opt)}</span>
                </div>`).join('')}
            </div>
            <div class="explain" hidden></div>
          </div>`;
      });
    }

    return html;
  }

  function gradeHTML() {
    return `
      <div class="grades">
        <button class="grade g0" data-grade="0">不认识<small>10 分钟后重来</small><kbd>1</kbd></button>
        <button class="grade g1" data-grade="1">模糊<small>短期再见</small><kbd>2</kbd></button>
        <button class="grade g2" data-grade="2">认识<small>拉长间隔</small><kbd>3</kbd></button>
      </div>`;
  }

  /* 绑定单词卡内的交互 */
  function bindCard(root, onGrade) {
    bindCardEl(root.querySelector('.wordcard'), onGrade);
  }

  /* 绑定某一张具体的单词卡（历史记录里展开的详情卡要用） */
  function bindCardEl(card, onGrade) {
    if (!card) return;
    const word = card.dataset.word;
    const level = Store.settings.level;
    const rec = Data.word(level, word);
    if (!rec) return;

    card.addEventListener('click', (ev) => {
      const t = ev.target.closest('[data-act], [data-opt], [data-play], [data-grade]');
      if (!t) return;

      // 播放
      if (t.dataset.play) {
        Sound.playWord(word, t.dataset.play);
        return;
      }
      if (t.dataset.act === 'play-word') {
        Sound.playWord(word, Store.settings.accent);
        return;
      }
      if (t.dataset.act === 'play-sentence') {
        Sound.playSentence(t.dataset.text);
        return;
      }

      // 收藏
      if (t.dataset.act === 'star') {
        const on = Store.toggleWordbook(level, word);
        t.classList.toggle('on', on);
        t.textContent = on ? '★' : '☆';
        toast(on ? '已加入生词本' : '已移出生词本');
        return;
      }

      // 显示释义
      if (t.dataset.act === 'reveal') {
        reveal(card, rec);
        return;
      }

      // 例题选项
      if (t.dataset.opt != null) {
        const q = t.closest('.question');
        if (q.dataset.answered) return;
        const idx = Number(t.dataset.opt);
        const exIdx = Number(q.dataset.ex);
        const ex = rec.ex[exIdx];
        const right = ex.r;
        q.dataset.answered = '1';
        q.querySelectorAll('.option').forEach((el, j) => {
          el.classList.add('disabled');
          if (j === right) el.classList.add('right');
          else if (j === idx) el.classList.add('wrong');
        });
        const exEl = q.querySelector('.explain');
        exEl.hidden = false;
        exEl.innerHTML = `<b>答案：${LETTERS[right]}</b>　${esc(ex.x || '')}`;
        Store.bump('answered', 1);
        if (idx === right) Store.bump('correct', 1);
        else Store.addWrong({ id: `ex:${level}:${word}:${exIdx}`, type: 'word', level, word, chosen: idx });
        return;
      }

      // 评价
      if (t.dataset.grade != null) {
        if (!card.dataset.revealed) reveal(card, rec);
        onGrade(Number(t.dataset.grade));
      }
    });
  }

  function reveal(card, rec) {
    if (card.dataset.revealed) return;
    card.dataset.revealed = '1';
    card.querySelector('[data-zone]').innerHTML = answerHTML(rec);
    if (Store.settings.autoPlay) Sound.playWord(rec.w, Store.settings.accent);
  }

  /* ───────────── 首页 ───────────── */

  async function home(root) {
    const level = Store.settings.level;
    const data = await Data.loadLevel(level);
    const states = Store.allWordStates(level);

    let learned = 0, mastered = 0, due = 0;
    const now = Date.now();
    for (const s of states) {
      if (s.rec.seen > 0) {
        learned++;
        if (s.rec.status === 'mastered') mastered++;
        if (SRS.isDue(s.rec, now)) due++;
      }
    }

    const total = data.list.length;
    const fresh = total - learned;
    const dailyNew = Store.settings.dailyNew;
    const today = Store.today();
    const streak = Store.streak();
    const todayWords = (today.learned || 0) + (today.reviewed || 0);

    const todayPlan = Math.min(dailyNew, Math.max(0, fresh));
    const learnedToday = today.learned || 0;
    const remainToday = Math.max(0, todayPlan - learnedToday);

    const days = Store.last7Days();
    const maxV = Math.max(1, ...days.map(d => d.rec ? (d.rec.learned + d.rec.reviewed) : 0));

    let bars = '';
    days.forEach(d => {
      const v = d.rec ? (d.rec.learned + d.rec.reviewed) : 0;
      const h = Math.round((v / maxV) * 100);
      bars += `<div class="bar-wrap">
        <div class="bar ${v ? '' : 'zero'}" style="height:${v ? Math.max(6, h) : 3}%" title="${d.key}：${v} 次"></div>
        <div class="bar-label">${d.label}</div>
      </div>`;
    });

    const levelLabel = data.meta.lv;

    root.innerHTML = `
      <div class="hero">
        <h1>${learnedToday >= todayPlan && todayPlan > 0 ? '今天的目标完成了 🎉' : '开始今天的学习'}</h1>
        <p>${levelLabel}词库共 ${total} 词，已学 ${learned} 词，待复习 ${due} 词</p>
        <div class="hero-actions">
          <button class="btn btn-primary" data-go="learn">
            ${remainToday > 0 ? `学习新词（还剩 ${remainToday} 个）` : '继续学习'}
          </button>
          <button class="btn btn-ghost" data-go="review">
            ${due > 0 ? `复习 ${due} 词` : '暂无待复习'}
          </button>
        </div>
      </div>

      <div class="grid" style="margin-bottom:14px">
        <div class="stat brand"><div class="v">${learned}</div><div class="k">已学单词</div></div>
        <div class="stat accent"><div class="v">${due}</div><div class="k">待复习</div></div>
        <div class="stat"><div class="v">${mastered}</div><div class="k">已掌握</div></div>
        <div class="stat warn"><div class="v">${streak}</div><div class="k">连续打卡（天）</div></div>
      </div>

      <div class="card">
        <h3 class="card-title">最近 7 天 <span class="sub">每日学习 + 复习次数</span></h3>
        <div class="bars">${bars}</div>
        <div class="legend">
          <span><i style="background:var(--brand)"></i>学习与复习总量</span>
        </div>
      </div>

      <div class="card">
        <h3 class="card-title">今日概览</h3>
        <div class="progress-row">
          <span>新词进度</span><span>${learnedToday} / ${todayPlan}</span>
        </div>
        <div class="progress"><i style="width:${todayPlan ? pct(learnedToday, todayPlan) : 0}%"></i></div>
        <div class="grid" style="margin-top:14px">
          <div class="stat brand"><div class="v">${todayWords}</div><div class="k">今日单词</div></div>
          <div class="stat"><div class="v">${today.reviewed || 0}</div><div class="k">今日复习</div></div>
          <div class="stat accent"><div class="v">${due}</div><div class="k">待复习</div></div>
        </div>
      </div>

      <div class="card">
        <h3 class="card-title">快捷入口</h3>
        <div style="display:flex;gap:10px;flex-wrap:wrap">
          <button class="btn" data-go="quiz">题型练习</button>
          <button class="btn" data-go="words">生词本（${Store.wordbookList(level).length}）</button>
          <button class="btn" data-go="wrong">错题本（${Store.wrong.length}）</button>
          <button class="btn" data-go="stats">学习统计</button>
        </div>
      </div>`;

    root.querySelectorAll('[data-go]').forEach(b => {
      b.addEventListener('click', () => { location.hash = '#/' + b.dataset.go; });
    });
  }

  /* ───────────── 学习 ───────────── */

  async function learn(root) {
    const level = Store.settings.level;
    const data = await Data.loadLevel(level);

    if (!session || session.mode !== 'learn' || session.level !== level) {
      const fresh = data.list.filter(w => !Store.wordState(level, w.w) || Store.wordState(level, w.w).seen === 0);
      const n = Store.settings.dailyNew;
      // 队列统一成 { w: 单词对象 } 的形状，与复习队列保持一致
      const queue = shuffle(fresh).slice(0, n).map(w => ({ w }));
      session = { mode: 'learn', level, queue, idx: 0, revealed: false,
                  stats: { again: 0, hard: 0, good: 0 } };
    }

    renderSession(root);
  }

  /* ───────────── 复习 ───────────── */

  async function review(root) {
    const level = Store.settings.level;
    const data = await Data.loadLevel(level);

    if (!session || session.mode !== 'review' || session.level !== level) {
      const now = Date.now();
      const dueList = [];
      for (const s of Store.allWordStates(level)) {
        if (s.rec.seen > 0 && SRS.isDue(s.rec, now)) {
          const w = Data.word(level, s.word);
          if (w) dueList.push({ w, rec: s.rec });
        }
      }
      dueList.sort((a, b) => a.rec.due - b.rec.due);
      session = { mode: 'review', level, queue: dueList.slice(0, 60), idx: 0,
                  revealed: false, total: dueList.length,
                  stats: { again: 0, hard: 0, good: 0 } };
    }

    renderSession(root);
  }

  /* 渲染学习/复习会话 */
  function renderSession(root) {
    const s = session;

    if (!s.queue.length) {
      root.innerHTML = doneHTML('没有可以学习的单词', '这个等级的词都学过了，去复习吧。', 'review');
      bindDone(root);
      return;
    }

    if (s.idx >= s.queue.length) {
      const st = s.stats;
      const total = st.again + st.hard + st.good;
      root.innerHTML = doneHTML(
        s.mode === 'learn' ? '今日新词完成 🎉' : '本轮复习完成 🎉',
        `本次共 ${total} 个词：认识 ${st.good}，模糊 ${st.hard}，不认识 ${st.again}。`,
        s.mode === 'learn' ? 'review' : 'learn'
      );
      bindDone(root);
      session = null;
      return;
    }

    const item = s.queue[s.idx];
    // 兼容两种队列形状：{w: 单词对象} 或单词对象本身。
    // 注意单词对象自身也有 w 字段（单词字符串），所以必须判断类型，不能直接 item.w || item。
    const w = (item && typeof item.w === 'object' && item.w) ? item.w : item;
    const progress = pct(s.idx, s.queue.length);
    const modeLabel = s.mode === 'learn' ? '学习新词' : '复习';

    root.innerHTML = `
      <div class="page-head">
        <h1>${modeLabel}</h1>
        <p>${s.idx + 1} / ${s.queue.length}${s.mode === 'review' && s.total > 60 ? `（共有 ${s.total} 个待复习）` : ''}</p>
      </div>
      <div class="progress"><i style="width:${progress}%"></i></div>
      <div id="cardSlot" style="margin-top:14px"></div>`;

    const slot = root.querySelector('#cardSlot');
    slot.innerHTML = wordCardHTML(w, { revealed: false });
    bindCard(slot, (grade) => {
      const rec = SRS.review(Store.wordState(s.level, w.w), grade, Date.now());
      Store.setWordState(s.level, w.w, rec);

      if (s.mode === 'learn') Store.bump('learned', 1);
      else Store.bump('reviewed', 1);
      Store.bump('answered', 1);
      if (grade === 2) Store.bump('correct', 1);

      if (grade === 0) s.stats.again++;
      else if (grade === 1) s.stats.hard++;
      else s.stats.good++;

      s.idx++;
      renderSession(root);
    });

    // 键盘
    document.onkeydown = (ev) => {
      if (ev.target.tagName === 'INPUT' || ev.target.tagName === 'SELECT') return;
      if (ev.code === 'Space') {
        ev.preventDefault();
        const card = root.querySelector('.wordcard');
        if (card && !card.dataset.revealed) reveal(card, w);
        return;
      }
      if (['1', '2', '3'].includes(ev.key)) {
        ev.preventDefault();
        const card = root.querySelector('.wordcard');
        if (card && !card.dataset.revealed) reveal(card, w);
        const g = Number(ev.key) - 1;
        const rec = SRS.review(Store.wordState(s.level, w.w), g, Date.now());
        Store.setWordState(s.level, w.w, rec);
        if (s.mode === 'learn') Store.bump('learned', 1);
        else Store.bump('reviewed', 1);
        Store.bump('answered', 1);
        if (g === 2) Store.bump('correct', 1);
        if (g === 0) s.stats.again++; else if (g === 1) s.stats.hard++; else s.stats.good++;
        s.idx++;
        renderSession(root);
      }
      if (ev.key === 'a' || ev.key === 'A') Sound.playWord(w.w, Store.settings.accent);
    };
  }

  function doneHTML(title, sub, next) {
    return `
      <div class="done">
        <div class="em-icon">🎯</div>
        <h2>${esc(title)}</h2>
        <p>${esc(sub)}</p>
        <div class="actions">
          <button class="btn btn-primary" data-go="${next}">${next === 'review' ? '去复习' : '学新词'}</button>
          <button class="btn" data-go="home">回首页</button>
        </div>
      </div>`;
  }

  function bindDone(root) {
    root.querySelectorAll('[data-go]').forEach(b => {
      b.addEventListener('click', () => {
        session = null;
        location.hash = '#/' + b.dataset.go;
      });
    });
  }

  /* ───────────── 生词本 ───────────── */

  async function words(root) {
    const level = Store.settings.level;
    await Data.loadLevel(level);
    const list = Store.wordbookList(level);

    if (!list.length) {
      root.innerHTML = `
        <div class="page-head"><h1>生词本</h1><p>学习时点 ☆ 把不熟的词收进来</p></div>
        <div class="card"><div class="empty">
          <div class="em-icon">📌</div>
          <p>生词本还是空的</p>
          <button class="btn btn-primary" data-go="learn">去学习</button>
        </div></div>`;
      bindDone(root);
      return;
    }

    let rows = '';
    list.forEach(item => {
      const w = Data.word(item.level, item.word);
      if (!w) return;
      const rec = Store.wordState(item.level, item.word);
      const tr = w.tr.map(t => t.c).join('；');
      rows += `
        <div class="list-row" data-w="${esc(item.word)}">
          <span class="w">${esc(item.word)}</span>
          <span class="tr">${esc(tr)}</span>
          <span class="tag-pill ${SRS.statusClass(rec)}">${SRS.statusLabel(rec)}</span>
          <button class="icon-btn" data-play="${esc(item.word)}" title="发音">🔊</button>
          <button class="icon-btn" data-rm="${esc(item.word)}" title="移出">✕</button>
        </div>`;
    });

    root.innerHTML = `
      <div class="page-head"><h1>生词本</h1><p>共 ${list.length} 个词</p></div>
      <div class="card"><div class="list">${rows}</div></div>`;

    root.addEventListener('click', (ev) => {
      const play = ev.target.closest('[data-play]');
      if (play) { Sound.playWord(play.dataset.play, Store.settings.accent); return; }
      const rm = ev.target.closest('[data-rm]');
      if (rm) {
        Store.toggleWordbook(level, rm.dataset.rm);
        words(root);
        return;
      }
    });
  }

  /* ───────────── 单词历史（参照墨墨背单词的学习记录） ───────────── */

  let historyUI = { q: '', filter: 'all', open: null };

  function startOfToday() {
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
  }

  function dateLabel(ts) {
    if (!ts) return '未知日期';
    const d = new Date(ts);
    const today = startOfToday();
    const that = new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
    const diff = Math.round((today - that) / 86400000);
    if (diff === 0) return '今天';
    if (diff === 1) return '昨天';
    if (diff < 7) return `${diff} 天前`;
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return y === new Date().getFullYear() ? `${m}-${dd}` : `${y}-${m}-${dd}`;
  }

  function timeLabel(ts) {
    if (!ts) return '';
    const d = new Date(ts);
    return `${dateLabel(ts)} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  }

  /** 按当前筛选条件取历史条目 */
  function historyItems() {
    const level = Store.settings.level;
    const now = Date.now();
    let list = Store.historyList(level)
      .map(it => ({ word: it.word, rec: it.rec, data: Data.word(level, it.word) }))
      .filter(it => it.data);

    switch (historyUI.filter) {
      case 'today':
        list = list.filter(x => (x.rec.first || 0) >= startOfToday());
        break;
      case 'week':
        list = list.filter(x => (x.rec.first || 0) >= now - 7 * 86400000);
        break;
      case 'mastered':
        list = list.filter(x => x.rec.status === 'mastered');
        break;
      case 'hard':
        list = list.filter(x => (x.rec.lapses || 0) >= 2);
        break;
      default:
        break;
    }

    const q = historyUI.q.trim().toLowerCase();
    if (q) {
      list = list.filter(x =>
        x.word.toLowerCase().includes(q) ||
        (x.data.tr || []).some(t => (t.c || '').toLowerCase().includes(q))
      );
    }
    return list;
  }

  /** 只重绘列表区，避免搜索框失焦 */
  function renderHistoryList(box) {
    const items = historyItems();
    if (!items.length) {
      box.innerHTML = `<div class="empty">
        <div class="em-icon">🗂️</div>
        <p>${historyUI.q ? '没有匹配的单词' : '还没有学习记录'}</p>
        ${historyUI.q ? '' : '<button class="btn btn-primary" data-go="learn">去学习</button>'}
      </div>`;
      box.querySelectorAll('[data-go]').forEach(b => {
        b.addEventListener('click', () => { location.hash = '#/' + b.dataset.go; });
      });
      return;
    }

    // 按首次学习日期分组
    const groups = [];
    const index = new Map();
    for (const it of items) {
      const label = dateLabel(it.rec.first || it.rec.last);
      if (!index.has(label)) {
        const g = { label, items: [] };
        index.set(label, g);
        groups.push(g);
      }
      index.get(label).items.push(it);
    }

    let html = '';
    for (const g of groups) {
      html += `<div class="hist-group">
        <div class="hist-group-head">
          <span>${esc(g.label)}</span>
          <span class="hist-count">${g.items.length} 个</span>
        </div>`;

      for (const it of g.items) {
        const w = it.data;
        const rec = it.rec;
        const tr = (w.tr || []).slice(0, 2).map(t => (t.p ? t.p + '. ' : '') + t.c).join('；');
        const phon = fmtPhonetic(w.uk || w.us);
        const open = historyUI.open === it.word;
        html += `
          <div class="hist-row ${open ? 'open' : ''}" data-w="${esc(it.word)}">
            <span class="hist-word">${esc(it.word)}</span>
            <span class="hist-phon">${esc(phon)}</span>
            <span class="hist-tr">${esc(tr)}</span>
            <span class="tag-pill ${SRS.statusClass(rec)}">${SRS.statusLabel(rec)}</span>
            <span class="hist-meta">复习 ${rec.seen || 0} 次${rec.lapses ? ` · 忘 ${rec.lapses}` : ''}</span>
            <button class="icon-btn" data-play="${esc(it.word)}" title="发音">🔊</button>
            <span class="hist-caret">${open ? '▴' : '▾'}</span>
          </div>
          <div class="hist-detail" ${open ? '' : 'hidden'} data-detail="${esc(it.word)}"></div>`;
      }
      html += '</div>';
    }
    box.innerHTML = html;

    // 展开已打开的词
    if (historyUI.open) {
      const detail = box.querySelector(`[data-detail="${CSS.escape(historyUI.open)}"]`);
      const item = items.find(x => x.word === historyUI.open);
      if (detail && item) {
        detail.innerHTML = wordCardHTML(item.data, { revealed: true, grades: false });
        bindCardEl(detail.querySelector('.wordcard'), () => {});
      }
    }
  }

  async function history(root) {
    const level = Store.settings.level;
    const data = await Data.loadLevel(level);
    const all = Store.historyList(level);

    root.innerHTML = `
      <div class="page-head">
        <h1>单词历史</h1>
        <p>${data.meta.lv}词库 · 共学过 ${all.length} 个词，点任意单词可回顾详情</p>
      </div>

      <div class="card">
        <input class="search" id="histSearch" type="search"
               placeholder="搜索单词或中文释义…" value="${esc(historyUI.q)}">
        <div class="chips" id="histFilter" style="margin-top:12px">
          ${[['all', '全部'], ['today', '今天'], ['week', '近 7 天'], ['mastered', '已掌握'], ['hard', '易忘']]
            .map(([k, label]) => `<button class="chip ${historyUI.filter === k ? 'on' : ''}" data-filter="${k}">${label}</button>`)
            .join('')}
        </div>
      </div>

      <div class="card" id="histList"></div>`;

    const box = root.querySelector('#histList');
    renderHistoryList(box);

    // 搜索
    const input = root.querySelector('#histSearch');
    input.addEventListener('input', () => {
      historyUI.q = input.value;
      renderHistoryList(box);
    });

    // 筛选
    root.querySelector('#histFilter').addEventListener('click', (e) => {
      const b = e.target.closest('[data-filter]');
      if (!b) return;
      historyUI.filter = b.dataset.filter;
      root.querySelectorAll('#histFilter .chip').forEach(c => c.classList.toggle('on', c.dataset.filter === b.dataset.filter));
      renderHistoryList(box);
    });

    // 行交互：展开 / 发音
    box.addEventListener('click', (ev) => {
      const play = ev.target.closest('[data-play]');
      if (play) {
        ev.stopPropagation();
        Sound.playWord(play.dataset.play, Store.settings.accent);
        return;
      }
      const row = ev.target.closest('.hist-row');
      if (!row) return;
      const word = row.dataset.w;
      historyUI.open = historyUI.open === word ? null : word;
      renderHistoryList(box);
      if (historyUI.open) {
        const el = box.querySelector(`[data-detail="${CSS.escape(word)}"]`);
        if (el) el.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      }
    });
  }

  /* ───────────── 错题本 ───────────── */

  async function wrong(root) {
    const level = Store.settings.level;
    await Data.loadLevel(level);
    const list = Store.wrong;

    if (!list.length) {
      root.innerHTML = `
        <div class="page-head"><h1>错题本</h1><p>做错的题目会自动记录在这里</p></div>
        <div class="card"><div class="empty">
          <div class="em-icon">✅</div>
          <p>还没有错题</p>
          <button class="btn btn-primary" data-go="quiz">去做题</button>
        </div></div>`;
      bindDone(root);
      return;
    }

    let rows = '';
    list.forEach(item => {
      const label = item.type === 'word' ? '词汇题'
                  : item.type === 'reading' ? '仔细阅读'
                  : item.type === 'cloze' ? '选词填空'
                  : item.type === 'matching' ? '长篇阅读' : '题目';
      const desc = item.word ? item.word : (item.title || item.id);
      const when = new Date(item.at).toLocaleDateString('zh-CN');
      rows += `
        <div class="list-row">
          <span class="w" style="min-width:auto">${esc(desc)}</span>
          <span class="tr">${esc(label)}${item.times > 1 ? ` · 错 ${item.times} 次` : ''}</span>
          <span class="meta">${when}</span>
          <button class="icon-btn" data-rm="${esc(item.id)}" title="移除">✕</button>
        </div>`;
    });

    root.innerHTML = `
      <div class="page-head"><h1>错题本</h1><p>共 ${list.length} 条</p></div>
      <div class="card">
        <div style="margin-bottom:12px">
          <button class="btn btn-sm" data-clear>清空错题本</button>
        </div>
        <div class="list">${rows}</div>
      </div>`;

    root.addEventListener('click', (ev) => {
      const rm = ev.target.closest('[data-rm]');
      if (rm) { Store.removeWrong(rm.dataset.rm); wrong(root); return; }
      if (ev.target.closest('[data-clear]')) {
        if (confirm('确定清空全部错题？')) { Store.clearWrong(); wrong(root); }
      }
    });
  }

  /* ───────────── 统计 ───────────── */

  async function stats(root) {
    const level = Store.settings.level;
    const data = await Data.loadLevel(level);
    const states = Store.allWordStates(level);

    let learned = 0, mastered = 0, review = 0, learning = 0, due = 0;
    const now = Date.now();
    for (const s of states) {
      if (s.rec.seen > 0) {
        learned++;
        if (s.rec.status === 'mastered') mastered++;
        else if (s.rec.status === 'review') review++;
        else learning++;
        if (SRS.isDue(s.rec, now)) due++;
      }
    }
    const total = data.list.length;
    const untouched = total - learned;

    const days = Store.last7Days();
    const maxV = Math.max(1, ...days.map(d => d.rec ? (d.rec.learned + d.rec.reviewed) : 0));
    let bars = '';
    days.forEach(d => {
      const v = d.rec ? (d.rec.learned + d.rec.reviewed) : 0;
      bars += `<div class="bar-wrap">
        <div class="bar ${v ? '' : 'zero'}" style="height:${v ? Math.max(6, Math.round(v / maxV * 100)) : 3}%"></div>
        <div class="bar-label">${d.label}</div>
      </div>`;
    });

    const td = Store.today();
    const todayWords = (td.learned || 0) + (td.reviewed || 0);

    root.innerHTML = `
      <div class="page-head"><h1>学习统计</h1><p>${data.meta.lv}词库 · 共 ${total} 词</p></div>

      <div class="grid" style="margin-bottom:14px">
        <div class="stat brand"><div class="v">${learned}</div><div class="k">已学</div></div>
        <div class="stat"><div class="v">${mastered}</div><div class="k">已掌握</div></div>
        <div class="stat accent"><div class="v">${due}</div><div class="k">待复习</div></div>
        <div class="stat warn"><div class="v">${Store.streak()}</div><div class="k">连续打卡</div></div>
      </div>

      <div class="card">
        <h3 class="card-title">词库进度</h3>
        <div class="progress-row"><span>已学 ${learned} / ${total}</span><span>${pct(learned, total)}%</span></div>
        <div class="progress"><i style="width:${pct(learned, total)}%"></i></div>
        <div class="grid" style="margin-top:14px">
          <div class="stat"><div class="v">${learning}</div><div class="k">学习中</div></div>
          <div class="stat"><div class="v">${review}</div><div class="k">复习中</div></div>
          <div class="stat"><div class="v">${mastered}</div><div class="k">已掌握</div></div>
          <div class="stat"><div class="v">${untouched}</div><div class="k">未开始</div></div>
        </div>
      </div>

      <div class="card">
        <h3 class="card-title">最近 7 天</h3>
        <div class="bars">${bars}</div>
        <div class="grid" style="margin-top:14px">
          <div class="stat brand"><div class="v">${todayWords}</div><div class="k">今日单词</div></div>
          <div class="stat"><div class="v">${Store.wrong.length}</div><div class="k">错题数</div></div>
          <div class="stat"><div class="v">${Store.wordbookList(level).length}</div><div class="k">生词本</div></div>
        </div>
      </div>`;
  }

  /* ───────────── 设置 ───────────── */

  async function settings(root) {
    const st = Store.settings;
    const idx = await Data.loadIndex();
    const b4 = idx.books.cet4, b6 = idx.books.cet6;

    root.innerHTML = `
      <div class="page-head"><h1>设置</h1><p>所有数据保存在本机浏览器，不会上传</p></div>

      <div class="card">
        <h3 class="card-title">学习计划</h3>
        <div class="field">
          <label>每日新词数<small>建议 15–30，太多容易坚持不下去</small></label>
          <input type="number" min="5" max="100" step="5" id="dailyNew" value="${st.dailyNew}">
        </div>
        <div class="field">
          <label>当前词库<small>四级 ${b4.count} 词 / 六级 ${b6.count} 词</small></label>
          <div class="seg" id="levelSeg">
            <button data-lv="cet4" class="${st.level === 'cet4' ? 'on' : ''}">四级</button>
            <button data-lv="cet6" class="${st.level === 'cet6' ? 'on' : ''}">六级</button>
          </div>
        </div>
      </div>

      <div class="card">
        <h3 class="card-title">发音</h3>
        <div class="field">
          <label>默认口音<small>点击音标可单独播放另一种</small></label>
          <div class="seg" id="accentSeg">
            <button data-accent="us" class="${st.accent === 'us' ? 'on' : ''}">美音</button>
            <button data-accent="uk" class="${st.accent === 'uk' ? 'on' : ''}">英音</button>
          </div>
        </div>
        <div class="field">
          <label>显示释义后自动发音</label>
          <div class="switch ${st.autoPlay ? 'on' : ''}" id="autoPlay"></div>
        </div>
      </div>

      <div class="card">
        <h3 class="card-title">数据</h3>
        <p style="color:var(--text-2);font-size:13.5px;margin:0 0 14px">
          换电脑或浏览器前先导出备份，导入后进度就能恢复。
        </p>
        <div style="display:flex;gap:10px;flex-wrap:wrap">
          <button class="btn" id="exportBtn">导出进度</button>
          <button class="btn" id="importBtn">导入进度</button>
          <button class="btn" id="resetBtn" style="color:var(--bad);border-color:var(--bad)">清空全部</button>
        </div>
        <input type="file" id="fileInput" accept=".json,application/json" hidden>
      </div>

      <div class="card">
        <h3 class="card-title">关于</h3>
        <p style="color:var(--text-2);font-size:13.5px;margin:0">
          词库来自开源项目 <a href="https://github.com/kajweb/dict" target="_blank" rel="noopener">kajweb/dict</a>；
          发音使用有道词典公开接口；题型练习为本站原创编写。<br>
          学习记录保存在浏览器 localStorage，清除浏览器数据会一并丢失，请定期导出备份。
        </p>
      </div>`;

    root.querySelector('#dailyNew').addEventListener('change', (e) => {
      const v = Math.max(5, Math.min(100, Number(e.target.value) || 20));
      e.target.value = v;
      Store.settings.dailyNew = v;
      Store.save();
      toast('已保存');
    });

    root.querySelector('#levelSeg').addEventListener('click', (e) => {
      const b = e.target.closest('[data-lv]');
      if (!b) return;
      Store.settings.level = b.dataset.lv;
      Store.save();
      App.refreshLevelBar();
      settings(root);
      toast('已切换到' + (b.dataset.lv === 'cet4' ? '四级' : '六级'));
    });

    root.querySelector('#accentSeg').addEventListener('click', (e) => {
      const b = e.target.closest('[data-accent]');
      if (!b) return;
      Store.settings.accent = b.dataset.accent;
      Store.save();
      Sound.playWord('hello', b.dataset.accent);
      settings(root);
    });

    root.querySelector('#autoPlay').addEventListener('click', (e) => {
      Store.settings.autoPlay = !Store.settings.autoPlay;
      e.currentTarget.classList.toggle('on', Store.settings.autoPlay);
      Store.save();
    });

    root.querySelector('#exportBtn').addEventListener('click', () => {
      const blob = new Blob([Store.exportData()], { type: 'application/json' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = `cet-progress-${Store.dayKey()}.json`;
      a.click();
      setTimeout(() => URL.revokeObjectURL(a.href), 3000);
      toast('已导出');
    });

    root.querySelector('#importBtn').addEventListener('click', () => {
      root.querySelector('#fileInput').click();
    });

    root.querySelector('#fileInput').addEventListener('change', (e) => {
      const f = e.target.files[0];
      if (!f) return;
      const r = new FileReader();
      r.onload = () => {
        try {
          Store.importData(r.result);
          toast('导入成功');
          setTimeout(() => location.reload(), 600);
        } catch (err) {
          toast('文件格式不对');
        }
      };
      r.readAsText(f);
    });

    root.querySelector('#resetBtn').addEventListener('click', () => {
      if (confirm('确定清空全部学习记录？此操作不可恢复。')) {
        Store.reset();
        toast('已清空');
        setTimeout(() => location.reload(), 500);
      }
    });
  }

  return { home, learn, review, history, words, wrong, stats, settings,
           get session() { return session; }, resetSession() { session = null; } };
})();
