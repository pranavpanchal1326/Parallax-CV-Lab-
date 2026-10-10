"""Patches build-report-editorial.py for the undated, artistic edition: no date or revision on the
cover or in footers, a contents page with real page numbers, an at-a-glance page, the signal-rule
motif on the cover, and a smart-features status table. Idempotent."""
import json
from pathlib import Path

root = Path(__file__).resolve().parents[2]
p = root / 'planning/u10-build/build-report-editorial.py'
s = p.read_text(encoding='utf-8')
if 'TableOfContents' in s:
    print('already patched')
    raise SystemExit


def rep(old, new, count=1):
    global s
    assert s.count(old) == count, (old[:70], s.count(old))
    s = s.replace(old, new)


rep("from reportlab.platypus import (SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak,\n                                KeepTogether, Flowable)",
    "from reportlab.platypus import (SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak,\n                                KeepTogether, Flowable)\nfrom reportlab.platypus.tableofcontents import TableOfContents\nimport math")
rep("REVISION = figs['revision']", "REVISION = figs['revision']\nFOOTER = 'PARALLAX  ·  UI/UX DESIGN PROPOSAL  ·  SIGNAL & COMPUTER VISION LAB'")
rep("    'cover': ParagraphStyle(",
    "    'toc0': ParagraphStyle('toc0', fontName='Serif', fontSize=13, leading=27, textColor=INK),\n"
    "    'toc1': ParagraphStyle('toc1', fontName='Sans', fontSize=9.5, leading=17, leftIndent=22, textColor=INK2),\n"
    "    'stat': ParagraphStyle('stat', fontName='Mono', fontSize=30, leading=34, textColor=INK),\n"
    "    'statlabel': ParagraphStyle('statlabel', fontName='Mono', fontSize=7.2, leading=10, textColor=SPOT),\n"
    "    'cover': ParagraphStyle(")
# footer and cover motif
rep("    canvas.drawString(MARGIN, 30, REVISION.upper() + '  ·  LOCAL PROPOSAL AND EVIDENCE')",
    "    canvas.drawString(MARGIN, 30, FOOTER)\n"
    "    if doc.page == 1:\n"
    "        signal_rule(canvas, MARGIN, 96, CW)")
rep("def page(canvas, doc):",
    "def signal_rule(canvas, x, y, width, period=120, amp=7):\n"
    "    \"\"\"The sampled 2 Hz reference as a decorative rule: a hairline sine with eight samples per period.\"\"\"\n"
    "    canvas.saveState()\n"
    "    canvas.setStrokeColor(RULE); canvas.setLineWidth(.6)\n"
    "    path = canvas.beginPath(); path.moveTo(x, y)\n"
    "    for i in range(1, int(width) + 1):\n"
    "        path.lineTo(x + i, y + amp * math.sin(2 * math.pi * i / period))\n"
    "    canvas.drawPath(path)\n"
    "    canvas.setFillColor(SPOT)\n"
    "    step = period / 8\n"
    "    k = step / 2\n"
    "    while k < width:\n"
    "        canvas.circle(x + k, y + amp * math.sin(2 * math.pi * k / period), 1.6, fill=1, stroke=0)\n"
    "        k += step\n"
    "    canvas.restoreState()\n\n\n"
    "def page(canvas, doc):")
# cover: no revision line, no administrative caption
rep("p(data['subtitle'], 'coversub'), p(REVISION, 'evidence'), p(data['scope']), Spacer(1, 10),",
    "p(data['subtitle'], 'coversub'), p(data['scope']), Spacer(1, 14),")
