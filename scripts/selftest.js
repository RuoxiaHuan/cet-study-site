/* 自测：在 node 里跑核心逻辑与题库完整性校验 */
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.join(__dirname, '..');
let fails = 0;
function ok(cond, msg) {
  if (!cond) { fails++; console.log('  ✗ ' + msg); }
  else console.log('  ✓ ' + msg);
}

/* ── 最小 DOM 沙箱 ── */
const storeData = {};
const sandbox = {
  console,
  setTimeout, clearTimeout,
  localStorage: {
    getItem: k => (k in storeData ? storeData[k] : null),
    setItem: (k, v) => { storeData[k] = String(v); },
    removeItem: k => { delete storeData[k]; },
  },
  window: {},
  document: { addEventListener() {}, querySelector: () => null, querySelectorAll: () => [] },
  fetch: async () => { throw new Error('no fetch in test'); },
  SpeechSynthesisUtterance: function () {},
  Audio: function () { this.play = () => Promise.resolve(); },
};
sandbox.globalThis = sandbox;
vm.createContext(sandbox);

function load(file) {
  const code = fs.readFileSync(path.join(root, file), 'utf8');
  vm.runInContext(code, sandbox, { filename: file });
}

console.log('▶ 加载脚本');
load('src/store.js');
load('src/srs.js');
load('src/util.js');
load('src/quiz-data.js');

const Store = vm.runInContext('Store', sandbox);
const SRS = vm.runInContext('SRS', sandbox);
const QUIZ = vm.runInContext('QUIZ', sandbox);
const { esc, pct, fmtPhonetic, highlight } = sandbox;

/* ── 工具函数 ── */
console.log('\n▶ 工具函数');
ok(esc('<b>"x"</b>') === '&lt;b&gt;&quot;x&quot;&lt;/b&gt;', 'esc 转义 HTML');
ok(pct(1, 4) === 25, 'pct 计算百分比');
ok(fmtPhonetic('rɪ\'fjuːz') === "/rɪ'fjuːz/", 'fmtPhonetic 补斜杠');
ok(fmtPhonetic('/x/') === '/x/', 'fmtPhonetic 不重复加斜杠');
ok(highlight('She refused.', 'refuse').includes('hl'), 'highlight 高亮词形变化');

/* ── SRS 算法 ── */
console.log('\n▶ SRS 间隔重复');
const T0 = 1700000000000;
let r = SRS.review(null, 2, T0);
ok(r.interval === 1 && r.reps === 1, '首次答对 → 间隔 1 天');
ok(r.due === T0 + SRS.DAY_MS, '首次答对 → 到期时间为 1 天后');
ok(r.status === 'review', '首次答对 → 状态 review');

r = SRS.review(r, 2, T0 + SRS.DAY_MS);
ok(r.interval === 3 && r.reps === 2, '第二次答对 → 间隔 3 天');

r = SRS.review(r, 2, T0 + 4 * SRS.DAY_MS);
ok(r.interval === Math.round(3 * r.ef), '第三次起按 EF 增长');

const beforeEf = r.ef;
r = SRS.review(r, 0, T0 + 10 * SRS.DAY_MS);
ok(r.reps === 0 && r.interval === 0, '答错 → 重置间隔');
ok(r.lapses === 1, '答错 → 遗忘次数 +1');
ok(r.ef < beforeEf, '答错 → 难度因子下降');
ok(r.due === T0 + 10 * SRS.DAY_MS + SRS.AGAIN_MS, '答错 → 10 分钟后重来');

let low = { ef: 1.35, interval: 5, reps: 4, lapses: 0, due: 0, seen: 3, correct: 3, status: 'review' };
low = SRS.review(low, 0, T0);
ok(low.ef >= 1.3, 'EF 下限 1.3 不被击穿');

let hi = { ef: 2.75, interval: 20, reps: 5, lapses: 0, due: 0, seen: 3, correct: 3, status: 'review' };
hi = SRS.review(hi, 2, T0);
ok(hi.ef <= 2.8, 'EF 上限 2.8 不被击穿');

ok(SRS.isDue({ due: T0 - 1 }, T0) === true, 'isDue 过期返回 true');
ok(SRS.isDue({ due: T0 + 1000 }, T0) === false, 'isDue 未到期返回 false');
ok(SRS.statusLabel({ seen: 0, status: 'new' }) === '未学', 'statusLabel 未学');

/* ── Store ── */
console.log('\n▶ Store 存储层');
Store.load();
ok(Store.settings.dailyNew === 20, '默认每日新词 20');
ok(Store.wordState('cet4', 'abandon') === null, '未学词无记录');

Store.setWordState('cet4', 'abandon', SRS.review(null, 2, T0));
ok(Store.wordState('cet4', 'abandon').reps === 1, '写入单词状态');
ok(Store.allWordStates('cet4').length === 1, 'allWordStates 过滤等级');
ok(Store.allWordStates('cet6').length === 0, 'allWordStates 不串等级');

Store.toggleWordbook('cet4', 'abandon');
ok(Store.inWordbook('cet4', 'abandon'), '加入生词本');
ok(Store.wordbookList('cet4').length === 1, '生词本列表');
Store.toggleWordbook('cet4', 'abandon');
ok(!Store.inWordbook('cet4', 'abandon'), '移出生词本');

