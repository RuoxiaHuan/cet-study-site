/* ══════════════════════════════════════════════════════════
   audio.js — 发音
   优先有道词典真人发音接口（免密钥、音质好），
   失败时自动降级到浏览器 SpeechSynthesis 合成。
   ══════════════════════════════════════════════════════════ */

const Sound = (() => {
  const cache = new Map();       // url -> Audio 元素，复用避免重复请求
  let current = null;
  let ttsVoice = null;

  function pickVoice() {
    if (ttsVoice || !window.speechSynthesis) return ttsVoice;
    const voices = window.speechSynthesis.getVoices() || [];
    ttsVoice = voices.find(v => /en-US/i.test(v.lang)) ||
               voices.find(v => /^en/i.test(v.lang)) || null;
    return ttsVoice;
  }

  if (window.speechSynthesis) {
    window.speechSynthesis.onvoiceschanged = () => { ttsVoice = null; pickVoice(); };
  }

  /** 有道发音 URL：type=1 英音，type=2 美音 */
  function youdaoUrl(word, accent) {
    const type = accent === 'uk' ? 1 : 2;
    return `https://dict.youdao.com/dictvoice?audio=${encodeURIComponent(word)}&type=${type}`;
  }

  /** 播放单个单词 */
  function playWord(word, accent) {
    const acc = accent || Store.settings.accent || 'us';
    return playUrl(youdaoUrl(word, acc), word, false);
  }

  /** 播放整句（优先 TTS，因为句子没有现成音频） */
  function playSentence(text) {
    if (!text) return;
    if (!window.speechSynthesis) return;
    try {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      const v = pickVoice();
      if (v) u.voice = v;
      u.lang = 'en-US';
      u.rate = 0.92;
      window.speechSynthesis.speak(u);
    } catch (e) { /* 忽略 */ }
  }

  function playUrl(url, text, allowTts) {
    return new Promise((resolve) => {
      stop();
      let audio = cache.get(url);
      if (!audio) {
        audio = new Audio(url);
        audio.preload = 'auto';
        cache.set(url, audio);
      }
      let settled = false;
      const done = (ok) => {
        if (settled) return;
        settled = true;
        if (!ok && allowTts !== false && text) playSentence(text);
        resolve(ok);
      };
      audio.onerror = () => done(false);
      audio.onended = () => done(true);
      try {
        audio.currentTime = 0;
        const p = audio.play();
        if (p && p.catch) p.catch(() => done(false));
      } catch (e) { done(false); }
      current = audio;
      // 兜底：6 秒还没结束就当成功（避免挂起）
      setTimeout(() => done(true), 6000);
    });
  }

  function stop() {
    if (current) {
      try { current.pause(); current.currentTime = 0; } catch (e) {}
      current = null;
    }
    if (window.speechSynthesis) {
      try { window.speechSynthesis.cancel(); } catch (e) {}
    }
  }

  return { playWord, playSentence, stop, youdaoUrl };
})();