rep("""if team and team.get('members'):
    story.append(raw('<font name="Mono" color="#3346D3">TEAM</font>&nbsp;&nbsp; ' + esc('  ·  '.join(m['name'] for m in team['members'])) + (f'&nbsp;&nbsp;·&nbsp;&nbsp;{esc(team["deadline"])}' if team.get('deadline') else ''), 'caption'))
else:
    story.append(p('Team names, individual contributions and the assignment deadline year were not supplied. This packet leaves those administrative facts unclaimed.', 'caption'))
story.append(PageBreak())""",
    """if team and team.get('members'):
    story.append(raw('<font name="Mono" color="#3346D3">TEAM</font>&nbsp;&nbsp; ' + esc('  ·  '.join(m['name'] for m in team['members'])), 'caption'))
story.append(PageBreak())
# contents
toc = TableOfContents()
toc.levelStyles = [S['toc0'], S['toc1']]
toc.dotsMinLevel = -1
story += [raw('CONTENTS', 'kicker'), p('In this report', 'h'), toc, PageBreak()]
# at a glance
glance = figs['glance']
cells = [[raw(esc(g['label']).upper(), 'statlabel'), p(g['value'], 'stat'), p(g['text'], 'small')] for g in glance['stats']]
grid = Table([cells[0:3], cells[3:6], cells[6:9]], colWidths=[CW / 3] * 3, hAlign='LEFT')
grid.setStyle(TableStyle([('LINEABOVE', (0, 0), (-1, -1), .8, INK), ('VALIGN', (0, 0), (-1, -1), 'TOP'), ('LEFTPADDING', (0, 0), (-1, -1), 0),
                          ('RIGHTPADDING', (0, 0), (-1, -1), 14), ('TOPPADDING', (0, 0), (-1, -1), 9), ('BOTTOMPADDING', (0, 0), (-1, -1), 16)]))
story += [raw('AT A GLANCE', 'kicker'), p('The proposal in nine numbers', 'h'), p(glance['lede'], 'lede'), grid, Spacer(1, 10),
          Plate([glance['art']], max_height=232), p(glance['artCaption'], 'caption'), PageBreak()]""")
# heading -> contents entries
rep("""    return [raw(f'SECTION {int(number):02d}', 'kicker'),
            raw(f'<font name="Serif-Italic" color="#3346D3">{esc(number)}.</font> {esc(name)}', 'h')]""",
    """    para = raw(f'<font name="Serif-Italic" color="#3346D3">{esc(number)}.</font> {esc(name)}', 'h')
    para.toc = (0, f'{number}.  {name}')
    return [raw(f'SECTION {int(number):02d}', 'kicker'), para]""")
rep("p('User personas', 'h2'),", "toc_h2('User personas'),")
rep("p('Empathy map', 'h2'),", "toc_h2('Empathy map'),")
rep("p('User journey map', 'h2'),", "toc_h2('User journey map'),")
rep("figure_no = 0\nmd_figures = []",
    "figure_no = 0\nmd_figures = []\n\n\ndef toc_h2(text, level=1):\n    para = p(text, 'h2')\n    para.toc = (level, text)\n    return para\n\n\ndef toc_h(text):\n    para = p(text, 'h')\n    para.toc = (0, text)\n    return para\n\n\nclass Doc(SimpleDocTemplate):\n    def afterFlowable(self, flowable):\n        entry = getattr(flowable, 'toc', None)\n        if entry:\n            self.notify('TOCEntry', (entry[0], entry[1], self.page))")
rep("p('References and reading scope', 'h'),", "toc_h('References and reading scope'),")
rep("p('Requirement and rubric evidence', 'h'),", "toc_h('Requirement and rubric evidence'),")
rep("p('Assessment and handoff', 'h')]", "toc_h('Assessment and handoff')]")
# smart features table in section 7
rep("    story.append(p('Workspace evidence: ' + '; '.join(sec['evidence']), 'evidence'))\n    md += ['Evidence: ' + '; '.join(sec['evidence']), '']",
    "    if sec['title'].startswith('7.'):\n"
    "        sf = figs['smartFeatures']\n"
    "        story += [Spacer(1, 6), p('Smart features, and how real each one is', 'h2'), rule_table(['Feature', 'Status', 'What exists'], sf['rows'], [150, 70, 284]), Spacer(1, 4), p(sf['note'], 'caption')]\n"
    "        md += ['### Smart features, and how real each one is', ''] + md_table(['Feature', 'Status', 'What exists'], sf['rows']) + [sf['note'], '']\n"
    "    story.append(p('Workspace evidence: ' + '; '.join(sec['evidence']), 'evidence'))\n    md += ['Evidence: ' + '; '.join(sec['evidence']), '']")
