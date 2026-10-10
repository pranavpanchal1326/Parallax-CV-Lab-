"""One-page exhibition poster (A2 portrait) for the viva. Every figure and number restates the
report; nothing new is claimed. Undated. Run with a Python that has reportlab and Pillow."""
from pathlib import Path
import json, math
from reportlab.pdfgen import canvas
from reportlab.platypus import Paragraph
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib import colors
from reportlab.lib.utils import ImageReader
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from PIL import Image as PILImage

ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT / 'submission/PARALLAX-Poster.pdf'
figs = json.loads((ROOT / 'submission/source/report-figures.json').read_text(encoding='utf-8'))
for name, file in [('Serif', 'georgia.ttf'), ('Serif-Italic', 'georgiai.ttf'), ('Sans', 'arial.ttf'), ('Sans-Bold', 'arialbd.ttf'), ('Mono', 'consola.ttf')]:
    pdfmetrics.registerFont(TTFont(name, 'C:/Windows/Fonts/' + file))
INK, INK2, SPOT = colors.HexColor('#20232B'), colors.HexColor('#535B66'), colors.HexColor('#3346D3')
PAPER, CARD, RULE, PLATE = colors.HexColor('#F4F1E9'), colors.HexColor('#FBFAF5'), colors.HexColor('#B9B6AE'), colors.HexColor('#151922')
W, H, M = 1191, 1684, 64
CW = W - 2 * M
c = canvas.Canvas(str(OUT), pagesize=(W, H))
c.setTitle('PARALLAX - project poster'); c.setAuthor('PARALLAX project workspace')
c.setFillColor(PAPER); c.rect(0, 0, W, H, fill=1, stroke=0)


def style(font, size, leading, color=INK):
    return ParagraphStyle('s', fontName=font, fontSize=size, leading=leading, textColor=color)


def para(text, st, x, top, width):
    p = Paragraph(text, st)
    _, h = p.wrap(width, 2000)
    p.drawOn(c, x, top - h)
    return h


def kicker(text, x, y, color=SPOT):
    c.setFont('Mono', 12); c.setFillColor(color)
    c.drawString(x, y, ' '.join(text.upper()) if False else text.upper())


def rule(y, x1=M, x2=W - M, color=INK, w=1):
    c.setStrokeColor(color); c.setLineWidth(w); c.line(x1, y, x2, y)


def plate(path, x, top, w, h, pad=10):
    c.setFillColor(CARD); c.setStrokeColor(RULE); c.setLineWidth(.7); c.rect(x, top - h, w, h, fill=1, stroke=1)
    c.setStrokeColor(INK); c.setLineWidth(.6)
    for px, py, dx, dy in ((x, top - h, -1, -1), (x + w, top - h, 1, -1), (x, top, -1, 1), (x + w, top, 1, 1)):
        c.line(px + dx * 4, py, px + dx * 16, py); c.line(px, py + dy * 4, px, py + dy * 16)
    with PILImage.open(ROOT / path) as im:
        iw, ih = im.size
    s = min((w - 2 * pad) / iw, (h - 2 * pad) / ih)
    c.drawImage(ImageReader(str(ROOT / path)), x + (w - iw * s) / 2, top - h + (h - ih * s) / 2, iw * s, ih * s, mask='auto')


def signal_rule(x, y, width, period=150, amp=9):
    c.setStrokeColor(RULE); c.setLineWidth(.8)
    path = c.beginPath(); path.moveTo(x, y)
    for i in range(1, int(width) + 1):
        path.lineTo(x + i, y + amp * math.sin(2 * math.pi * i / period))
    c.drawPath(path)
    c.setFillColor(SPOT)
    k = period / 16
    while k < width:
        c.circle(x + k, y + amp * math.sin(2 * math.pi * k / period), 2.4, fill=1, stroke=0)
        k += period / 8


# masthead
c.setFillColor(SPOT); c.rect(M, H - 78, 14, 14, fill=1, stroke=0)
c.setFillColor(INK); c.setFont('Sans-Bold', 15); c.drawString(M + 26, H - 76, 'P A R A L L A X')
c.setFont('Mono', 12); c.setFillColor(INK2); c.drawRightString(W - M, H - 76, 'SIGNAL & COMPUTER VISION LAB  ·  70 m²  ·  UI/UX DESIGN PROPOSAL')
rule(H - 96)

# title
kicker('Final year project', M, H - 142)
top = H - 160
top -= para('A laboratory proposal.', style('Serif', 94, 98), M, top, CW)
top -= para('With the evidence in view.', style('Serif-Italic', 74, 84, SPOT), M, top, CW)
top -= 26

# hero: render and the idea
hero_h = 410
plate('design/phase-08/renders/R02_iso_cutaway.jpg', M, top, 640, hero_h)
x2, w2 = M + 684, CW - 684
t = top
t -= para('One 70 m² room, designed as a physical space and a digital service together.', style('Serif-Italic', 25, 33), x2, t, w2) + 22
for n, text in enumerate(['A complete kit must share one usable interval.', 'Evidence needs its method, source and settings.', 'Recovery needs a receipt and a responsible owner.'], 1):
    rule(t, x2, W - M, RULE, .7); t -= 12
    c.setFont('Serif-Italic', 34); c.setFillColor(SPOT); c.drawString(x2, t - 30, f'{n:02d}')
    t -= para(text, style('Sans', 17, 24), x2 + 62, t - 2, w2 - 62) + 26
