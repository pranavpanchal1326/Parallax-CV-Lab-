// Machine-run portion of submission/EXTERNAL_CHECKS.md. Each browser gets a temporary profile.
// Covers: completed native downloads, layout at 200% and 400% zoom-equivalent viewports,
// the same tasks in other browser engines, and keyboard-only operation with visible focus.
// It cannot stand in for a spoken screen reader, a physical phone or a human rehearsal.
import { chromium, firefox, webkit } from 'playwright';
import fs from 'node:fs/promises';
import crypto from 'node:crypto';

const root = 'D:/ui project', out = root + '/apps/lab-web/evidence/u12-checks';
const app = 'http://127.0.0.1:4180/apps/lab-web/dist/index.html#/';
await fs.mkdir(out + '/downloads', { recursive: true });
const report = { date: '2026-10-05', engines: [], downloads: [], zoom: [], keyboard: [], scope: 'Automated checks on one Windows machine through Playwright. Not spoken assistive technology, not a physical phone, not a person presenting.' };
const sha = (b) => crypto.createHash('sha256').update(b).digest('hex');

async function go(page, route) {
  await page.goto('about:blank');
  await page.goto(app + route);
  await page.waitForSelector('main h1');
  await page.waitForTimeout(500);
}
async function runE01(page) {
  await go(page, 'E01/rehearsal');
  await page.locator('#rehearsal-prediction').fill('The 3 Hz samples may fit more than one sine.');
  await page.locator('#rehearsal-parameter').selectOption({ label: '3 Hz' });
  await page.getByRole('button', { name: /Run rehearsal/ }).click();
  await page.waitForTimeout(500);
  return /4 samples/.test(await page.locator('main').innerText());
}
async function tasks(page) {
  const r = {};
  await go(page, 'mobile');
  await page.locator('#lookup').fill('c1-cam');
  await page.getByRole('button', { name: 'Find the record' }).click();
  r.lookup = /Capture camera \+ lens/.test(await page.locator('.lookup-result').innerText());
  await page.locator('#lookup').fill('ZZ-99');
  await page.getByRole('button', { name: 'Find the record' }).click();
  r.unknownIdRecovery = /No matching record in this lab/.test(await page.locator('.lookup-result').innerText());
  r.e01Result = await runE01(page);
  await go(page, 'scene/rehearsal');
  await page.getByRole('button', { name: /plan-only approximation/ }).click();
  r.planOnlyFallback = (await page.getByRole('button', { name: /Use 3D when available/ }).count()) === 1;
  await go(page, 'environment');
  await page.locator('.env-tabs button').nth(2).click();
  r.tabs = await page.locator('[aria-labelledby="standby-title"]').isVisible() && !(await page.locator('#observation-desk').isVisible());
  await go(page, 'walkthrough');
  await page.locator('.fault-story-stages button', { hasText: /^[ ]*08/ }).click();
  r.faultStage8 = /Early release refused/.test(await page.locator('#fault-stage-title').innerText());
  await go(page, 'dashboard');
  await page.getByRole('button', { name: 'Guided tour' }).click();
  await page.locator('.tour-strip .primary').click();
  await page.waitForTimeout(300);
  r.guidedTour = page.url().endsWith('#/E01/prepare') && /02 \/ 14/.test(await page.locator('.tour-count').innerText());
  await page.getByRole('button', { name: 'End tour' }).click();
  await page.keyboard.press('Control+k');
  await page.keyboard.type('cal-01');
  await page.keyboard.press('Enter');
  await page.waitForTimeout(300);
  r.quickSearch = page.url().endsWith('#/assets/CAL-01');
  await go(page, '');
  await page.locator('.playground-rates button', { hasText: '20 Hz' }).click();
  const fast = await page.locator('.playground-reading').innerText();
  await page.locator('.playground-rates button', { hasText: '3 Hz' }).click();
  const slow = await page.locator('.playground-reading').innerText();
  r.samplingPlayground = /21 samples/.test(fast) && /4 samples also fit a 1 Hz/.test(slow) && (await page.locator('.pg-dot').count()) === 4;
  await page.locator('.role-menu > summary').click();
  await page.locator('.role-menu-list a', { hasText: 'Technician' }).click();
  await page.waitForTimeout(300);
  r.roleMenu = page.url().endsWith('#/tech') && !(await page.locator('.role-menu').evaluate((d) => d.open));
  await go(page, 'assistant');
  await page.waitForTimeout(1500);
  r.manualGuideReadable = /Keep the reference fixed/.test(await page.locator('main').innerText());
  return r;
}

