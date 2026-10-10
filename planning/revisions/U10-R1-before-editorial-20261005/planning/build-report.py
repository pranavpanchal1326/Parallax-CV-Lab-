from pathlib import Path
import json, html, re
from reportlab.pdfgen import canvas
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Image, Table, TableStyle, PageBreak, KeepTogether
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib import colors
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from PIL import Image as PILImage
from pypdf import PdfReader

ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT/'submission'
data = json.loads((OUT/'source/report-content.json').read_text(encoding='utf-8'))
for name, file in [('Arial','arial.ttf'),('ArialBold','arialbd.ttf')]:
    pdfmetrics.registerFont(TTFont(name, 'C:/Windows/Fonts/'+file))
ink=colors.HexColor('#17202E'); muted=colors.HexColor('#4B5666'); blue=colors.HexColor('#3346D3')
styles={
 'body':ParagraphStyle('body',fontName='Arial',fontSize=10.8,leading=15.3,textColor=ink,spaceAfter=10),
 'title':ParagraphStyle('title',fontName='ArialBold',fontSize=23,leading=28,textColor=ink,spaceAfter=20),
 'caption':ParagraphStyle('caption',fontName='Arial',fontSize=8.6,leading=12,textColor=muted,spaceAfter=11),
 'cell':ParagraphStyle('cell',fontName='Arial',fontSize=9,leading=12,textColor=ink),
 'th':ParagraphStyle('th',fontName='ArialBold',fontSize=9,leading=12,textColor=ink),
 'cover':ParagraphStyle('cover',fontName='ArialBold',fontSize=44,leading=49,textColor=ink,spaceAfter=16)
}
def p(text, style='body'): return Paragraph(html.escape(text).replace('\n','<br/>'), styles[style])
def image(rel,maxheight=215):
    path=ROOT/rel
    with PILImage.open(path) as pic: w,h=pic.size
    factor=min(504/w,maxheight/h)
    return Image(str(path), width=w*factor,height=h*factor)
def table(headers,rows,widths=None):
    cells=[[p(c,'th') for c in headers]]+[[p(str(c),'cell') for c in r] for r in rows]
    t=Table(cells,colWidths=widths or [504/len(headers)]*len(headers),repeatRows=1,hAlign='LEFT')
    t.setStyle(TableStyle([('BACKGROUND',(0,0),(-1,0),colors.HexColor('#ECEEF4')),('GRID',(0,0),(-1,-1),.5,colors.HexColor('#D9D9D9')),('VALIGN',(0,0),(-1,-1),'TOP'),('LEFTPADDING',(0,0),(-1,-1),8),('RIGHTPADDING',(0,0),(-1,-1),8),('TOPPADDING',(0,0),(-1,-1),8),('BOTTOMPADDING',(0,0),(-1,-1),8)]))
    return t
def page(canvas,doc):
    canvas.setTitle('PARALLAX - Final UI/UX Proposal'); canvas.setAuthor('PARALLAX project workspace')
    canvas.setFont('Arial',8); canvas.setFillColor(muted)
    canvas.drawString(54,764,'PARALLAX  /  Signal & Computer Vision Lab')
    canvas.drawRightString(558,30,str(doc.page)); canvas.drawString(54,30,'U10-R1  /  4 October 2026  /  Local proposal and evidence')
    canvas.setStrokeColor(colors.HexColor('#D9D9D9')); canvas.line(54,751,558,751)
story=[Spacer(1,65),p(data['title'],'cover'),p(data['subtitle'],'title'),p(data['revision']),p(data['scope']),Spacer(1,18),image('design/phase-08/renders/R02_iso_cutaway.jpg',250),Spacer(1,18),p('A current assessor entry links the working app, Figma designs, physical model, source evidence, presentation and static demonstration. This report distinguishes authored examples from measurements and institution-owned services.'),p('Team names, individual contributions and the assignment deadline year were not supplied. This packet leaves those administrative facts unclaimed.','caption'),PageBreak()]
md=['# '+data['title'],data['subtitle'],data['revision'],data['scope'],'']
for sec in data['sections']:
    story.append(p(sec['title'],'title')); md+=['## '+sec['title'],'']
    for text in sec['paragraphs']: story.append(p(text)); md += [text,'']
    if 'table' in sec:
        t=sec['table']; story += [Spacer(1,8),table(t['headers'],t['rows']),Spacer(1,12)]
        md += [' | '.join(t['headers']),' | '.join(['---']*len(t['headers']))]+[' | '.join(r) for r in t['rows']]+['']
    if 'image' in sec:
        story += [Spacer(1,4),image(sec['image'],170 if sec['title'].startswith('7.') else 215),Spacer(1,6),p(sec['caption'],'caption')]
        md += ['!['+sec['caption']+'](../../'+sec['image']+')','']
    story.append(p('Workspace evidence: '+'; '.join(sec['evidence']),'caption'))
    md += ['Evidence: '+ '; '.join(sec['evidence']),'']
    story.append(PageBreak())
