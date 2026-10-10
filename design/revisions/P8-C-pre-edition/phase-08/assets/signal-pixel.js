// A03 · Signal → pixel (G17.13). A known 2 Hz reference is sampled at a chosen rate; each sample becomes a
// column of light in an image field. Below twice the signal frequency the field shows a slower alias.
// Generated signal only — not a measurement. Static frame when reduced motion is requested.
export function mountSignalPixel(root) {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  root.innerHTML = `
  <div class="sp-stage"><canvas aria-hidden="true"></canvas>
    <div class="sp-read" aria-live="polite"></div></div>
  <div class="sp-ctl">
    <label for="sp-rate">Sampling rate <output id="sp-out">20 Hz</output></label>
    <input id="sp-rate" type="range" min="1.2" max="24" step="0.1" value="20" aria-describedby="sp-hint">
    <span id="sp-hint" class="sp-hint">Signal: 2 Hz reference · Nyquist limit 4 Hz. Try 3 Hz.</span>
    <button type="button" id="sp-play" class="sp-btn">${reduce ? 'Play' : 'Pause'}</button>
  </div>`;
  const cv = root.querySelector('canvas'), ctx = cv.getContext('2d');
  const rate = root.querySelector('#sp-rate'), out = root.querySelector('#sp-out'), read = root.querySelector('.sp-read'), btn = root.querySelector('#sp-play');
  let playing = !reduce, t0 = performance.now(), last = 0;
  const F = 2, WIN = 1.5;                               // 2 Hz reference, 1.5 s window
  function size() { const r = cv.getBoundingClientRect(); cv.width = r.width * devicePixelRatio; cv.height = r.height * devicePixelRatio; if (!playing) requestAnimationFrame(() => draw(performance.now())); }
  new ResizeObserver(size).observe(cv); size();
  function alias(fs) { const k = Math.round(F / fs); return Math.abs(F - k * fs); }
  function draw(now) {
    const fs = +rate.value, W = cv.width, H = cv.height, dpr = devicePixelRatio, top = H * .52, mid = H * .27, amp = H * .19;
    const phase = playing ? (now - t0) / 1000 : last; last = phase;
    ctx.clearRect(0, 0, W, H);
    // pixel field (bottom): one column per sample, brightness from the sampled value
    const n = Math.max(2, Math.floor(fs * WIN)), cw = W / (fs * WIN);
    for (let i = 0; i <= n; i++) {
      const ts = i / fs, v = Math.sin(2 * Math.PI * F * (ts + phase * .25));
      const l = Math.round(18 + (v + 1) / 2 * 72);
      ctx.fillStyle = `hsl(163 70% ${l}%)`;
      ctx.fillRect(i * cw, top + 10 * dpr, Math.max(1, cw - 2 * dpr), H - top - 10 * dpr);
    }
    // continuous reference
    ctx.lineWidth = 2 * dpr; ctx.strokeStyle = 'rgba(244,246,251,.35)'; ctx.beginPath();
    for (let x = 0; x <= W; x += 2) { const t = x / W * WIN; const y = mid - amp * Math.sin(2 * Math.PI * F * (t + phase * .25)); x ? ctx.lineTo(x, y) : ctx.moveTo(x, y); }
    ctx.stroke();
    // what the samples imply (reconstructed apparent frequency)
    // Exact alias: d = F − k·fs (k = round(F/fs)) gives sin(2πd·t + φ) = sin(2πF·t + φ) at every sample t = i/fs.
    const k = Math.round(F / fs), d = F - k * fs, phi = 2 * Math.PI * F * phase * .25;
    ctx.strokeStyle = fs > 2 * F ? 'rgba(110,231,197,.9)' : 'rgba(242,193,78,.95)'; ctx.setLineDash([6 * dpr, 6 * dpr]); ctx.beginPath();
    for (let x = 0; x <= W; x += 2) { const t = x / W * WIN; const y = mid - amp * Math.sin(2 * Math.PI * d * t + phi); x ? ctx.lineTo(x, y) : ctx.moveTo(x, y); }
    ctx.stroke(); ctx.setLineDash([]);
    // samples
    for (let i = 0; i <= n; i++) {
      const ts = i / fs, x = ts / WIN * W, y = mid - amp * Math.sin(2 * Math.PI * F * (ts + phase * .25));
      ctx.fillStyle = '#F2C14E'; ctx.beginPath(); ctx.arc(x, y, 4 * dpr, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = 'rgba(242,193,78,.25)'; ctx.lineWidth = 1 * dpr; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x, top + 10 * dpr); ctx.stroke();
    }
    if (playing) requestAnimationFrame(draw);
  }
  function label() {
    const fs = +rate.value; out.textContent = fs.toFixed(1) + ' Hz';
    read.innerHTML = fs > 2 * F
      ? `<b>${fs.toFixed(1)} Hz</b> is above twice the 2 Hz signal — the samples follow the reference.`
      : `<b>${fs.toFixed(1)} Hz</b> is below 4 Hz — the samples now suggest a ${alias(fs).toFixed(2)} Hz signal that is not there.`;
    read.classList.toggle('warn', fs <= 2 * F);
  }
  rate.addEventListener('input', () => { label(); if (!playing) draw(performance.now()); });
  btn.addEventListener('click', () => { playing = !playing; btn.textContent = playing ? 'Pause' : 'Play'; if (playing) t0 = performance.now() - last * 1000; requestAnimationFrame(draw); });
  label(); requestAnimationFrame(draw);
}
