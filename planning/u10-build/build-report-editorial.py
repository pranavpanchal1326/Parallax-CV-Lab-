"""U10-R2 editorial report. Every paragraph, table, reference and appendix row of
submission/source/report-content.json is kept as written. Added: the editorial page
language and the research/design figures declared in submission/source/report-figures.json.
Run with a Python that has reportlab, pypdf and Pillow."""
from pathlib import Path
import csv, html, json
from reportlab.platypus import (SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak,
                                KeepTogether, Flowable)
from reportlab.platypus.tableofcontents import TableOfContents
import math
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib import colors
from reportlab.lib.utils import ImageReader
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from PIL import Image as PILImage
from pypdf import PdfReader

ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT / 'submission'
data = json.loads((OUT / 'source/report-content.json').read_text(encoding='utf-8'))
figs = json.loads((OUT / 'source/report-figures.json').read_text(encoding='utf-8'))
team_file = OUT / 'source/team.json'
team = json.loads(team_file.read_text(encoding='utf-8')) if team_file.exists() else None
REVISION = figs['revision']
FOOTER = 'PARALLAX  ·  UI/UX DESIGN PROPOSAL  ·  SIGNAL & COMPUTER VISION LAB'

for name, file in [('Serif', 'georgia.ttf'), ('Serif-Italic', 'georgiai.ttf'), ('Serif-Bold', 'georgiab.ttf'),
                   ('Sans', 'arial.ttf'), ('Sans-Bold', 'arialbd.ttf'), ('Mono', 'consola.ttf')]:
    pdfmetrics.registerFont(TTFont(name, 'C:/Windows/Fonts/' + file))
pdfmetrics.registerFontFamily('Serif', normal='Serif', bold='Serif-Bold', italic='Serif-Italic', boldItalic='Serif-Italic')
pdfmetrics.registerFontFamily('Sans', normal='Sans', bold='Sans-Bold', italic='Sans', boldItalic='Sans-Bold')

INK, INK2, SPOT = colors.HexColor('#20232B'), colors.HexColor('#535B66'), colors.HexColor('#3346D3')
PAPER, CARD, RULE, SOFT = (colors.HexColor(x) for x in ('#F4F1E9', '#FBFAF5', '#B9B6AE', '#E6E9FF'))
PW, PH, MARGIN = 612, 792, 54
CW = PW - 2 * MARGIN

S = {
    'body': ParagraphStyle('body', fontName='Serif', fontSize=10.3, leading=15.4, textColor=INK, spaceAfter=9.5),
    'lede': ParagraphStyle('lede', fontName='Serif-Italic', fontSize=12.5, leading=18, textColor=INK, spaceAfter=10),
    'h': ParagraphStyle('h', fontName='Serif', fontSize=27, leading=31, textColor=INK, spaceAfter=16),
    'h2': ParagraphStyle('h2', fontName='Serif', fontSize=17, leading=21, textColor=INK, spaceBefore=6, spaceAfter=9),
    'kicker': ParagraphStyle('kicker', fontName='Mono', fontSize=8, leading=11, textColor=SPOT, spaceAfter=7),
    'caption': ParagraphStyle('caption', fontName='Sans', fontSize=8.3, leading=11.6, textColor=INK2, spaceAfter=11),
    'evidence': ParagraphStyle('evidence', fontName='Mono', fontSize=7.1, leading=10.4, textColor=INK2, spaceBefore=4, spaceAfter=8),
    'cell': ParagraphStyle('cell', fontName='Sans', fontSize=8.6, leading=11.8, textColor=INK),
    'th': ParagraphStyle('th', fontName='Mono', fontSize=7.4, leading=10, textColor=INK2),
    'small': ParagraphStyle('small', fontName='Sans', fontSize=7.6, leading=10.2, textColor=INK),
    'smallmuted': ParagraphStyle('smallmuted', fontName='Sans', fontSize=7.1, leading=9.6, textColor=INK2),
    'tiny': ParagraphStyle('tiny', fontName='Sans', fontSize=6.7, leading=8.6, textColor=INK),
    'tinyhead': ParagraphStyle('tinyhead', fontName='Mono', fontSize=6.4, leading=8.4, textColor=SPOT),
    'role': ParagraphStyle('role', fontName='Serif', fontSize=12.5, leading=15, textColor=INK, spaceAfter=3),
    'toc0': ParagraphStyle('toc0', fontName='Serif', fontSize=13, leading=27, textColor=INK),
    'toc1': ParagraphStyle('toc1', fontName='Sans', fontSize=9.5, leading=17, leftIndent=22, textColor=INK2),
    'stat': ParagraphStyle('stat', fontName='Mono', fontSize=30, leading=34, textColor=INK),
    'statlabel': ParagraphStyle('statlabel', fontName='Mono', fontSize=7.2, leading=10, textColor=SPOT),
    'cover': ParagraphStyle('cover', fontName='Serif', fontSize=58, leading=62, textColor=INK, spaceAfter=10),
    'coversub': ParagraphStyle('coversub', fontName='Serif-Italic', fontSize=19, leading=25, textColor=SPOT, spaceAfter=14),
}
esc = lambda t: html.escape(str(t))