// 1. Engines
for (const [name, launch] of [
  ['Microsoft Edge (Chromium)', () => chromium.launch({ channel: 'msedge' })],
  ['Google Chrome', () => chromium.launch({ channel: 'chrome' })],
  ['Firefox (Playwright build)', () => firefox.launch()],
  ['WebKit (Playwright build, Safari engine)', () => webkit.launch()],
]) {
  try {
    const browser = await launch();
    const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', (e) => errors.push(String(e).slice(0, 160)));
    const result = await tasks(page);
    report.engines.push({ engine: name, version: browser.version(), tasks: result, allPass: Object.values(result).every(Boolean), pageErrors: errors });
    await browser.close();
  } catch (e) {
    report.engines.push({ engine: name, unavailable: String(e).split('\n')[0].slice(0, 200) });
  }
}

// 2. Native downloads in Edge: the saved file must equal the text the page displays.
{
  const browser = await chromium.launch({ channel: 'msedge' });
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 }, acceptDownloads: true });
  const page = await context.newPage();
  async function capture(label, trigger) {
    const [download] = await Promise.all([page.waitForEvent('download', { timeout: 15000 }), trigger()]);
    const file = `${out}/downloads/${download.suggestedFilename()}`;
    await download.saveAs(file);
    const bytes = await fs.readFile(file);
    const shown = await page.locator('#export-fallback').inputValue();
    let parsed = false;
    try { JSON.parse(bytes.toString('utf8')); parsed = true; } catch { /* reported below */ }
    report.downloads.push({ label, file: download.suggestedFilename(), bytes: bytes.length, sha256: sha(bytes), parsesAsJson: parsed, identicalToDisplayedText: bytes.toString('utf8') === shown });
  }
  await go(page, 'dashboard');
  await page.locator('.session-drawer > summary').click();
  await capture('Session export', () => page.getByRole('button', { name: 'Export this session' }).click());
  for (const exp of ['E01', 'E06']) {
    await go(page, `${exp}/rehearsal`);
    await page.locator('#rehearsal-prediction').fill('A prediction written for the export check.');
    await page.locator('#rehearsal-parameter').selectOption({ index: 1 });
    await page.getByRole('button', { name: /Run rehearsal/ }).click();
    await page.waitForTimeout(400);
    const button = page.getByRole('button', { name: 'Export rehearsal' });
    if (await button.count() && await button.isEnabled()) await capture(`${exp} rehearsal export`, () => button.click());
    else report.downloads.push({ label: `${exp} rehearsal export`, skipped: 'Export rehearsal control not enabled in this state' });
  }
  await go(page, 'operations');
  await page.locator('.ops-tabs button', { hasText: 'Record' }).click();
  await capture('Operations exercise export', () => page.getByRole('button', { name: 'Export current exercise' }).click());
  await browser.close();
}

// 3. Zoom-equivalent layouts: 200% and 400% of a 1280 x 800 window.
{
  const browser = await chromium.launch({ channel: 'msedge' });
  for (const [zoom, viewport, scale] of [[200, { width: 640, height: 400 }, 2], [400, { width: 320, height: 256 }, 4]]) {
    const context = await browser.newContext({ viewport, deviceScaleFactor: scale });
    const page = await context.newPage();
    const rows = [];
    for (const route of ['', 'dashboard', 'environment', 'mobile', 'E01/prepare', 'E01/rehearsal', 'walkthrough', 'assistant', 'operations', 'map', 'tech', 'faculty', 'safety', 'wall']) {
      await go(page, route);
      const m = await page.evaluate(() => ({ scroll: document.documentElement.scrollWidth, width: window.innerWidth, h1: !!document.querySelector('main h1')?.offsetParent }));
      rows.push({ route: route || '/', pageOverflow: m.scroll > m.width + 1, headingVisible: m.h1 });
    }
    const e01 = await runE01(page);
    await go(page, 'mobile');
    await page.locator('#lookup').fill('CV-02');
    await page.getByRole('button', { name: 'Find the record' }).click();
    const lookup = /Computing station/.test(await page.locator('.lookup-result').innerText());
    await page.screenshot({ path: `${out}/zoom-${zoom}-lookup.png` });
    report.zoom.push({ zoom: `${zoom}%`, cssViewport: viewport, deviceScaleFactor: scale, routes: rows.length, routesWithPageOverflow: rows.filter((r) => r.pageOverflow).map((r) => r.route), allHeadingsVisible: rows.every((r) => r.headingVisible), e01TaskCompletes: e01, lookupTaskCompletes: lookup,
      method: 'CSS viewport and device scale that a browser produces at this zoom on a 1280 x 800 window; the browser zoom menu itself was not operated.' });
    await context.close();
  }
  await browser.close();
}

