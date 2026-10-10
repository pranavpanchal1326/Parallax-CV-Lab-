// Re-captures the interface images used by the deck, report and backup walkthrough.
// Needs: submission/serve.cjs on 4180, optionally the assistant service on 4192 with local Ollama,
// and Microsoft Edge. Uses a temporary browser profile, so no saved browser record is touched.
import { chromium } from 'playwright';
import fs from 'node:fs/promises';

const root = 'D:/ui project', assets = root + '/submission/assets';
const app = 'http://127.0.0.1:4180/apps/lab-web/dist/index.html#/';
const browser = await chromium.launch({ channel: 'msedge', headless: true });
const result = { captured: [], notes: [], text: {} };

async function open(route, viewport = { width: 1265, height: 712 }) {
  const context = await browser.newContext({ viewport, deviceScaleFactor: 1, reducedMotion: 'reduce' });
  const page = await context.newPage();
  page.on('console', (m) => { if (m.type() === 'error') result.notes.push(`console error on ${route}: ${m.text().slice(0, 160)}`); });
  await page.goto(app + route);
  await page.waitForSelector('main h1');
  await page.waitForTimeout(600);
  return page;
}
async function shot(page, name, anchor) {
  if (anchor) {
    await anchor.evaluate((el) => window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY - 150));
    await page.waitForTimeout(300);
  }
  await page.screenshot({ path: `${assets}/${name}.png` });
  result.captured.push(name);
}
const aria = async (page) => await page.locator('body').ariaSnapshot();

// Dashboard
let page = await open('dashboard');
await shot(page, 'dashboard');
await page.context().close();

// Reservation step, for the wireframe-to-interface figure
page = await open('E01/prepare');
for (const box of await page.locator('main input[type=checkbox]').all()) await box.check();
await page.locator('.journey-actions a, .journey-actions button').last().click();
await page.waitForTimeout(600);
await shot(page, 'reserve');
await page.context().close();

// E01 at 3 Hz
page = await open('E01/rehearsal');
await page.locator('#rehearsal-prediction').fill('Different continuous signals can share the 3 Hz sample values. The source remains REF-2HZ-v1.');
await page.locator('#rehearsal-parameter').selectOption({ label: '3 Hz' });
await page.getByRole('button', { name: /Run rehearsal/ }).click();
await page.waitForTimeout(700);
await shot(page, 'E01-3Hz', page.locator('#rehearsal-prediction'));
result.text['E01-3Hz'] = await aria(page);
await page.context().close();

// E06 side light
page = await open('E06/rehearsal');
await page.locator('#rehearsal-prediction').fill('Side light should change the shadow in these authored illustrations. It cannot establish detector accuracy.');
await page.locator('#rehearsal-parameter').selectOption('side');
await page.getByRole('button', { name: /Run rehearsal/ }).click();
await page.waitForTimeout(700);
await shot(page, 'E06-side', page.locator('#rehearsal-prediction'));
result.text['E06-side'] = await aria(page);
await page.context().close();

// Fault walkthrough stages 5, 7, 8, 10
page = await open('walkthrough');
for (const stage of [5, 7, 8, 10]) {
  await page.locator('.fault-story-stages button', { hasText: new RegExp('^[ ]*' + String(stage).padStart(2, '0')) }).click();
  await page.waitForTimeout(500);
  await shot(page, `fault-${stage}`, page.locator('.fault-story-layout'));
}
await page.context().close();

// Geometry plan-only approximation
page = await open('scene/rehearsal');
await page.locator('#geometry-prediction').fill('A wider field should keep the calibration target in frame.');
await page.getByRole('button', { name: /plan-only approximation/ }).click();
await page.locator('#geometry-field').selectOption('90');
await page.locator('.rehearsal-controls button.primary').first().click();
await page.waitForTimeout(1500);
await shot(page, 'plan-fallback', page.locator('#geometry-prediction'));
result.text['plan-fallback'] = await aria(page);
await page.context().close();

// Typed lookup on a phone-width viewport
page = await open('mobile', { width: 390, height: 800 });
await page.locator('#lookup').fill('C1-CAM');
await page.getByRole('button', { name: 'Find the record' }).click();
await page.waitForTimeout(400);
await shot(page, 'mobile-viewport', page.locator('h1'));
await page.context().close();

// Exact-text export fallback
page = await open('dashboard');
await page.locator('.session-drawer > summary').click();
await page.getByRole('button', { name: 'Export this session' }).click();
await page.waitForTimeout(800);
const fallback = page.getByRole('button', { name: /Select export text/ });
if (await fallback.count()) await shot(page, 'export-fallback', fallback.first());
else result.notes.push('export fallback control not found; previous image kept');
await page.context().close();

// Operations allocation
page = await open('operations');
await page.getByRole('button', { name: 'Request exercise allocation' }).click();
await page.waitForTimeout(1500);
await shot(page, 'operations-allocation', page.locator('.ops-tabs'));
await page.context().close();

// Local assistant answer (only when the service and model respond)
page = await open('assistant');
await page.waitForTimeout(2500);
const ask = page.locator('.assistant-actions button.primary');
await page.getByRole('button', { name: 'Use an example question' }).click();
if (await ask.isEnabled()) {
  await ask.click();
  try {
    await page.locator('.assistant-answer a, .assistant-passage').first().waitFor({ timeout: 180000 });
    await page.waitForTimeout(800);
    await shot(page, 'assistant-answer', page.locator('h1'));
    result.text['assistant-answer'] = await aria(page);
    result.assistant = (await page.locator('.assistant-answer').innerText()).slice(0, 600);
  } catch { result.notes.push('assistant did not answer in 180 s; previous image kept'); }
} else result.notes.push('assistant service not ready; previous image kept');
await page.context().close();

// Submission entry
const context = await browser.newContext({ viewport: { width: 1264, height: 936 }, deviceScaleFactor: 1 });
page = await context.newPage();
await page.goto('http://127.0.0.1:4180/submission/index.html');
await page.waitForTimeout(800);
await page.screenshot({ path: `${assets}/submission-entry-top.png` });
result.captured.push('submission-entry-top');
await context.close();

await browser.close();
await fs.writeFile(root + '/planning/u10-build/capture-ui-result.json', JSON.stringify(result, null, 2));
console.log(JSON.stringify({ captured: result.captured, notes: result.notes, assistant: result.assistant?.slice(0, 200) }, null, 2));