def p(text, style='body'):
    return Paragraph(esc(text).replace('\n', '<br/>'), S[style])


def raw(markup, style='body'):
    return Paragraph(markup, S[style])


def spaced(text):
    return ' '.join(text.upper()) if False else text.upper()


class Plate(Flowable):
    """Hairline card with crop marks; holds one image or a grid of images."""

    def __init__(self, paths, columns=1, max_height=215, width=CW, pad=7, gap=6):
        super().__init__()
        self.paths, self.columns, self.pad, self.gap, self.width = paths, columns, pad, gap, width
        rows = -(-len(paths) // columns)
        cell_w = (width - 2 * pad - gap * (columns - 1)) / columns
        sizes = []
        for path in paths:
            with PILImage.open(ROOT / path) as im:
                sizes.append(im.size)
        cell_h = min(max(cell_w * h / w for w, h in sizes), (max_height - 2 * pad - gap * (rows - 1)) / rows)
        self.cell_w, self.cell_h, self.rows, self.sizes = cell_w, cell_h, rows, sizes
        self.height = 2 * pad + rows * cell_h + gap * (rows - 1)
        if columns == 1:
            w, h = sizes[0]
            scale = min(cell_w / w, cell_h / h)
            self.width = w * scale + 2 * pad
            self.cell_w = w * scale
        self.hAlign = 'LEFT'

    def wrap(self, aw, ah):
        return self.width, self.height + 22

    def draw(self):
        c, w, h = self.canv, self.width, self.height
        c.translate(0, 13)
        c.setFillColor(CARD); c.setStrokeColor(RULE); c.setLineWidth(.5)
        c.rect(0, 0, w, h, fill=1, stroke=1)
        c.setStrokeColor(INK); c.setLineWidth(.45)
        for x, y, dx, dy in ((0, 0, -1, -1), (w, 0, 1, -1), (0, h, -1, 1), (w, h, 1, 1)):
            c.line(x + dx * 3, y, x + dx * 11, y); c.line(x, y + dy * 3, x, y + dy * 11)
        for i, path in enumerate(self.paths):
            col, row = i % self.columns, i // self.columns
            iw, ih = self.sizes[i]
            scale = min(self.cell_w / iw, self.cell_h / ih)
            dw, dh = iw * scale, ih * scale
            x = self.pad + col * (self.cell_w + self.gap) + (self.cell_w - dw) / 2
            y = h - self.pad - (row + 1) * self.cell_h - row * self.gap + (self.cell_h - dh) / 2
            c.drawImage(ImageReader(str(ROOT / path)), x, y, dw, dh, mask='auto')


class EmotionCurve(Flowable):
    """Anticipated emotion line across the journey stages, aligned to the table columns below it."""

    def __init__(self, labels, levels, label_w, col_w, height=62):
        super().__init__()
        self.labels, self.levels, self.label_w, self.col_w, self.height, self.width = labels, levels, label_w, col_w, height, CW

    def wrap(self, aw, ah):
        return self.width, self.height

    def draw(self):
        c, h = self.canv, self.height
        lo, hi, top, bottom = min(self.levels), max(self.levels), h - 16, 10
        mid = bottom + (0 - lo) / (hi - lo) * (top - bottom)
        c.setStrokeColor(RULE); c.setLineWidth(.4); c.setDash(2, 2)
        c.line(self.label_w, mid, self.width, mid); c.setDash()
        c.setFont('Mono', 6.4); c.setFillColor(SPOT)
        c.drawString(0, h - 9, 'LIKELY EMOTION')
        c.setFillColor(INK2); c.setFont('Sans', 6.4); c.drawString(0, h - 18, 'anticipated,'); c.drawString(0, h - 26, 'not observed')
        pts = [(self.label_w + (i + .5) * self.col_w, bottom + (v - lo) / (hi - lo) * (top - bottom)) for i, v in enumerate(self.levels)]
        c.setStrokeColor(SPOT); c.setLineWidth(1.1)
        path = c.beginPath(); path.moveTo(*pts[0])
        for x, y in pts[1:]:
            path.lineTo(x, y)
        c.drawPath(path)
        for (x, y), label in zip(pts, self.labels):
            c.setFillColor(CARD); c.setStrokeColor(SPOT); c.circle(x, y, 2.6, fill=1, stroke=1)
            c.setFillColor(INK); c.setFont('Serif-Italic', 7.6); c.drawCentredString(x, y + 6, label)


def rule_table(headers, rows, widths=None):
    cells = [[p(spaced(c), 'th') for c in headers]] + [[p(c, 'cell') for c in r] for r in rows]
    t = Table(cells, colWidths=widths or [CW / len(headers)] * len(headers), repeatRows=1, hAlign='LEFT')
    t.setStyle(TableStyle([('LINEABOVE', (0, 0), (-1, 0), .9, INK), ('LINEBELOW', (0, 0), (-1, 0), .5, INK),
                           ('LINEBELOW', (0, 1), (-1, -1), .35, RULE), ('VALIGN', (0, 0), (-1, -1), 'TOP'),
                           ('LEFTPADDING', (0, 0), (-1, -1), 0), ('RIGHTPADDING', (0, 0), (-1, -1), 10),
                           ('TOPPADDING', (0, 0), (-1, -1), 6.5), ('BOTTOMPADDING', (0, 0), (-1, -1), 6.5)]))
    return t


figure_no = 0
md_figures = []


def toc_h2(text, level=1):
    para = p(text, 'h2')
    para.toc = (level, text)
    return para


def toc_h(text):
    para = p(text, 'h')
    para.toc = (0, text)
    return para


class Doc(SimpleDocTemplate):
    def afterFlowable(self, flowable):
        entry = getattr(flowable, 'toc', None)
        if entry:
            self.notify('TOCEntry', (entry[0], entry[1], self.page))


def caption(text):
    global figure_no
    figure_no += 1
    return raw(f'<font name="Mono" color="#3346D3">FIG. {figure_no:02d}</font>&nbsp;&nbsp; {esc(text)}', 'caption')


def heading(title):
    number, _, name = title.partition('. ')
    para = raw(f'<font name="Serif-Italic" color="#3346D3">{esc(number)}.</font> {esc(name)}', 'h')
    para.toc = (0, f'{number}.  {name}')
    return [raw(f'SECTION {int(number):02d}', 'kicker'), para]


def persona_figure():
    roles = figs['personas']['roles']
    cells = []
    for r in roles:
        cells.append([raw(f'<font name="Mono" color="#3346D3">{r["id"]}</font>&nbsp;&nbsp;<font name="Mono" color="#535B66">{esc(r["tier"].upper())}</font>', 'tinyhead'),
                      p(r['role'], 'role'), p(r['job'], 'small'), Spacer(1, 4),
                      raw('<font name="Mono" color="#3346D3">TRIGGER → OUTCOME</font>', 'tinyhead'), p(r['outcome'], 'smallmuted'), Spacer(1, 3),
                      raw('<font name="Mono" color="#3346D3">STILL TO CHECK LOCALLY</font>', 'tinyhead'), p(r['check'], 'smallmuted')])
    t = Table([cells[0:3], cells[3:6]], colWidths=[CW / 3] * 3, hAlign='LEFT')
    t.setStyle(TableStyle([('LINEABOVE', (0, 0), (-1, -1), .8, INK), ('VALIGN', (0, 0), (-1, -1), 'TOP'),
                           ('LEFTPADDING', (0, 0), (-1, -1), 0), ('RIGHTPADDING', (0, 0), (-1, -1), 12),
                           ('TOPPADDING', (0, 0), (-1, -1), 8), ('BOTTOMPADDING', (0, 0), (-1, -1), 14)]))
    return t


def empathy_figure():
    e = figs['empathy']['primary']
    quad = lambda label, items: [raw(f'<font name="Mono" color="#3346D3">{label}</font>', 'tinyhead'), Spacer(1, 3)] + [p('– ' + x, 'small') for x in items]
    centre = [raw(f'<font name="Mono" color="#3346D3">{e["id"]}</font>', 'tinyhead'), p(e['role'], 'role'), p(e['moment'], 'smallmuted')]
    t = Table([[quad('LIKELY SAYS', e['says']), centre, quad('LIKELY THINKS', e['thinks'])],
               [quad('LIKELY DOES', e['does']), '', quad('LIKELY FEELS', e['feels'])],
               [quad('PAINS', e['pains']), '', quad('GAINS', e['gains'])]],
              colWidths=[CW * .37, CW * .26, CW * .37], hAlign='LEFT')
    t.setStyle(TableStyle([('SPAN', (1, 0), (1, 1)), ('VALIGN', (0, 0), (-1, -1), 'TOP'), ('VALIGN', (1, 0), (1, 1), 'MIDDLE'),
                           ('BACKGROUND', (1, 0), (1, 1), SOFT), ('BOX', (0, 0), (-1, -1), .8, INK),
                           ('LINEBELOW', (0, 0), (-1, 1), .4, RULE), ('LINEAFTER', (0, 0), (1, 1), .4, RULE),
                           ('SPAN', (1, 2), (1, 2)), ('LINEABOVE', (0, 2), (-1, 2), .8, INK), ('LINEAFTER', (1, 2), (1, 2), .4, RULE),
                           ('SPAN', (0, 2), (1, 2)),
                           ('LEFTPADDING', (0, 0), (-1, -1), 10), ('RIGHTPADDING', (0, 0), (-1, -1), 10),
                           ('TOPPADDING', (0, 0), (-1, -1), 9), ('BOTTOMPADDING', (0, 0), (-1, -1), 10)]))
    others = figs['empathy']['others']
    aspects = [('Likely says', 'says'), ('Likely thinks', 'thinks'), ('Likely does', 'does'), ('Likely feels', 'feels'), ('Pains', 'pains'), ('Gains', 'gains')]
    head = [''] + [f'{o["id"]} · {o["role"]} — {o["moment"]}' for o in others]
    rows = [[label] + [o[key] for o in others] for label, key in aspects]
    return [t, Spacer(1, 12), rule_table(head, rows, [78, (CW - 78) / 2, (CW - 78) / 2])]


def journey_figure():
    j = figs['journey']
    label_w = 56
    col_w = (CW - label_w) / len(j['stages'])
    head = [p('', 'tinyhead')] + [raw(f'<font name="Mono" color="#3346D3">{i + 1:02d}</font><br/><font name="Serif" size="8.4" color="#20232B">{esc(s)}</font>', 'tinyhead') for i, s in enumerate(j['stages'])]
    body = [[raw(f'<font name="Mono" color="#535B66">{esc(r["label"].upper())}</font>', 'tinyhead')] + [p(c, 'tiny') for c in r['cells']] for r in j['rows']]
    t = Table([head] + body, colWidths=[label_w] + [col_w] * len(j['stages']), hAlign='LEFT')
    t.setStyle(TableStyle([('LINEABOVE', (0, 0), (-1, 0), .8, INK), ('LINEBELOW', (0, 0), (-1, 0), .5, INK),
                           ('LINEBELOW', (0, 1), (-1, -1), .35, RULE), ('VALIGN', (0, 0), (-1, -1), 'TOP'),
                           ('LEFTPADDING', (0, 0), (-1, -1), 0), ('RIGHTPADDING', (0, 0), (-1, -1), 5),
                           ('TOPPADDING', (0, 0), (-1, -1), 5), ('BOTTOMPADDING', (0, 0), (-1, -1), 6)]))
    return [EmotionCurve(j['emotion'], j['level'], label_w, col_w), t]


def signal_rule(canvas, x, y, width, period=120, amp=7):
    """The sampled 2 Hz reference as a decorative rule: a hairline sine with eight samples per period."""
    canvas.saveState()
    canvas.setStrokeColor(RULE); canvas.setLineWidth(.6)
    path = canvas.beginPath(); path.moveTo(x, y)
    for i in range(1, int(width) + 1):
        path.lineTo(x + i, y + amp * math.sin(2 * math.pi * i / period))
    canvas.drawPath(path)
    canvas.setFillColor(SPOT)
    step = period / 8
    k = step / 2
    while k < width:
        canvas.circle(x + k, y + amp * math.sin(2 * math.pi * k / period), 1.6, fill=1, stroke=0)
        k += step
    canvas.restoreState()


def page(canvas, doc):
    canvas.setTitle('PARALLAX - Final UI/UX Proposal'); canvas.setAuthor('PARALLAX project workspace')
    if doc.page == 1:
        canvas.setFillColor(PAPER); canvas.rect(0, 0, PW, PH, fill=1, stroke=0)
    canvas.setFillColor(SPOT); canvas.rect(MARGIN, 761, 7, 7, fill=1, stroke=0)
    canvas.setFillColor(INK); canvas.setFont('Sans-Bold', 7.8)
    canvas.drawString(MARGIN + 13, 762, 'P A R A L L A X')
    canvas.setFont('Mono', 7); canvas.setFillColor(INK2)
    canvas.drawRightString(PW - MARGIN, 762, 'SIGNAL & COMPUTER VISION LAB  ·  70 m²')
    canvas.setStrokeColor(INK); canvas.setLineWidth(.7); canvas.line(MARGIN, 752, PW - MARGIN, 752)
    canvas.setStrokeColor(RULE); canvas.setLineWidth(.4); canvas.line(MARGIN, 42, PW - MARGIN, 42)
    canvas.drawString(MARGIN, 30, FOOTER)
    if doc.page == 1:
        signal_rule(canvas, MARGIN, 96, CW)
    canvas.drawRightString(PW - MARGIN, 30, f'{doc.page:02d}')


story = [Spacer(1, 40), raw('FINAL YEAR PROJECT  ·  UI/UX DESIGN PROPOSAL', 'kicker'), p(data['title'], 'cover'),
         p(data['subtitle'], 'coversub'), p(data['scope']), Spacer(1, 14),
         Plate(['design/phase-08/renders/R02_iso_cutaway.jpg'], max_height=262), p('Conceptual P4-D room render. Authored project visualization, not a photograph of an installed laboratory.', 'caption'),
         p('A current assessor entry links the working app, Figma designs, physical model, source evidence, presentation and static demonstration. This report distinguishes authored examples from measurements and institution-owned services.')]
if team and team.get('members'):
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
          Plate([glance['art']], max_height=232), p(glance['artCaption'], 'caption'), PageBreak()]
