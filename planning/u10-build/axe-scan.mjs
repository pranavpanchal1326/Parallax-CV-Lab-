// axe-core scan of the application (light and dark editions) and the three packet pages.
// Machine-detectable rules only; not a WCAG conformance claim.
import { chromium } from 'playwright';
import fs from 'node:fs';
const root = 'D:/ui project';
const axe = fs.readFileSync(root + '/apps/lab-web/node_modules/axe-core/axe.min.js', 'utf8');
const base = 'http://127.0.0.1:4180/';
const routes = ['', 'dashboard', 'environment', 'mobile', 'wall', 'operations', 'map', 'tech', 'faculty', 'assistant', 'safety', 'walkthrough', 'E01/prepare', 'E01/rehearsal', 'bookings', 'studio'];
const browser = await chromium.launch({ channel: 'msedge' });
const result = { date: '2026-10-05', engine: 'axe-core 4.10.2', viewport: '1280 x 800', scans: 0, violations: {}, scope: 'Machine-detectable rules on default page states; not a full accessibility audit.' };
async function scan(page, label) {
  await page.addScriptTag({ content: axe });
  const found = await page.evaluate(async () => (await axe.run(document, { resultTypes: ['violations'] })).violations.map((v) => `${v.id} x${v.nodes.length} ${v.nodes[0].target.join(' ').slice(0, 80)}`));
  result.scans++;
  if (found.length) result.violations[label] = found;
}
for (const theme of ['light', 'dark']) {
  const page = await (await browser.newContext({ viewport: { width: 1280, height: 800 }, reducedMotion: 'reduce' })).newPage();
  await page.goto(base + 'apps/lab-web/dist/index.html#/');
  await page.evaluate((t) => localStorage.setItem('parallax-theme', t), theme);
  for (const r of routes) {
    await page.goto('about:blank');
    await page.goto(base + 'apps/lab-web/dist/index.html#/' + r);
    await page.waitForSelector('main h1');
    await page.waitForTimeout(500);
    await scan(page, `${theme} /${r}`);
  }
}
const page = await (await browser.newContext({ viewport: { width: 1280, height: 800 } })).newPage();
for (const u of ['submission/index.html', 'submission/presentation.html', 'submission/demo/index.html']) {
  await page.goto(base + u);
  await page.waitForTimeout(700);
  await scan(page, u);
}
await browser.close();
fs.mkdirSync(root + '/apps/lab-web/evidence/u12-checks', { recursive: true });
fs.writeFileSync(root + '/apps/lab-web/evidence/u12-checks/axe-scan.json', JSON.stringify(result, null, 2));
console.log(JSON.stringify({ scans: result.scans, pagesWithViolations: Object.keys(result.violations).length, violations: result.violations }));
