"""Undated edition: page-count references, the body sentence that carried a review date,
and the signal-rule motif on the deck's first and last slides. Idempotent."""
import json
from pathlib import Path

root = Path(__file__).resolve().parents[2]


def sub(rel, pairs):
    p = root / rel
    s = p.read_bytes().decode('utf-8')
    for old, new in pairs:
        if old in s:
            s = s.replace(old, new)
    p.write_bytes(s.encode('utf-8'))


# report body: the review date is recorded in the source register; the sentence no longer repeats it
p = root / 'submission/source/report-content.json'
d = json.loads(p.read_text(encoding='utf-8'))
for sec in d['sections']:
    sec['paragraphs'] = [t.replace('Fourteen public sources were reviewed on 3 October 2026.', 'Fourteen public sources were reviewed.') for t in sec['paragraphs']]
p.write_text(json.dumps(d, indent=2, ensure_ascii=False), encoding='utf-8', newline='\n')

sub('submission/index.html', [('PDF · 21 pages', 'PDF · 23 pages')])
sub('submission/EVIDENCE_INDEX.md', [('Twenty-one-page PDF with persona, empathy-map and journey-map figures', 'Twenty-three-page PDF with contents, an at-a-glance page, persona, empathy-map and journey-map figures and a smart-features status table'),
                                     ('all twenty-one PDF pages', 'all PDF pages'),
                                     ('U10-R2 · 5 October 2026. Current local', 'Current local')])
sub('submission/README.md', [('U10-R2 · 5 October 2026. Start at', 'Start at'), ('and is now twenty-one pages', 'and is now twenty-three pages')])
sub('submission/EXTERNAL_CHECKS.md', [('U10-R2 · 5 October 2026. The runnable', 'The runnable')])

# deck motif
b = root / 'planning/u10-build/build-deck-editorial.py'
s = b.read_text(encoding='utf-8')
if 'def signal_rule' not in s:
    marker = 'def chrome(slide, i, start, end):'
    assert s.count(marker) == 1
    s = s.replace(marker, '''def signal_rule(slide, x, y, w, period=1.5, amp=0.11):
    """The sampled 2 Hz reference as a decorative rule: eight spot-colour samples per period."""
    import math
    step = period / 8
    k = step / 2
    while k < w:
        d = 0.06
        dot = slide.shapes.add_shape(MSO_SHAPE.OVAL, Inches(x + k - d / 2), Inches(y - amp * math.sin(2 * math.pi * k / period) - d / 2), Inches(d), Inches(d))
        dot.shadow.inherit = False
        dot.fill.solid()
        dot.fill.fore_color.rgb = SPOT
        dot.line.fill.background()
        k += step


''' + marker)
    a = "            run(par, '   ·   '.join(m['name'] for m in team['members']), SANS, 12, INK2)\n"
    assert s.count(a) == 1
    s = s.replace(a, a + "        signal_rule(slide, M, 6.45, 5.2)\n")
    b.write_text(s, encoding='utf-8', newline='\n')
print('undated edition applied')
