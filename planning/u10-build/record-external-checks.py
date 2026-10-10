"""Adds the automated external-check results to the packet documents. Safe to run once per results file."""
import json
from pathlib import Path

root = Path(__file__).resolve().parents[2]
r = json.loads((root / 'apps/lab-web/evidence/u12-checks/external-checks.json').read_text(encoding='utf-8'))
engines = '; '.join(f"{e['engine']} {e.get('version', '')}" for e in r['engines'] if e.get('allPass'))
files = ', '.join(f"{d['file']} ({d['bytes']} bytes)" for d in r['downloads'] if d.get('parsesAsJson') and d.get('identicalToDisplayedText'))
marker = '## Automated follow-up'

p = root / 'submission/EXTERNAL_CHECKS.md'
s = p.read_text(encoding='utf-8')
s = s.replace('U10-R1 · 4 October 2026. The runnable', 'U10-R2 · 5 October 2026. The runnable', 1)
if marker in s:
    s = s[:s.index(marker)].rstrip() + '\n'
s += f"""
{marker} · 5 October 2026

Run with `planning/u10-build/external-checks.mjs` (Playwright, temporary browser profiles) against the polished build. Results: [external-checks.json](../apps/lab-web/evidence/u12-checks/external-checks.json).

| Check above | What the automated run established | What is still open |
|---|---|---|
| Second browser | Eleven tasks (typed lookup, unknown-ID recovery, E01 result, plan-only fallback, tabs, fault stage 8, guided tour, quick search, sampling playground, role menu, manual guide) pass in: {engines}. No page errors. | A physical phone and touch input. WebKit here is Playwright's Windows build of the Safari engine, not Safari on an Apple device. |
| Native download completion | Four real downloads completed in Edge and were reopened from disk: {files}. Each parses as JSON and is byte-identical to the text the page displays. | Other browsers' download prompts were not exercised. |
| Actual browser zoom | Fourteen routes at the 200% and 400% zoom-equivalent viewports of a 1280 × 800 window (640 and 320 CSS pixels wide): no page-level horizontal scrolling, every page heading visible, the E01 and lookup tasks complete. | The zoom menu itself was not operated; a person should still look once at 200% and 400%. |
| Keyboard | Typed lookup, the E01 rehearsal and the environment tabs complete with Tab, typing and Enter only, with a visible focus indicator on each stop. axe-core 4.10.2 reports no violations on ten routes. | Spoken screen-reader output (NVDA, JAWS or VoiceOver) was not listened to. |

Still entirely human: the spoken screen-reader pass, a real phone, the fifteen-minute spoken rehearsal (the [demonstration script](DEMO-SCRIPT.md) and [presenter notes](Presenter-Notes.md) are ready), and the team's names, contributions and deadline year (`source/team.example.json`).
"""
p.write_text(s, encoding='utf-8', newline='\n')

p = root / 'submission/README.md'
s = p.read_text(encoding='utf-8')
line = 'A plain-language [demonstration script](DEMO-SCRIPT.md)'
if line not in s:
    s += '\n' + line + ' walks through the prototype page by page and lists what to show in Figma. Automated zoom, download, keyboard and second-browser results are recorded in [EXTERNAL_CHECKS.md](EXTERNAL_CHECKS.md).\n'
    p.write_text(s, encoding='utf-8', newline='\n')

p = root / 'submission/index.html'
s = p.read_bytes().decode('utf-8')
if 'DEMO-SCRIPT.md' not in s:
    a = 'Presenter notes and timed live-demo cues'
    i = s.index(a)
    j = s.index('</li>', i) + 5
    s = s[:j] + '<li><a href="DEMO-SCRIPT.md">Page-by-page demonstration script</a></li>' + s[j:]
    p.write_bytes(s.encode('utf-8'))

p = root / 'planning/U10_R2_EDITORIAL_RECORD.md'
s = p.read_text(encoding='utf-8')
head = '### Second polish pass and automated external checks'
if head not in s:
    s += f"""
{head}

Framework and phase wording ("React session", "P7-A", "SIM-POWER-v1") is replaced by plain words; two-line page titles render as a title with a smaller strapline; the Today page shows a four-figure status strip instead of a second floor plan; plan labels are larger; type is held to one scale (11, 13, 14, 16, 18, 21, 28, 40 and the display size). An inline favicon removes a 404 on first load. Packet images, deck, report and walkthrough were captured and rebuilt again afterwards.

`external-checks.mjs` then ran the machine-checkable part of the external list: seven tasks in Edge, Chrome, Firefox and WebKit; four completed native downloads equal to the displayed text; fourteen routes at 200% and 400% zoom-equivalent viewports; three keyboard-only tasks. All pass; details and limits are in `submission/EXTERNAL_CHECKS.md`. A spoken screen reader, a physical phone, the human rehearsal and the team declaration remain human tasks and are not claimed.
"""
    p.write_text(s, encoding='utf-8', newline='\n')
print('documents updated')
