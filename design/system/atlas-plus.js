// Part 05 page layer: swatch copy (pointer and keyboard) and the component number beside the heading.
(() => {
  const $ = (s, r = document) => r.querySelector(s);

  // swatches are generated asynchronously by system.js; make each one a keyboard-reachable copy control
  const copy = async sw => {
    const hex = (sw.textContent.match(/#[0-9A-Fa-f]{6}/) || [])[0]; if (!hex) return;
    try { await navigator.clipboard.writeText(hex); } catch { }
    sw.classList.add('copied'); setTimeout(() => sw.classList.remove('copied'), 1400);
    const s = $('#interaction-status'); if (s) s.textContent = hex + ' copied.';
  };
  const dress = () => document.querySelectorAll('.swatch:not([tabindex])').forEach(sw => { sw.tabIndex = 0; sw.setAttribute('role', 'button'); const name = sw.textContent.trim().replace(/\s+/g, ' '); sw.setAttribute('aria-label', 'Copy ' + name); });
  const host = $('#swatches'); if (host) { new MutationObserver(dress).observe(host, { childList: true }); dress(); }
  document.addEventListener('click', e => { const sw = e.target.closest('.swatch'); if (sw) copy(sw); });
  document.addEventListener('keydown', e => { if ((e.key === 'Enter' || e.key === ' ') && e.target.classList?.contains('swatch')) { e.preventDefault(); copy(e.target); } });

  // component number follows the selected component
  const idEl = $('#component-id'), head = $('.component-heading');
  const sync = () => { head.dataset.id = (idEl.textContent.match(/C\d{2}/) || [''])[0]; };
  if (idEl && head) { new MutationObserver(sync).observe(idEl, { childList: true, characterData: true, subtree: true }); sync(); }
})();