rep("md = ['# ' + data['title'], data['subtitle'], REVISION, data['scope'], '']", "md = ['# ' + data['title'], data['subtitle'], data['scope'], '']")
rep("doc = SimpleDocTemplate(str(OUT / 'PARALLAX-Final-Report.pdf')", "doc = Doc(str(OUT / 'PARALLAX-Final-Report.pdf')")
rep("doc.build(story, onFirstPage=page, onLaterPages=page)", "doc.multiBuild(story, onFirstPage=page, onLaterPages=page)")
# md_table is defined after the cover block; the glance page does not use it, but section 7 does (defined before the loop).
p.write_text(s, encoding='utf-8', newline='\n')

fp = root / 'submission/source/report-figures.json'
f = json.loads(fp.read_text(encoding='utf-8'))
f['revision'] = 'U10-R3'
f['glance'] = {
    'lede': 'One 70 m² room, designed as a physical space and a digital service together.',
    'stats': [
        {'label': 'Room', 'value': '70 m²', 'text': 'An assumed 10 × 7 m envelope, 3 m high, divided into seven zones.'},
        {'label': 'Bookable resources', 'value': '13', 'text': 'Stations, the capture area, camera, lights, tripod, target and signal bench.'},
        {'label': 'Reviewed sources', 'value': '14', 'text': 'Secondary research only. Zero local participants.'},
        {'label': 'Requirements', 'value': '20', 'text': 'Each traced to a problem, a wireframe and an implementation boundary.'},
        {'label': 'Wireframes', 'value': '15', 'text': 'Annotated boards from preparation to technician recovery.'},
        {'label': 'Design system', 'value': '40', 'text': 'Component families, with 87 variants in the Figma library.'},
        {'label': 'Smart features', 'value': '9', 'text': 'Five working, two simulated, one partly built, one concept.'},
        {'label': 'System scenarios', 'value': '14', 'text': 'Conflicts, retries, faults and fallbacks, each reconciled.'},
        {'label': 'Automated tests', 'value': '155', 'text': '139 application tests and 16 assistant-service tests pass.'},
    ],
    'art': 'apps/lab-web/evidence/u08-art/ART-01.png',
    'artCaption': 'The lab\'s identity study: a 2 Hz reference, and the four samples a 3 Hz rate keeps of it. Generated artwork, not a measurement.',
}
f['smartFeatures'] = {
    'rows': [
        ['Digital experiment manual', 'Working', 'The question, the kit and a safety check before every session.'],
        ['Equipment lookup by label', 'Working', 'Typing the printed ID opens the record. Camera scanning is a concept.'],
        ['AI assistant', 'Working', 'Local Ollama model answering from reviewed guides, with the cited section.'],
        ['Digital twin', 'Working', 'One geometry drives the live plan and the optional 3D model.'],
        ['Equipment health', 'Working', 'A fault restricts the asset everywhere until a recorded verification.'],
        ['IoT sensors', 'Simulated', 'Example readings with their source and age. No hardware is connected.'],
        ['Smart energy monitoring', 'Simulated', 'Interval energy and a booking-aware standby preview. No meter.'],
        ['AR / VR learning', 'Partly', 'A 3D scene rehearsal runs in the browser. Headset AR is a concept.'],
        ['Voice assistant', 'Concept', 'Proposed for hands-busy bench work. Not built in this prototype.'],
    ],
    'note': 'The same table appears on the prototype dashboard. "Working" means it runs in the local prototype with example records; it does not mean an institutional service is connected.',
}
fp.write_text(json.dumps(f, indent=2, ensure_ascii=False), encoding='utf-8', newline='\n')
print('report builder patched')
