/* ══════════════════════════════════════════════════════════
   util.js — 通用工具
   ══════════════════════════════════════════════════════════ */

/** HTML 转义 */
function esc(s) {
  return String(s == null ? '' : s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/** 把句子中的目标单词高亮 */
function highlight(sentence, word) {
  if (!word) return esc(sentence);
  const safe = word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const re = new RegExp(`\\b(${safe}[a-z]{0,3})\\b`, 'gi');
  return esc(sentence).replace(re, '<span class="hl">$1</span>');
}

/** 音标格式化 */
function fmtPhonetic(p) {
  if (!p) return '';
  let s = p.trim();
  if (!s) return '';
  if (!s.startsWith('/')) s = '/' + s;
  if (!s.endsWith('/')) s = s + '/';
  return s;
}

/** 洗牌 */
function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** 取 n 个随机元素 */
function sample(arr, n) {
  return shuffle(arr).slice(0, n);
}

/** 轻提示 */
let toastTimer = null;
function toast(msg) {
  let el = document.querySelector('.toast');
  if (!el) {
    el = document.createElement('div');
    el.className = 'toast';
    document.body.appendChild(el);
  }
  el.textContent = msg;
  el.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('show'), 1800);
}

/** 选项字母 */
const LETTERS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];

/** 百分比 */
function pct(a, b) {
  if (!b) return 0;
  return Math.round((a / b) * 100);
}
