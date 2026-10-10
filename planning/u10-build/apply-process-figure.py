"""Adds the wireframe-to-interface figure (report section 6), the capture it needs, tour and search
checks in the external checks, and the tour tip in the demonstration script. Idempotent."""
import json
from pathlib import Path

root = Path(__file__).resolve().parents[2]


def edit(rel, marker, old, new):
    p = root / rel
    s = p.read_text(encoding='utf-8')
    if marker in s:
        return
    assert s.count(old) == 1, (rel, old[:70], s.count(old))
    p.write_text(s.replace(old, new), encoding='utf-8', newline='\n')


# capture of the built reservation step
edit('planning/u10-build/capture-ui.mjs', "'reserve'",
     "// E01 at 3 Hz\n",
     "// Reservation step, for the wireframe-to-interface figure\n"
     "page = await open('E01/prepare');\n"
     "for (const box of await page.locator('main input[type=checkbox]').all()) await box.check();\n"
     "await page.locator('.journey-actions a, .journey-actions button').last().click();\n"
     "await page.waitForTimeout(600);\n"
     "await shot(page, 'reserve');\n"
     "await page.context().close();\n\n"
     "// E01 at 3 Hz\n")

# report builder: a section may carry several extra figures
edit('planning/u10-build/build-report-editorial.py', 'for extra in extras',
     """    extra = figs['extra'].get(sec['title'])
    if extra:
        story.append(KeepTogether([Spacer(1, 4), Plate(extra['grid'], columns=extra['columns'], max_height=250), caption(extra['caption'])]))
        md += [extra['caption'], ''] + ['![' + Path(g).stem + '](../../' + g + ')' for g in extra['grid']] + ['']""",
     """    extras = figs['extra'].get(sec['title']) or []
    for extra in extras if isinstance(extras, list) else [extras]:
        story.append(KeepTogether([Spacer(1, 4), Plate(extra['grid'], columns=extra['columns'], max_height=250), caption(extra['caption'])]))
        md += [extra['caption'], ''] + ['![' + Path(g).stem + '](../../' + g + ')' for g in extra['grid']] + ['']""")
fp = root / 'submission/source/report-figures.json'
f = json.loads(fp.read_text(encoding='utf-8'))
six = f['extra']['6. Wireframes']
if not isinstance(six, list):
    f['extra']['6. Wireframes'] = [
        {'grid': ['submission/assets/WF03.png', 'submission/assets/reserve.png'], 'columns': 2,
         'caption': 'From wireframe to interface. Left: WF03, the authored booking structure. Right: the reservation step as built, with the same time slots and whole-kit manifest.'},
        six,
    ]
    fp.write_text(json.dumps(f, indent=2, ensure_ascii=False), encoding='utf-8', newline='\n')

# external checks: tour and quick search
edit('planning/u10-build/external-checks.mjs', 'guidedTour',
     "  await go(page, 'assistant');\n  await page.waitForTimeout(1500);",
     "  await go(page, 'dashboard');\n"
     "  await page.getByRole('button', { name: 'Guided tour' }).click();\n"
     "  await page.locator('.tour-strip .primary').click();\n"
     "  await page.waitForTimeout(300);\n"
     "  r.guidedTour = page.url().endsWith('#/E01/prepare') && /02 \\/ 14/.test(await page.locator('.tour-count').innerText());\n"
     "  await page.getByRole('button', { name: 'End tour' }).click();\n"
     "  await page.keyboard.press('Control+k');\n"
     "  await page.keyboard.type('cal-01');\n"
     "  await page.keyboard.press('Enter');\n"
     "  await page.waitForTimeout(300);\n"
     "  r.quickSearch = page.url().endsWith('#/assets/CAL-01');\n"
     "  await go(page, 'assistant');\n  await page.waitForTimeout(1500);")
edit('planning/u10-build/record-external-checks.py', 'Nine tasks',
     'Seven tasks (typed lookup, unknown-ID recovery, E01 result, plan-only fallback, tabs, fault stage 8, manual guide)',
     'Nine tasks (typed lookup, unknown-ID recovery, E01 result, plan-only fallback, tabs, fault stage 8, guided tour, quick search, manual guide)')

# demonstration script and entry page
edit('submission/DEMO-SCRIPT.md', 'Guided tour',
     '**Opening line.**',
     '**Two aids while presenting.** Press **Guided tour** in the top bar: it walks through fourteen pages in this order and shows one line to say on each. Press **/** (or Ctrl+K) to jump to any page or piece of equipment by name.\n\n**Opening line.**')
edit('submission/index.html', 'Guided tour',
     '<a href="DEMO-SCRIPT.md">Page-by-page demonstration script</a> · what to say, what to click and what to show in Figma.',
     '<a href="DEMO-SCRIPT.md">Page-by-page demonstration script</a> · what to say, what to click and what to show in Figma. Inside the prototype, <b>Guided tour</b> in the top bar follows this order.')
edit('submission/index.html', 'Nine tasks pass',
     'Seven tasks pass in Edge, Chrome, Firefox and WebKit.',
     'Nine tasks pass in Edge, Chrome, Firefox and WebKit.')
print('process figure and checks applied')
