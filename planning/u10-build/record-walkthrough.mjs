// Re-encodes the backup walkthrough with the page's own recorder (ten frames, eight seconds each).
import { chromium } from 'playwright';
import fs from 'node:fs/promises';
const out = 'D:/ui project/submission/demo';
const browser = await chromium.launch({ channel: 'msedge', headless: true });
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
await page.goto('http://127.0.0.1:4180/submission/demo/index.html');
const started = Date.now();
await page.click('#record');
await page.waitForFunction(() => document.getElementById('movie')?.src?.startsWith('blob:'), null, { timeout: 150000 });
const elapsed = (Date.now() - started) / 1000;
const { base64, type } = await page.evaluate(async () => {
  const blob = await (await fetch(document.getElementById('movie').src)).blob();
  const bytes = new Uint8Array(await blob.arrayBuffer());
  let s = ''; for (let i = 0; i < bytes.length; i += 32768) s += String.fromCharCode(...bytes.subarray(i, i + 32768));
  return { base64: btoa(s), type: blob.type };
});
const bytes = Buffer.from(base64, 'base64');
await fs.writeFile(out + '/PARALLAX-Recorded-Walkthrough.webm', bytes);
const receipt = { method: '80-second recording of ten captured UI frames with captions', elapsedSeconds: Number(elapsed.toFixed(3)), bytes: bytes.length, mime: type, frames: 10, recorded: '2026-10-05', note: 'Re-encoded after the interface polish from re-captured frames; not an uninterrupted live screen recording.' };
await fs.writeFile(out + '/recording-receipt.json', JSON.stringify(receipt, null, 2));
console.log(JSON.stringify(receipt));
await browser.close();