Store.addWrong({ id: 'x1', type: 'word', word: 'test' });
Store.addWrong({ id: 'x1', type: 'word', word: 'test' });
ok(Store.wrong.length === 1, '错题去重不重复插入');
ok(Store.wrong[0].times === 2, '重复错题累加次数');

Store.bump('learned', 5);
ok(Store.today().learned === 5, '今日计数累加');

/* ── 历史记录 ── */
console.log('\n▶ 历史记录');
const hist = Store.historyList('cet4');
ok(hist.length === 1, 'historyList 只返回学过的词');
ok(hist[0].word === 'abandon', 'historyList 带单词');
ok(hist[0].rec.first > 0, '记录含首次学习时间 first');
ok(Store.historyList('cet6').length === 0, 'historyList 不串等级');

const r0 = SRS.create(T0);
ok(r0.first === T0, 'SRS.create 写入 first');
const r1 = SRS.review({ ef: 2.5, interval: 1, reps: 1, lapses: 0, due: 0, last: 0, seen: 1, correct: 1, status: 'review' }, 2, T0 + 1000);
ok(r1.first === T0 + 1000, '旧记录无 first 时自动补上');

/* ── 题库完整性 ── */
console.log('\n▶ 题库完整性');

QUIZ.reading.forEach(set => {
  ok(set.questions.length > 0, `[阅读] ${set.id} 有题目`);
  set.questions.forEach((q, i) => {
    if (!(q.answer >= 0 && q.answer < q.options.length)) {
      fails++; console.log(`  ✗ [阅读] ${set.id} 第${i + 1}题答案下标越界`);
    }
    if (q.options.length !== 4) {
      fails++; console.log(`  ✗ [阅读] ${set.id} 第${i + 1}题选项数不是 4`);
    }
    if (!q.explain) {
      fails++; console.log(`  ✗ [阅读] ${set.id} 第${i + 1}题缺解析`);
    }
  });
});
ok(true, '仔细阅读：答案下标、选项数、解析齐全');

QUIZ.cloze.forEach(set => {
  const blanksInPassage = (set.passage.match(/__(\d+)__/g) || []).map(s => s.replace(/__/g, ''));
  const answerKeys = Object.keys(set.answers);
  ok(blanksInPassage.length === answerKeys.length,
    `[选词] ${set.id} 空位数(${blanksInPassage.length})与答案数(${answerKeys.length})一致`);

  blanksInPassage.forEach(n => {
    if (!(n in set.answers)) { fails++; console.log(`  ✗ [选词] ${set.id} 空 ${n} 缺答案`); }
  });

  answerKeys.forEach(n => {
    const ans = set.answers[n];
    if (!set.wordbank.includes(ans)) {
      fails++; console.log(`  ✗ [选词] ${set.id} 第${n}空答案 "${ans}" 不在备选词库中`);
    }
    if (!set.explains || !set.explains[n]) {
      fails++; console.log(`  ✗ [选词] ${set.id} 第${n}空缺解析`);
    }
  });

  ok(set.wordbank.length >= 15, `[选词] ${set.id} 备选词 ${set.wordbank.length} 个（≥15）`);
});

QUIZ.matching.forEach(set => {
  const labels = set.paragraphs.map(p => p.label);
  set.statements.forEach((st, i) => {
    if (!labels.includes(st.answer)) {
      fails++; console.log(`  ✗ [匹配] ${set.id} 第${i + 1}题答案 "${st.answer}" 不是有效段落号`);
    }
  });
  ok(set.statements.length > 0, `[匹配] ${set.id} 有 ${set.statements.length} 条陈述`);
});

/* ── 词库文件 ── */
console.log('\n▶ 词库数据');
const idx = JSON.parse(fs.readFileSync(path.join(root, 'data/index.json'), 'utf8'));
['cet4', 'cet6'].forEach(lv => {
  const meta = idx.books[lv];
  const list = JSON.parse(fs.readFileSync(path.join(root, meta.file), 'utf8'));
  ok(list.length === meta.count, `${lv} 词数与索引一致（${list.length}）`);

  const missingTr = list.filter(w => !w.tr || !w.tr.length).length;
  ok(missingTr === 0, `${lv} 所有词都有释义`);

  const withSent = list.filter(w => w.s && w.s.length).length;
  const withExam = list.filter(w => w.ex && w.ex.length).length;
  console.log(`    ${lv}: ${list.length} 词 / ${withSent} 有例句 / ${withExam} 有真题`);

  const badExam = list.filter(w => (w.ex || []).some(e => !(e.r >= 0 && e.r < e.o.length)));
  ok(badExam.length === 0, `${lv} 真题答案下标全部合法`);

  const noUk = list.filter(w => !w.uk && !w.us).length;
  console.log(`    ${lv}: ${list.length - noUk} 词有音标（${noUk} 缺音标）`);
});

/* ── 结果 ── */
console.log('\n' + '─'.repeat(50));
if (fails === 0) console.log('全部通过 ✅');
else console.log(`有 ${fails} 处失败 ❌`);
process.exit(fails ? 1 : 0);
