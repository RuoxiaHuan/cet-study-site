/* 渲染自测：用桩 DOM 调用各页面渲染函数，验证模板输出与无运行时异常 */
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.join(__dirname, '..');
let fails = 0;
const ok = (c, m) => { if (!c) { fails++; console.log('  ✗ ' + m); } else console.log('  ✓ ' + m); };

/* ── 桩 DOM ── */
function makeEl() {
  const el = {
    _html: '',
    _children: {},
    dataset: {},
    hidden: false,
    style: {},
    value: '',
    classList: { add() {}, remove() {}, toggle() {}, contains: () => false },
    set innerHTML(v) { this._html = String(v); },
    get innerHTML() { return this._html; },
    get textContent() { return String(this._html).replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim(); },
    // 同一个选择器返回同一个子元素，便于断言"先写占位、再填内容"的渲染
    querySelector(sel) {
      if (!this._children[sel]) this._children[sel] = makeEl();
      return this._children[sel];
    },
    querySelectorAll: () => [],
    addEventListener() {},
    dispatchEvent() {},
    closest: () => null,
    appendChild() {},
    click() {},
  };
  return el;
}

const storage = {};
const siteFiles = {};

const sandbox = {
  console,
  setTimeout, clearTimeout,
  URL,
  Blob: function () {},
  localStorage: {
    getItem: k => (k in storage ? storage[k] : null),
    setItem: (k, v) => { storage[k] = String(v); },
    removeItem: k => { delete storage[k]; },
  },
  document: {
    addEventListener() {},
    getElementById: () => makeEl(),
    querySelector: () => makeEl(),
    querySelectorAll: () => [],
    createElement: () => makeEl(),
    body: { appendChild() {} },
  },
  location: { hash: '#/home', reload() {} },
  navigator: { language: 'zh-CN' },
  CSS: { escape: (s) => String(s) },
  speechSynthesis: { getVoices: () => [], speak() {}, cancel() {}, onvoiceschanged: null },
  SpeechSynthesisUtterance: function () {},
  Audio: function () { return { play: () => Promise.resolve(), pause() {}, currentTime: 0 }; },
  confirm: () => false,
  alert: () => {},
  fetch: async (url) => {
    const rel = String(url).replace(/^\.\//, '');
    const p = path.join(ROOT, rel);
    if (!fs.existsSync(p)) return { ok: false, status: 404, json: async () => ({}) };
    const data = fs.readFileSync(p, 'utf8');
    return { ok: true, status: 200, json: async () => JSON.parse(data), text: async () => data };
  },
};
sandbox.window = sandbox;
sandbox.globalThis = sandbox;
vm.createContext(sandbox);

['src/store.js', 'src/srs.js', 'src/audio.js', 'src/data.js', 'src/util.js',
 'src/quiz-data.js', 'src/quiz.js', 'src/pages.js'].forEach(f => {
  vm.runInContext(fs.readFileSync(path.join(ROOT, f), 'utf8'), sandbox, { filename: f });
});

const Pages = vm.runInContext('Pages', sandbox);
const Quiz = vm.runInContext('Quiz', sandbox);
const Store = vm.runInContext('Store', sandbox);

/* ── 各页面渲染 ── */
(async () => {
  const cases = [
    ['home', Pages.home, [/开始今天的学习|今天的目标完成了/, /已学单词/, /连续打卡/, /今日单词/]],
    ['stats', Pages.stats, [/学习统计/, /词库进度/, /最近 7 天/, /今日单词/]],
    ['settings', Pages.settings, [/每日新词数/, /默认口音/, /导出进度/]],
    ['words', Pages.words, [/生词本/]],
    ['wrong', Pages.wrong, [/错题本/]],
  ];

  /* 首页与统计页不应再出现"正确率" */
  for (const [name, fn] of cases.filter(c => c[0] === 'home' || c[0] === 'stats')) {
    console.log(`\n▶ Pages.${name} — 已移除正确率`);
    const root = makeEl();
    try {
      await fn(root);
      ok(!/正确率/.test(root.innerHTML), '页面不含"正确率"');
      ok(/今日单词/.test(root.innerHTML), '显示"今日单词"');
    } catch (e) { fails++; console.log('  ✗ 异常: ' + e.message); }
  }

  for (const [name, fn, pats] of cases) {
    console.log(`\n▶ Pages.${name}`);
    const root = makeEl();
    try {
      await fn(root);
      ok(root.innerHTML.length > 100, `输出 ${root.innerHTML.length} 字符`);
      pats.forEach(re => ok(re.test(root.innerHTML), `包含 ${re}`));
    } catch (e) {
      fails++;
      console.log('  ✗ 抛出异常: ' + e.message);
    }
  }

  console.log('\n▶ Pages.learn');
  {
    const root = makeEl();
    try {
      Store.settings.level = 'cet4';
      Pages.resetSession();
      await Pages.learn(root);
      ok(root.innerHTML.includes('学习新词') || root.innerHTML.includes('今日新词完成'), '学习页渲染');

      // 关键：卡片区必须真的填进一个单词，而不是空壳
      const slot = root._children['#cardSlot'];
      ok(!!slot, '存在卡片容器 #cardSlot');
      if (slot) {
        const html = slot.innerHTML;
        ok(html.length > 200, `卡片区有内容（${html.length} 字符）`);
        const m = html.match(/<div class="word">([^<]*)<\/div>/);
        ok(!!m, '卡片含 .word 元素');
        ok(m && m[1].trim().length > 0, `单词非空（实际 "${m ? m[1] : '(无)'}"）`);
        const phon = html.match(/<div class="phonetics">([\s\S]*?)<\/div>/);
        ok(!!phon, '卡片含音标区');
        ok(!!html.match(/data-grade="0"/), '卡片含三档评价按钮');
      }

      // 不变量：队列元素必须是 { w: 单词对象 }，不能是单词对象本身
      const s = Pages.session;
      ok(!!s && Array.isArray(s.queue) && s.queue.length > 0, `学会话队列非空（${s ? s.queue.length : 0}）`);
      ok(s && s.queue.every(it => it && typeof it.w === 'object' && it.w),
        '队列元素形状统一为 { w: 对象 }');
      ok(s && s.queue.every(it => typeof it.w.w === 'string' && it.w.w.length > 0),
        '队列里的 w 字段是单词字符串');
    } catch (e) { fails++; console.log('  ✗ 异常: ' + e.message); }
  }

  console.log('\n▶ Pages.review');
  {
    const root = makeEl();
    try {
      Pages.resetSession();
      // 构造一个已到期（3 天前学的）单词，确保复习队列非空
      const SRSx = vm.runInContext('SRS', sandbox);
      const data4 = vm.runInContext('Data', sandbox);
      await data4.loadLevel('cet4');
      const target = data4.get('cet4').list[0].w;
      Store.setWordState('cet4', target, SRSx.review(null, 2, Date.now() - 3 * 86400000));

      await Pages.review(root);
      ok(/复习|没有可以学习的单词|本轮复习完成/.test(root.innerHTML), '复习页渲染');

      const s = Pages.session;
      ok(!!s && s.queue.length >= 1, `复习队列包含到期词（${s ? s.queue.length : 0}）`);
      ok(s && s.queue.every(it => it && typeof it.w === 'object'), '复习队列形状正确');

      const slot = root._children['#cardSlot'];
      ok(!!slot, '复习页有卡片容器');
      if (slot) {
        const m = slot.innerHTML.match(/<div class="word">([^<]*)<\/div>/);
        ok(m && m[1].trim().length > 0, `复习卡显示单词（实际 "${m ? m[1] : '(无)'}"）`);
        ok(m && m[1].trim() === target, `复习卡单词正确（期望 ${target}）`);
      }
    } catch (e) { fails++; console.log('  ✗ 异常: ' + e.message); }
  }

  /* ── 题型练习三种题型 ── */
  /* ── 单词历史 ── */
  console.log('\n▶ Pages.history');
  {
    const root = makeEl();
    try {
      const SRSx = vm.runInContext('SRS', sandbox);
      const data4 = vm.runInContext('Data', sandbox);
      await data4.loadLevel('cet4');
      const list = data4.get('cet4').list;
      // 造 3 条历史：今天 2 个、3 天前 1 个
      const now = Date.now();
      Store.setWordState('cet4', list[0].w, SRSx.review(null, 2, now));
      Store.setWordState('cet4', list[1].w, SRSx.review(null, 1, now - 60000));
      Store.setWordState('cet4', list[2].w, SRSx.review(null, 0, now - 3 * 86400000));

      await Pages.history(root);
      const html = root.innerHTML;
      ok(html.includes('单词历史'), '标题渲染');
      ok(html.includes('今天'), '出现「今天」分组');

      const box = root._children['#histList'];
      ok(!!box, '存在列表容器');
      ok(box && /hist-row/.test(box.innerHTML), '列表渲染出行');
      const rows = box ? (box.innerHTML.match(/class="hist-row/g) || []).length : 0;
      ok(rows === 3, `3 条学习记录都列出来了（实际 ${rows}）`);
      ok(box && /hist-group-head/.test(box.innerHTML), '按日期分组');
      ok(box && box.innerHTML.includes('复习 1 次'), '显示复习次数');
      ok(box && /tag-pill/.test(box.innerHTML), '显示掌握状态');
      ok(box && /hist-phon/.test(box.innerHTML), '显示音标');
    } catch (e) { fails++; console.log('  ✗ 异常: ' + e.message); }
  }

  console.log('\n▶ Quiz 菜单');
  {
    Quiz.reset();
    const root = makeEl();
    try {
      await Quiz.render(root);
      ok(root.innerHTML.includes('题型练习'), '菜单渲染');
      ok(root.innerHTML.includes('单项选择'), '有词汇题入口');
      ok(root.innerHTML.includes('仔细阅读'), '有仔细阅读入口');
      ok(root.innerHTML.includes('选词填空'), '有选词填空入口');
      ok(root.innerHTML.includes('长篇阅读'), '有长篇阅读入口');
    } catch (e) { fails++; console.log('  ✗ 异常: ' + e.message); }
  }

  console.log('\n▶ Quiz 仔细阅读');
  {
    Quiz.reset();
    const t = Quiz.__test;
    try {
      t.startSet('reading');
      const root = makeEl();
      t.renderReading(root);
      const html = root.innerHTML;
      ok(html.includes('短文'), '有短文区');
      ok((html.match(/class="option"/g) || []).length === 20, `5 题 × 4 选项 = 20（实际 ${(html.match(/class="option"/g) || []).length}）`);
      ok(html.includes('explain'), '有解析区块');
    } catch (e) { fails++; console.log('  ✗ 异常: ' + e.message); }
  }

  console.log('\n▶ Quiz 选词填空');
  {
    Quiz.reset();
    const t = Quiz.__test;
    try {
      t.startSet('cloze');
      const root = makeEl();
      t.renderCloze(root);
      const html = root.innerHTML;
      ok((html.match(/class="blank/g) || []).length === 10, `10 个空（实际 ${(html.match(/class="blank/g) || []).length}）`);
      ok((html.match(/bank-item/g) || []).length >= 15, '备选词 ≥15');
      ok(html.includes('提交答案'), '有提交按钮');
    } catch (e) { fails++; console.log('  ✗ 异常: ' + e.message); }
  }

  console.log('\n▶ Quiz 长篇阅读匹配');
  {
    Quiz.reset();
    const t = Quiz.__test;
    try {
      t.startSet('matching');
      const root = makeEl();
      t.renderMatching(root);
      const html = root.innerHTML;
      ok((html.match(/class="match-item/g) || []).length === 10, '10 条匹配陈述');
      ok((html.match(/<select/g) || []).length === 10, '10 个下拉框');
      ok(html.includes('para-label'), '段落带字母标号');
    } catch (e) { fails++; console.log('  ✗ 异常: ' + e.message); }
  }

  console.log('\n▶ Quiz 词汇题');
  {
    Quiz.reset();
    const t = Quiz.__test;
    try {
      t.startWords();
      const root = makeEl();
      t.renderWords(root);
      const html = root.innerHTML;
      ok((html.match(/class="option"/g) || []).length === 4, '4 个选项');
      ok(html.includes('下一题'), '有下一题按钮');
    } catch (e) { fails++; console.log('  ✗ 异常: ' + e.message); }
  }

  console.log('\n' + '─'.repeat(50));
  console.log(fails === 0 ? '渲染自测全部通过 ✅' : `有 ${fails} 处失败 ❌`);
  process.exit(fails ? 1 : 0);
})();