c.setFont('Mono', 10.5); c.setFillColor(INK2)
c.drawString(M, top - hero_h - 20, 'Concept render of the assumed 10 × 7 m room. Not a photograph of an installed laboratory.')
top -= hero_h + 52
signal_rule(M, top, CW)
top -= 40

# the journey
kicker('The student journey, seven steps', M, top); top -= 16
rule(top); top -= 12
steps = [('Prepare', 'Read the question, the kit and the safety check.'), ('Reserve', 'One booking holds every item for the same time.'), ('Arrive', 'Check in at the station and confirm the kit.'), ('Bench', 'Record each run with its settings.'), ('Notebook', 'Write a claim the evidence supports.'), ('Submit', 'Freeze the revision and wait for the receipt.'), ('Return', 'Count the kit back and close the session.')]
col = CW / len(steps)
heights = []
for i, (name, text) in enumerate(steps):
    x = M + i * col
    c.setFont('Serif-Italic', 30); c.setFillColor(SPOT); c.drawString(x, top - 28, f'{i + 1:02d}')
    c.setFont('Serif', 21); c.setFillColor(INK); c.drawString(x, top - 58, name)
    heights.append(para(text, style('Sans', 12.5, 17, INK2), x, top - 68, col - 18))
top -= 68 + max(heights) + 28

# three columns: room, smart features, screens
rule(top); top -= 14
gap = 36
cw3 = (CW - 2 * gap) / 3
xa, xb, xc = M, M + cw3 + gap, M + 2 * (cw3 + gap)
kicker('The room', xa, top - 10); kicker('Smart features, and how real each one is', xb, top - 10); kicker('The prototype', xc, top - 10)
body_top = top - 28
plate('apps/lab-web/evidence/u08-art/plan-orientation.png', xa, body_top, cw3, 232)
para('Seven zones total 70 m²: computing 24.96, capture 10.92, circulation 15.00, collaboration 7.04, signal work 5.76, faculty 3.20, storage 3.12. A 1.5 m spine and a 1.2 × 0.9 m accessible approach are kept clear in the model.', style('Sans', 12.5, 17.5, INK2), xa, body_top - 246, cw3)
t = body_top
tones = {'Working': colors.HexColor('#1F7A4D'), 'Simulated': SPOT, 'Partly': SPOT, 'Concept': colors.HexColor('#9A6700')}
for name, status, text in figs['smartFeatures']['rows']:
    rule(t, xb, xb + cw3, RULE, .6)
    c.setFont('Serif', 16); c.setFillColor(INK); c.drawString(xb, t - 21, name)
    c.setFont('Mono', 10); c.setFillColor(tones[status]); c.drawRightString(xb + cw3, t - 20, status.upper())
    t -= 32
rule(t, xb, xb + cw3, RULE, .6)
para('Working means it runs in the local prototype with example records, not that an institutional service is connected.', style('Sans', 11, 14.5, INK2), xb, t - 8, cw3)
if False:
    pass
shots = ['submission/assets/dashboard.png', 'submission/assets/E01-3Hz.png', 'submission/assets/reserve.png', 'submission/assets/fault-8.png']
sw, sh = (cw3 - 12) / 2, 108
for i, shot in enumerate(shots):
    plate(shot, xc + (i % 2) * (sw + 12), body_top - (i // 2) * (sh + 16), sw, sh, pad=5)
para('A working local prototype: student journey, smart dashboard, fault recovery, lab map, on-site lookup and a local AI guide that cites its source. Open the Guided tour in the top bar to follow the demonstration order.', style('Sans', 12.5, 17.5, INK2), xc, body_top - 2 * (sh + 16) - 6, cw3)

# numbers
ny = 236
rule(ny + 14)
stats = [s for s in figs['glance']['stats'] if s['label'] in ('Room', 'Bookable resources', 'Reviewed sources', 'Wireframes', 'Design system', 'Automated tests')]
ncol = CW / len(stats)
for i, s in enumerate(stats):
    x = M + i * ncol
    c.setFont('Mono', 10.5); c.setFillColor(SPOT); c.drawString(x, ny - 6, s['label'].upper())
    c.setFont('Mono', 44); c.setFillColor(INK); c.drawString(x, ny - 54, s['value'])
    para(s['text'], style('Sans', 11, 14.5, INK2), x, ny - 64, ncol - 20)

# footer
rule(88, color=RULE, w=.7)
para('<b>Honest boundaries.</b> Research is secondary only, with fourteen reviewed sources and no local participants. Sensor readings, energy figures and bookings are examples. The room is a design model, not a surveyed space. The AI guide is a real local model limited to the project\'s reviewed guides.', style('Sans', 12, 16.5, INK2), M, 76, CW * .72)
c.setFont('Mono', 10.5); c.setFillColor(INK2); c.drawRightString(W - M, 44, 'PARALLAX  ·  UI/UX DESIGN PROPOSAL')
c.showPage(); c.save()
print('poster written', OUT.stat().st_size)
