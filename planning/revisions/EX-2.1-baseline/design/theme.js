// PARALLAX theme switch. Load synchronously in <head> so the theme is set before first paint.
// Follows the OS setting until the user chooses; the choice is remembered per browser.
(() => {
  const KEY = 'parallax-theme', root = document.documentElement, mq = matchMedia('(prefers-color-scheme: dark)');
  let saved = null; try { saved = localStorage.getItem(KEY); } catch { }
  if (saved !== 'light' && saved !== 'dark') saved = null;
  // ?theme=light|dark shows one edition for this visit without changing the remembered choice (review links, screenshots)
  const asked = new URLSearchParams(location.search).get('theme'); if (asked === 'light' || asked === 'dark') saved = asked;
  const current = () => saved || (mq.matches ? 'dark' : 'light');
  const SUN = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="4.2"/><path d="M12 2.5v2.2M12 19.3v2.2M2.5 12h2.2M19.3 12h2.2M5.3 5.3l1.6 1.6M17.1 17.1l1.6 1.6M18.7 5.3l-1.6 1.6M6.9 17.1l-1.6 1.6"/></svg>';
  const MOON = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round" aria-hidden="true"><path d="M20.5 14.2A8.6 8.6 0 0 1 9.8 3.5a8.6 8.6 0 1 0 10.7 10.7z"/></svg>';
  const buttons = new Set();
  function paint() {
    const t = current(); root.dataset.theme = t; root.style.colorScheme = t;
    for (const b of buttons) { b.innerHTML = t === 'dark' ? SUN : MOON; const next = t === 'dark' ? 'light' : 'dark'; b.setAttribute('aria-label', `Switch to ${next} theme`); b.title = `Switch to ${next} theme`; }
    document.dispatchEvent(new CustomEvent('themechange', { detail: t }));
  }
  paint();
  mq.addEventListener?.('change', () => { if (!saved) paint(); });
  const css = document.createElement('style');
  css.textContent = '.theme-toggle{display:inline-grid;place-items:center;flex:none;width:38px;height:38px;min-height:0;padding:0;border-radius:0;border:1px solid color-mix(in srgb,currentColor 28%,transparent);background:transparent;color:inherit;cursor:pointer;transition:background .2s,transform .2s}.theme-toggle:hover{background:color-mix(in srgb,currentColor 12%,transparent);transform:rotate(18deg)}.theme-toggle:focus-visible{outline:3px solid #6EE7C5;outline-offset:2px}@media(prefers-reduced-motion:reduce){.theme-toggle:hover{transform:none}}';
  document.head.append(css);
  addEventListener('DOMContentLoaded', () => {
    const host = document.querySelector('header'); if (!host) return;
    const b = document.createElement('button'); b.type = 'button'; b.className = 'theme-toggle';
    b.addEventListener('click', () => { saved = current() === 'dark' ? 'light' : 'dark'; try { localStorage.setItem(KEY, saved); } catch { } paint(); });
    buttons.add(b); paint();
    host.append(b);
  });
})();
