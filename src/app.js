/* ══════════════════════════════════════════════════════════
   app.js — 路由与启动
   ══════════════════════════════════════════════════════════ */

const App = (() => {

  const ROUTES = ['home', 'learn', 'review', 'history', 'quiz', 'words', 'wrong', 'stats', 'settings'];

  function parseHash() {
    const h = (location.hash || '').replace(/^#\/?/, '');
    const name = h.split('/')[0] || 'home';
    return ROUTES.includes(name) ? name : 'home';
  }

  function setActive(route) {
    document.querySelectorAll('#nav a').forEach(a => {
      a.classList.toggle('active', a.dataset.route === route);
    });
  }

  async function refreshLevelBar() {
    const bar = document.getElementById('levelbar');
    if (!bar) return;
    let idx = null;
    try { idx = await Data.loadIndex(); } catch (e) { /* 索引没加载出来就先不显示 */ }

    const level = Store.settings.level;
    const today = Store.today();
    const streak = Store.streak();

    const chip = (key, label) => {
      const meta = idx && idx.books[key];
      const count = meta ? meta.count : '…';
      return `<button class="chip ${level === key ? 'on' : ''}" data-level="${key}">
        ${label}<span class="count">${count}</span>
      </button>`;
    };

    bar.innerHTML = `
      ${chip('cet4', '四级')}
      ${chip('cet6', '六级')}
      <span class="today">
        <span>今日新词 ${today.learned || 0}</span>
        <span>复习 ${today.reviewed || 0}</span>
        <span>打卡 ${streak} 天</span>
      </span>`;

    bar.querySelectorAll('[data-level]').forEach(b => {
      b.addEventListener('click', async () => {
        if (Store.settings.level === b.dataset.level) return;
        Store.settings.level = b.dataset.level;
        Store.save();
        Pages.resetSession();
        Quiz.reset();
        await refreshLevelBar();
        mount();
      });
    });
  }

  async function mount() {
    const route = parseHash();
    setActive(route);
    document.onkeydown = null;
    Sound.stop();

    const app = document.getElementById('app');
    app.innerHTML = '<div class="loading"><div class="spinner"></div><p>加载中…</p></div>';

    try {
      await Data.loadIndex();
      if (route === 'quiz') {
        await Quiz.render(app);
      } else {
        const fn = Pages[route] || Pages.home;
        await fn(app);
      }
    } catch (err) {
      console.error(err);
      app.innerHTML = `
        <div class="card" style="margin-top:40px">
          <div class="empty">
            <div class="em-icon">⚠️</div>
            <p>加载失败：${esc(err.message || err)}</p>
            <p style="font-size:13px;color:var(--text-3)">
              如果是直接双击打开文件，浏览器会拦截读取本地 JSON。请用本地服务器打开，或部署到 GitHub Pages。
            </p>
            <button class="btn btn-primary" onclick="location.reload()">重试</button>
          </div>
        </div>`;
    }

    window.scrollTo({ top: 0, behavior: 'instant' in window ? 'instant' : 'auto' });
  }

  function init() {
    Store.load();

    // 导航折叠
    const toggle = document.getElementById('navToggle');
    const nav = document.getElementById('nav');
    if (toggle) {
      toggle.addEventListener('click', () => nav.classList.toggle('open'));
    }
    nav.addEventListener('click', (e) => {
      if (e.target.tagName === 'A') nav.classList.remove('open');
    });

    window.addEventListener('hashchange', mount);

    refreshLevelBar().then(mount);
  }

  return { mount, refreshLevelBar, init };
})();

document.addEventListener('DOMContentLoaded', App.init);