figure_no = 0  # the cover render is repeated as Fig. 01 in section 1
md = ['# ' + data['title'], data['subtitle'], data['scope'], '']


def md_table(headers, rows):
    return [' | '.join(headers), ' | '.join(['---'] * len(headers))] + [' | '.join(str(c) for c in r) for r in rows] + ['']


for sec in data['sections']:
    story += heading(sec['title']); md += ['## ' + sec['title'], '']
    for i, text in enumerate(sec['paragraphs']):
        story.append(p(text)); md += [text, '']
    if 'table' in sec:
        t = sec['table']; story += [Spacer(1, 6), rule_table(t['headers'], t['rows']), Spacer(1, 12)]
        md += md_table(t['headers'], t['rows'])
    if 'image' in sec:
        story.append(KeepTogether([Spacer(1, 4), Plate([sec['image']], max_height=178 if sec['title'].startswith('7.') else 225), caption(sec['caption'])]))
        md += ['![' + sec['caption'] + '](../../' + sec['image'] + ')', '']
    extras = figs['extra'].get(sec['title']) or []
    for extra in extras if isinstance(extras, list) else [extras]:
        story.append(KeepTogether([Spacer(1, 4), Plate(extra['grid'], columns=extra['columns'], max_height=250), caption(extra['caption'])]))
        md += [extra['caption'], ''] + ['![' + Path(g).stem + '](../../' + g + ')' for g in extra['grid']] + ['']
    if sec['title'].startswith('7.'):
        sf = figs['smartFeatures']
        story += [Spacer(1, 6), p('Smart features, and how real each one is', 'h2'), rule_table(['Feature', 'Status', 'What exists'], sf['rows'], [150, 70, 284]), Spacer(1, 4), p(sf['note'], 'caption')]
        md += ['### Smart features, and how real each one is', ''] + md_table(['Feature', 'Status', 'What exists'], sf['rows']) + [sf['note'], '']
    story.append(p('Workspace evidence: ' + '; '.join(sec['evidence']), 'evidence'))
    md += ['Evidence: ' + '; '.join(sec['evidence']), '']
    if sec['title'].startswith('3.'):
        pe, em, jo = figs['personas'], figs['empathy'], figs['journey']
        story += [PageBreak(), raw('SECTION 03  ·  RESEARCH FIGURES', 'kicker'), toc_h2('User personas'),
                  p('Six role lenses frame who the lab serves. Each is a job to be done, with the local fact that would still have to be checked.', 'lede'),
                  persona_figure(), Spacer(1, 4), caption(pe['caption']),
                  PageBreak(), raw('SECTION 03  ·  RESEARCH FIGURES', 'kicker'), toc_h2('Empathy map'),
                  p('What each role is likely to say, think, do and feel at the moment the design has to help.', 'lede')]
        story += empathy_figure() + [Spacer(1, 4), caption(em['caption']),
                  PageBreak(), raw('SECTION 03  ·  RESEARCH FIGURES', 'kicker'), toc_h2('User journey map'),
                  p('One student, one vision experiment, eight stages: where the anticipated low points are and what the design offers at each.', 'lede')]
        story += journey_figure() + [Spacer(1, 4), caption(jo['caption']),
                  p('Workspace evidence: research/U02_RESEARCH_SYNTHESIS.md; research/PHASE_02_RESEARCH_AND_EXPERIENCE.md; submission/source/report-figures.json', 'evidence')]
        md += ['### User personas', '', pe['caption'], ''] + md_table(['ID', 'Role', 'Tier', 'Job to be done', 'Trigger → outcome', 'Still to check locally'], [[r['id'], r['role'], r['tier'], r['job'], r['outcome'], r['check']] for r in pe['roles']])
        e = em['primary']
        md += ['### Empathy map', '', em['caption'], ''] + md_table(['Aspect', f'{e["id"]} · {e["role"]} — {e["moment"]}'] + [f'{o["id"]} · {o["role"]} — {o["moment"]}' for o in em['others']],
                 [[label, '; '.join(e[key])] + [o[key] for o in em['others']] for label, key in [('Likely says', 'says'), ('Likely thinks', 'thinks'), ('Likely does', 'does'), ('Likely feels', 'feels'), ('Pains', 'pains'), ('Gains', 'gains')]])
        md += ['### User journey map', '', jo['caption'], ''] + md_table(['Stage'] + jo['stages'], [['Likely emotion'] + jo['emotion']] + [[r['label']] + r['cells'] for r in jo['rows']])
    story.append(PageBreak())

