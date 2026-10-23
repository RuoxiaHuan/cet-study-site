/* ══════════════════════════════════════════════════════════
   srs.js — 间隔重复算法（SM-2 简化版，三档评价）
   ──────────────────────────────────────────────────────────
   评价：
     0 = 不认识 → 10 分钟后重来，难度因子下调，遗忘次数 +1
     1 = 模糊   → 间隔增长放缓（×1.2），难度因子略降
     2 = 认识   → 间隔按 SM-2 增长，难度因子上调
   难度因子 EF 范围 [1.3, 2.8]，初始 2.5
   ══════════════════════════════════════════════════════════ */

const SRS = (() => {
  const MIN_EF = 1.3;
  const MAX_EF = 2.8;
  const DEFAULT_EF = 2.5;
  const AGAIN_MS = 10 * 60 * 1000;      // 不认识：10 分钟后
  const DAY_MS = 24 * 60 * 60 * 1000;

  /** 新建一条初始记录 */
  function create(now) {
    return {
      ef: DEFAULT_EF,
      interval: 0,     // 当前间隔（天）
      reps: 0,         // 连续答对次数
      lapses: 0,       // 遗忘次数
      due: now || Date.now(),  // 下次复习时间戳
      first: now || Date.now(), // 首次学习时间（历史记录按此分组）
      last: 0,         // 上次复习时间
      seen: 0,         // 总复习次数
      correct: 0,      // 总答对次数
      status: 'new',   // new | learning | review | mastered
    };
  }

  /**
   * 提交一次评价，返回更新后的记录
   * @param {object|null} rec 现有记录（null 表示新词）
   * @param {0|1|2} grade 0 不认识 / 1 模糊 / 2 认识
   * @param {number} now 时间戳
   */
  function review(rec, grade, now) {
    const t = now || Date.now();
    const r = rec ? Object.assign({}, rec) : create(t);

    r.last = t;
    if (!r.first) r.first = t;   // 兼容旧记录：没有首次时间就补上
    r.seen = (r.seen || 0) + 1;
    if (grade === 2) r.correct = (r.correct || 0) + 1;

    if (grade === 0) {
      // 忘记：重置进度，10 分钟后重来
      r.reps = 0;
      r.interval = 0;
      r.ef = Math.max(MIN_EF, r.ef - 0.2);
      r.lapses = (r.lapses || 0) + 1;
      r.due = t + AGAIN_MS;
      r.status = 'learning';
      return r;
    }

    if (grade === 1) {
      // 模糊：间隔缓慢增长
      r.ef = Math.max(MIN_EF, r.ef - 0.15);
      r.interval = r.interval > 0 ? Math.max(1, Math.round(r.interval * 1.2)) : 1;
      r.reps = (r.reps || 0) + 1;
      r.due = t + r.interval * DAY_MS;
      r.status = 'review';
      return r;
    }

    // grade === 2 认识
    r.ef = Math.min(MAX_EF, r.ef + 0.1);
    r.reps = (r.reps || 0) + 1;
    if (r.reps === 1) r.interval = 1;
    else if (r.reps === 2) r.interval = 3;
    else r.interval = Math.max(1, Math.round(r.interval * r.ef));
    r.due = t + r.interval * DAY_MS;
    r.status = r.interval >= 21 && r.reps >= 4 ? 'mastered' : 'review';
    return r;
  }

  /** 是否到期需要复习 */
  function isDue(rec, now) {
    if (!rec) return false;
    return rec.due <= (now || Date.now());
  }

  /** 是否已学过（有记录） */
  function isLearned(rec) { return !!rec && rec.seen > 0; }

  /** 人类可读的下次复习时间 */
  function dueLabel(rec, now) {
    if (!rec) return '未学';
    const t = now || Date.now();
    const diff = rec.due - t;
    if (diff <= 0) return '待复习';
    const min = Math.round(diff / 60000);
    if (min < 60) return `${min} 分钟后`;
    const h = Math.round(min / 60);
    if (h < 24) return `${h} 小时后`;
    const d = Math.round(h / 24);
    if (d < 30) return `${d} 天后`;
    return `${Math.round(d / 30)} 个月后`;
  }

  /** 状态标签 */
  function statusLabel(rec) {
    if (!rec || rec.seen === 0) return '未学';
    switch (rec.status) {
      case 'learning': return '学习中';
      case 'mastered': return '已掌握';
      case 'review': return '复习中';
      default: return '学习中';
    }
  }

  /** 状态样式类 */
  function statusClass(rec) {
    if (!rec || rec.seen === 0) return '';
    if (rec.status === 'mastered') return 'ok';
    if (rec.status === 'learning') return 'warn';
    return 'brand';
  }

  return { create, review, isDue, isLearned, dueLabel, statusLabel, statusClass, DAY_MS, AGAIN_MS };
})();