sources=json.loads((ROOT/'research/u02-sources.json').read_text(encoding='utf-8'))['sources']
story += [p('References and reading scope','title'),p('The U02-R2 source register records the actual reading depth and limitations. Accessed 3 October 2026. Full text availability varies. These sources support the design rationale, without validating local user or site outcomes.')]
md += ['## References','']
for s in sources:
    text=f"{s['id']} - {s['authors']} ({s['date']}). {s['title']}. Reading scope: {s['access']}."
    story += [p(text,'caption'),Paragraph('<link href="'+html.escape(s['url'],quote=True)+'" color="#3346D3">'+html.escape(s['url'])+'</link>',styles['caption'])]
    md += [text+' '+s['url'],'']
story += [PageBreak(),p('Requirement and rubric evidence','title'),p('The original U02-R2 traceability contains all twenty requirements. This appendix preserves its design-stage boundaries; current implementation coverage is indexed in submission/EVIDENCE_INDEX.md and apps/lab-web/PARITY.md. Participant collection is excluded by the agreed desk-research scope; local user outcomes remain unmeasured.')]
import csv
requirements=list(csv.DictReader((ROOT/'research/U02_TRACEABILITY.csv').open(encoding='utf-8-sig')))
rows=[]
for r in requirements:
    rows.append([r['requirement_id'],r['requirement'],r['wireframe_ids'],r['implementation_boundary'].replace('participant evidence open','local user outcomes unmeasured')])
story += [table(['ID','Requirement','Board','U02-R2 boundary'],rows,[40,182,70,212]),PageBreak(),p('Assessment and handoff','title')]
rubric=[['User Research','10','U02 register, synthesis, personas and journeys'],['Problem Analysis','10','Twenty requirements and eight decisions'],['Space Planning','15','P4-D geometry, model, clearances and plan layers'],['UI Design','15','Fifteen boards, Figma library and current task views'],['UX Design','15','Fourteen scenario ledger, recovery and retained-context paths'],['Innovation & Smart Features','10','U04 provenance/energy, U05 models, U06 real local AI'],['Accessibility & Safety','10','Typed/list/manual paths, scans, keyboard evidence and qualified limits'],['Prototype & Demonstration','10','Source/build checks, walkthrough and static backup'],['Presentation & Documentation','5','This report, editable deck, notes and current index']]
story += [table(['Criterion','Marks','Evidence'],rubric,[157,50,297]),Spacer(1,15),p('Contribution and administrative declaration','title'),p('The workspace contains design, code, generated assets and verification records. File authorship and commits cannot establish individual team contributions here because this checkout has no Git history and no confirmed team list. The submission does not assign work to unnamed students. The team should attach its own truthful declaration before institutional submission.'),p('The assignment states a team of three students and a 5 August deadline, without a year. No date or deadline status is inferred. The local launcher and README provide the clean start and manual fallback. External device, assistive-technology and site checks remain explicitly listed in EXTERNAL_CHECKS.md.','caption')]
doc=SimpleDocTemplate(str(OUT/'PARALLAX-Final-Report.pdf'),pagesize=(612,792),leftMargin=54,rightMargin=54,topMargin=55,bottomMargin=54)
doc.build(story,onFirstPage=page,onLaterPages=page)
(OUT/'source/Final-Report.md').write_text('\n'.join(md),encoding='utf-8')
reader=PdfReader(OUT/'PARALLAX-Final-Report.pdf')
receipt={'pages':len(reader.pages),'sectionHeadings':[s['title'] for s in data['sections']],'characters':sum(len(p.extract_text() or '') for p in reader.pages),'sources':len(sources),'requirements':len(requirements),'scope':'Text structure verified; rendered pages are inspected separately.'}
(ROOT/'planning/u10-build/report-structure.json').write_text(json.dumps(receipt,indent=2),encoding='utf-8')
print(json.dumps(receipt))