sources = json.loads((ROOT / 'research/u02-sources.json').read_text(encoding='utf-8'))['sources']


def undated(text):
    """The report carries no dates of its own; the source register keeps each access date."""
    for phrase in ('; accessed 3 October 2026', ' accessed 3 October 2026', 'accessed 3 October 2026'):
        text = text.replace(phrase, '')
    return text.replace('()', '').replace('  ', ' ')

story += [raw('APPENDIX A', 'kicker'), toc_h('References and reading scope'),
          p('The U02-R2 source register records the actual reading depth and limitations. Access dates are kept in the source register. Full text availability varies. These sources support the design rationale, without validating local user or site outcomes.')]
md += ['## References', '']
for s in sources:
    text = f"{s['id']} - {s['authors']} ({undated(s['date'])}). {s['title']}. Reading scope: {s['access']}."
    story += [p(text, 'caption'), Paragraph('<link href="' + html.escape(s['url'], quote=True) + '" color="#3346D3">' + esc(s['url']) + '</link>', S['caption'])]
    md += [text + ' ' + s['url'], '']
story += [PageBreak(), raw('APPENDIX B', 'kicker'), toc_h('Requirement and rubric evidence'),
          p('The original U02-R2 traceability contains all twenty requirements. This appendix preserves its design-stage boundaries; current implementation coverage is indexed in submission/EVIDENCE_INDEX.md and apps/lab-web/PARITY.md. Participant collection is excluded by the agreed desk-research scope; local user outcomes remain unmeasured.')]
