// axe-core on the two interactive overlays: the guided-tour strip and the open quick-search dialog.
import { chromium } from 'playwright';
import fs from 'node:fs';
const root = 'D:/ui project';
const axe = fs.readFileSync(root + '/apps/lab-web/node_modules/axe-core/axe.min.js', 'utf8');
const browser = await chromium.launch({ channel: 'msedge' });
const out = {};
for (const theme of ['light', 'dark']) {
  const page = await (await browser.newContext({ viewport: { width: 1280, height: 800 }, reducedMotion: 'reduce' })).newPage();
  await page.goto('http://127.0.0.1:4180/apps/lab-web/dist/index.html#/dashboard');
  await page.evaluate((t) => localStorage.setItem('parallax-theme', t), theme);
  await page.reload();
  await page.waitForSelector('main h1');
  await page.getByRole('button', { name: 'Guided tour' }).click();
  await page.waitForTimeout(500);
  await page.addScriptTag({ content: axe });
  const run = () => page.evaluate(async () => (await axe.run(document, { resultTypes: ['violations'] })).violations.map((v) => `${v.id} x${v.nodes.length} ${v.nodes[0].target.join(' ').slice(0, 70)}`));
  out[theme + ' tour'] = await run();
  await page.keyboard.press('Control+k');
  await page.keyboard.type('cam');
  await page.waitForTimeout(300);
  out[theme + ' search'] = await run();
}
await browser.close();
const result = { date: '2026-10-05', engine: 'axe-core 4.10.2', states: Object.keys(out), violations: Object.fromEntries(Object.entries(out).filter(([, v]) => v.length)) };
fs.writeFileSync(root + '/apps/lab-web/evidence/u12-checks/axe-overlays.json', JSON.stringify(result, null, 2));
console.log(JSON.stringify(result.violations));
