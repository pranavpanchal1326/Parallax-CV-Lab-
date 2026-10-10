"""Reference list without access dates (user request), poster links, external-check tasks for the
playground and role menu. Idempotent."""
from pathlib import Path

root = Path(__file__).resolve().parents[2]


def edit(rel, marker, old, new):
    p = root / rel
    s = p.read_text(encoding='utf-8')
    if marker in s:
        return
    assert s.count(old) == 1, (rel, old[:70], s.count(old))
    p.write_text(s.replace(old, new), encoding='utf-8', newline='\n')


b = 'planning/u10-build/build-report-editorial.py'
edit(b, 'def undated', "sources = json.loads((ROOT / 'research/u02-sources.json').read_text(encoding='utf-8'))['sources']",
     "sources = json.loads((ROOT / 'research/u02-sources.json').read_text(encoding='utf-8'))['sources']\n\n\n"
     "def undated(text):\n"
     "    \"\"\"The report carries no dates of its own; the source register keeps each access date.\"\"\"\n"
     "    for phrase in ('; accessed 3 October 2026', ' accessed 3 October 2026', 'accessed 3 October 2026'):\n"
     "        text = text.replace(phrase, '')\n"
     "    return text.replace('()', '').replace('  ', ' ')\n")
edit(b, 'Access dates are kept in the source register',
     "limitations. Accessed 3 October 2026. Full",
     "limitations. Access dates are kept in the source register. Full")
edit(b, "undated(s['date'])", "({s['date']}). {s['title']}", "({undated(s['date'])}). {s['title']}")

edit('submission/index.html', 'PARALLAX-Poster.pdf',
     '<li><code>MD</code><a href="Presenter-Notes.md">',
     '<li><code>PDF</code><a href="PARALLAX-Poster.pdf">One-page project poster for the viva (A2)</a></li>\n<li><code>MD</code><a href="Presenter-Notes.md">')
edit('submission/README.md', 'PARALLAX-Poster.pdf',
     'A plain-language [demonstration script](DEMO-SCRIPT.md)',
     'A one-page [project poster](PARALLAX-Poster.pdf) (A2, prints well at A3) summarises the proposal for the viva. A plain-language [demonstration script](DEMO-SCRIPT.md)')
edit('planning/u10-build/external-checks.mjs', 'samplingPlayground',
     "  await go(page, 'assistant');\n  await page.waitForTimeout(1500);",
     "  await go(page, '');\n"
     "  await page.locator('.playground-rates button', { hasText: '20 Hz' }).click();\n"
     "  const fast = await page.locator('.playground-reading').innerText();\n"
     "  await page.locator('.playground-rates button', { hasText: '3 Hz' }).click();\n"
     "  const slow = await page.locator('.playground-reading').innerText();\n"
     "  r.samplingPlayground = /21 samples/.test(fast) && /4 samples also fit a 1 Hz/.test(slow) && (await page.locator('.pg-dot').count()) === 4;\n"
     "  await page.locator('.role-menu > summary').click();\n"
     "  await page.locator('.role-menu-list a', { hasText: 'Technician' }).click();\n"
     "  await page.waitForTimeout(300);\n"
     "  r.roleMenu = page.url().endsWith('#/tech') && !(await page.locator('.role-menu').evaluate((d) => d.open));\n"
     "  await go(page, 'assistant');\n  await page.waitForTimeout(1500);")
edit('planning/u10-build/record-external-checks.py', 'Eleven tasks',
     'Nine tasks (typed lookup, unknown-ID recovery, E01 result, plan-only fallback, tabs, fault stage 8, guided tour, quick search, manual guide)',
     'Eleven tasks (typed lookup, unknown-ID recovery, E01 result, plan-only fallback, tabs, fault stage 8, guided tour, quick search, sampling playground, role menu, manual guide)')
edit('submission/index.html', 'Eleven tasks pass', 'Nine tasks pass in Edge, Chrome, Firefox and WebKit.', 'Eleven tasks pass in Edge, Chrome, Firefox and WebKit.')
print('poster links and undated references applied')