requirements = list(csv.DictReader((ROOT / 'research/U02_TRACEABILITY.csv').open(encoding='utf-8-sig')))
rows = [[r['requirement_id'], r['requirement'], r['wireframe_ids'], r['implementation_boundary'].replace('participant evidence open', 'local user outcomes unmeasured')] for r in requirements]
story += [rule_table(['ID', 'Requirement', 'Board', 'U02-R2 boundary'], rows, [40, 170, 88, 206]), PageBreak(), raw('APPENDIX C', 'kicker'), toc_h('Assessment and handoff')]
rubric = [['User Research', '10', 'U02 register, synthesis, personas, empathy map and journey map (section 3 figures)'], ['Problem Analysis', '10', 'Twenty requirements and eight decisions'], ['Space Planning', '15', 'P4-D geometry, model, clearances and plan layers'], ['UI Design', '15', 'Fifteen boards, Figma library and current task views'], ['UX Design', '15', 'Fourteen scenario ledger, recovery and retained-context paths'], ['Innovation & Smart Features', '10', 'U04 provenance/energy, U05 models, U06 real local AI'], ['Accessibility & Safety', '10', 'Typed/list/manual paths, scans, keyboard evidence, sign studies and qualified limits'], ['Prototype & Demonstration', '10', 'Source/build checks, walkthrough and static backup'], ['Presentation & Documentation', '5', 'This report, editable deck, notes and current index']]
story += [rule_table(['Criterion', 'Marks', 'Evidence'], rubric, [157, 50, 297]), Spacer(1, 18), p('Contribution and administrative declaration', 'h2')]
if team and team.get('members'):
    story += [rule_table(['Team member', 'Contribution'], [[m['name'], m.get('contribution', '')] for m in team['members']], [170, 334]), Spacer(1, 8)]
    if team.get('deadline'):
        story.append(p('Submission deadline as stated by the team: ' + team['deadline'] + '.', 'caption'))
    story.append(p('Names, contributions and the deadline above were supplied by the team. External device, assistive-technology and site checks remain explicitly listed in EXTERNAL_CHECKS.md.', 'caption'))