// 4. Keyboard only, with a visible focus indicator on every stop.
{
  const browser = await chromium.launch({ channel: 'msedge' });
  const page = await (await browser.newContext({ viewport: { width: 1280, height: 800 } })).newPage();
  const focusInfo = () => page.evaluate(() => { const e = document.activeElement, s = getComputedStyle(e); return { tag: e.tagName, id: e.id, text: (e.textContent || '').trim().slice(0, 30), indicator: parseFloat(s.outlineWidth) > 0 && s.outlineStyle !== 'none' || s.boxShadow !== 'none' }; });
  await go(page, 'mobile');
  const stops = [];
  for (let i = 0; i < 40; i++) {
    await page.keyboard.press('Tab');
    const f = await focusInfo();
    stops.push(f);
    if (f.id === 'lookup') break;
  }
  await page.keyboard.type('CAL-01');
  await page.keyboard.press('Enter');
  await page.waitForTimeout(300);
  const lookup = /Calibration target/.test(await page.locator('.lookup-result').innerText());
  report.keyboard.push({ task: 'Typed lookup from page load using Tab, typing and Enter', tabStopsToField: stops.length, firstStop: stops[0]?.text, everyStopHasVisibleIndicator: stops.every((s) => s.indicator), completed: lookup });
  await go(page, 'E01/rehearsal');
  await page.locator('#rehearsal-prediction').focus();
  await page.keyboard.type('Keyboard-only prediction.');
  await page.keyboard.press('Tab');
  const onSelect = (await focusInfo()).id === 'rehearsal-parameter';
  await page.keyboard.press('Tab');
  const onRun = /Run rehearsal/.test((await focusInfo()).text);
  const runIndicator = (await focusInfo()).indicator;
  await page.keyboard.press('Enter');
  await page.waitForTimeout(400);
  report.keyboard.push({ task: 'E01 rehearsal: prediction, variable, run using Tab and Enter', focusOrderFieldSelectRun: onSelect && onRun, runButtonIndicator: runIndicator, completed: /samples/.test(await page.locator('.rehearsal-result').first().innerText()) });
  await go(page, 'environment');
  await page.locator('.env-tabs button').first().focus();
  await page.keyboard.press('Tab');
  await page.keyboard.press('Enter');
  report.keyboard.push({ task: 'Environment tabs by keyboard', completed: await page.locator('[aria-labelledby="energy-period-title"]').isVisible() });
  await browser.close();
}

// 5. With motion enabled (the default for most people): fixed and transformed elements stay in place.
{
  const browser = await chromium.launch({ channel: 'msedge' });
  const page = await (await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'no-preference' })).newPage();
  await go(page, 'E01/prepare');
  await page.waitForTimeout(900);
  const bar = await page.evaluate(() => { const link = [...document.querySelectorAll('.journey-actions a')].pop().getBoundingClientRect(); return { left: Math.round(link.left), right: Math.round(link.right), width: innerWidth }; });
  for (const box of await page.locator('main input[type=checkbox]').all()) await box.check();
  await page.locator('.journey-actions a').last().click({ timeout: 5000 });
  await page.waitForTimeout(600);
  report.motionEnabled = { stepBarNextLinkInsideViewport: bar.left >= 0 && bar.right <= bar.width, nextLinkClickable: page.url().endsWith('#/E01/reserve'), note: 'Added after a page-transition animation was found to displace the fixed step bar when motion was enabled; earlier runs only used reduced motion.' };
  await browser.close();
}

await fs.writeFile(out + '/external-checks.json', JSON.stringify(report, null, 2));
console.log(JSON.stringify({ engines: report.engines.map((e) => [e.engine, e.unavailable ? 'unavailable' : e.allPass, e.version, e.tasks && Object.entries(e.tasks).filter(([, v]) => !v).map(([k]) => k)]), downloads: report.downloads.map((d) => [d.label, d.skipped || (d.parsesAsJson && d.identicalToDisplayedText), d.bytes]), zoom: report.zoom.map((z) => [z.zoom, z.routesWithPageOverflow, z.allHeadingsVisible, z.e01TaskCompletes, z.lookupTaskCompletes]), keyboard: report.keyboard, motion: report.motionEnabled }, null, 1));
