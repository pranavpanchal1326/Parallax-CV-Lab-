// Renders each studio SVG master to a PNG of its native size (evidence/u08-art) and refreshes the fingerprint manifest.
import { chromium } from 'playwright';
import fs from 'node:fs';
import crypto from 'node:crypto';
const root = 'D:/ui project/apps/lab-web';
const mp = root + '/evidence/u08-art-manifest.json';
const m = JSON.parse(fs.readFileSync(mp, 'utf8'));
const sha = (f) => crypto.createHash('sha256').update(fs.readFileSync(f)).digest('hex');
const b = await chromium.launch({ channel: 'msedge' });
for (const row of m.artifacts) {
  const file = `${root}/public/studio/${row.file}`;
  row.sha256 = sha(file); row.bytes = fs.statSync(file).size;
  if (row.renderSha256) {
    const svg = fs.readFileSync(file, 'utf8');
    const [, w, h] = svg.match(/width="(\d+)" height="(\d+)"/);
    const p = await b.newPage({ viewport: { width: +w, height: +h }, deviceScaleFactor: 1 });
    await p.goto('http://127.0.0.1:4180/apps/lab-web/public/studio/' + row.file);
    await p.waitForTimeout(250);
    const png = `${root}/evidence/u08-art/${row.file.replace('.svg', '.png')}`;
    await p.screenshot({ path: png });
    row.renderSha256 = sha(png);
    await p.close();
  }
}
for (const row of m.sourceFiles) row.sha256 = sha('D:/ui project/' + row.file);
m.revised = { date: '2026-10-05', change: 'Footers no longer carry a phase code or date; artwork, geometry and scientific content unchanged. Previous masters and renders preserved in planning/revisions/U13-before-art-footers-20261005/.', renderMethod: 'Edge via Playwright at each SVG\'s native pixel size' };
fs.writeFileSync(mp, JSON.stringify(m, null, 2));
console.log('re-rendered', m.artifacts.filter((r) => r.renderSha256).length, 'of', m.artifacts.length);
await b.close();