else:
    story += [p('The workspace contains design, code, generated assets and verification records. File authorship and commits cannot establish individual team contributions here because this checkout has no Git history and no confirmed team list. The submission does not assign work to unnamed students. The team should attach its own truthful declaration before institutional submission.'),
              p('The assignment states a team of three students and a 5 August deadline, without a year. No date or deadline status is inferred. The local launcher and README provide the clean start and manual fallback. External device, assistive-technology and site checks remain explicitly listed in EXTERNAL_CHECKS.md.', 'caption')]

doc = Doc(str(OUT / 'PARALLAX-Final-Report.pdf'), pagesize=(PW, PH), leftMargin=MARGIN, rightMargin=MARGIN, topMargin=62, bottomMargin=56)
doc.multiBuild(story, onFirstPage=page, onLaterPages=page)
(OUT / 'source/Final-Report.md').write_text('\n'.join(md), encoding='utf-8', newline=chr(10))
reader = PdfReader(OUT / 'PARALLAX-Final-Report.pdf')
text = ' '.join((pg.extract_text() or '') for pg in reader.pages)
receipt = {'revision': REVISION, 'pages': len(reader.pages), 'sectionHeadings': [s['title'] for s in data['sections']], 'characters': len(text), 'figures': figure_no,
           'researchFigures': ['User personas', 'Empathy map', 'User journey map'], 'sources': len(sources), 'requirements': len(requirements), 'teamDeclared': bool(team),
           'allOriginalParagraphsPresent': None,
           'scope': 'Text structure verified; rendered pages are inspected separately.'}
squash = lambda t: ''.join(t.split())
flat = squash(text)
receipt['allOriginalParagraphsPresent'] = all(squash(par)[:60] in flat for s in data['sections'] for par in s['paragraphs'])
(ROOT / 'planning/u10-build/report-structure.json').write_text(json.dumps(receipt, indent=2, ensure_ascii=False), encoding='utf-8')
print(json.dumps(receipt, ensure_ascii=False))
