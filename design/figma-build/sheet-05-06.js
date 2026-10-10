// Figma use_figma script — builds Sheet 05 (Journeys & Service Blueprint) and Sheet 06 (Problem → Requirements).
// Run against file pHYpJXqlaHOSAs1Q6kmzIu once the Starter MCP limit lifts. Content: research/PHASE_02_RESEARCH_AND_EXPERIENCE.md §5–6.
const V={}; for (const v of await figma.variables.getLocalVariablesAsync('COLOR')) V[v.name]=v;
const S={}; for (const s of await figma.getLocalTextStylesAsync()) S[s.name]=s;
await Promise.all([["Instrument Serif","Regular"],["Instrument Serif","Italic"],["IBM Plex Sans","Regular"],["IBM Plex Sans","SemiBold"],["IBM Plex Sans","Medium"],["IBM Plex Mono","Medium"],["IBM Plex Mono","Regular"]].map(([family,style])=>figma.loadFontAsync({family,style})));
const P=(n,o=1)=>{const c=Object.values(V[n].valuesByMode)[0]; return figma.variables.setBoundVariableForPaint({type:'SOLID',color:{r:c.r,g:c.g,b:c.b},opacity:o},'color',V[n]);};
const [TAG,NOTE,FLOW,HEAD]=await Promise.all(["3:14","3:45","3:61","3:62"].map(i=>figma.getNodeByIdAsync(i)));
const key=(set,name)=>Object.keys(set.componentPropertyDefinitions).find(k=>k.startsWith(name+'#'));
const AL=(dir,o={})=>{const f=figma.createAutoLayout(dir,o); f.fills=[]; return f;};
const put=(par,ch,h='FILL',v)=>{par.appendChild(ch); if(h) ch.layoutSizingHorizontal=h; if(v) ch.layoutSizingVertical=v; return ch;};
const box=(par,dir,w,o={})=>{const f=AL(dir,o); par.appendChild(f); f.resize(w,10); f.layoutSizingVertical='HUG'; return f;};
const line=(f,side,color='line/default',w=1)=>{f.strokes=[P(color)]; f.strokeTopWeight=side.includes('t')?w:0; f.strokeBottomWeight=side.includes('b')?w:0; f.strokeLeftWeight=side.includes('l')?w:0; f.strokeRightWeight=side.includes('r')?w:0;};
async function tx(par,str,style='Body/M',color='ink/primary',h='FILL'){const t=figma.createText(); await t.setTextStyleIdAsync(S[style].id); t.characters=str; t.fills=[P(color)]; if(par){par.appendChild(t); if(h==='FILL'){t.layoutSizingHorizontal='FILL'; t.textAutoResize='HEIGHT';}} return t;}
function tag(par,type,label){const i=TAG.children.find(c=>c.name==='Type='+type).createInstance(); i.setProperties({[key(TAG,'Label')]:label.toUpperCase()}); if(par) par.appendChild(i); return i;}
function flow(par,kind,ref,label){const i=FLOW.children.find(c=>c.name==='Kind='+kind).createInstance(); i.setProperties({[key(FLOW,'Ref')]:ref,[key(FLOW,'Label')]:label}); if(par) par.appendChild(i); return i;}
function tags(par,list){const w=AL('HORIZONTAL',{itemSpacing:4}); par.appendChild(w); w.layoutSizingHorizontal='FILL'; w.layoutWrap='WRAP'; w.counterAxisSpacing=4; for(const [t,l] of list) tag(w,t,l); return w;}
async function sheet(name,x,y,num,kicker,title,intro){
 const f=AL('VERTICAL',{name,itemSpacing:72}); f.resize(1920,100); f.counterAxisSizingMode='FIXED'; f.primaryAxisSizingMode='AUTO';
 f.paddingLeft=f.paddingRight=80; f.paddingTop=56; f.paddingBottom=112; f.fills=[P('surface/paper')]; f.x=x; f.y=y;
 const h=HEAD.createInstance(); h.setProperties({[key(HEAD,'Meta')]:`SHEET ${num} / 09  ·  REV A  ·  02 OCT 2026`}); put(f,h);
 const tb=put(f,AL('HORIZONTAL',{name:'Title block',itemSpacing:40}));
 const l=box(tb,'VERTICAL',400,{itemSpacing:4}); await tx(l,num,'Display/XL','accent/signal'); await tx(l,kicker,'Label/Mono','ink/secondary');
 const r=put(tb,AL('VERTICAL',{itemSpacing:20})); r.paddingTop=12; await tx(r,title,'Display/L'); const it=await tx(r,intro,'Body/L','ink/secondary',null); it.resize(920,it.height); it.textAutoResize='HEIGHT';
 return f;
}
async function section(par,code,title,desc){ const s=put(par,AL('VERTICAL',{name:code+' '+title,itemSpacing:28})); s.paddingTop=24; line(s,'t','line/strong',1.5);
 const hd=put(s,AL('HORIZONTAL',{itemSpacing:40})); const a=box(hd,'VERTICAL',400); await tx(a,code,'Label/Mono','accent/signal');
 const b=put(hd,AL('VERTICAL',{itemSpacing:8})); await tx(b,title,'Heading/L'); if(desc){const d=await tx(b,desc,'Body/M','ink/secondary',null); d.resize(920,d.height); d.textAutoResize='HEIGHT';}
 return s; }
async function table(par,widths,head,rows,opt={}){ const t=put(par,AL('VERTICAL',{name:opt.name||'Table'})); line(t,'t','line/strong',1.5);
 const mk=async(cells,isHead)=>{ const r=put(t,AL('HORIZONTAL')); line(r,'b',isHead?'line/strong':'line/default',1);
  for(let i=0;i<cells.length;i++){ const c=AL('VERTICAL',{itemSpacing:6}); r.appendChild(c); c.resize(widths[i],10); c.layoutSizingVertical='FILL'; c.paddingTop=isHead?10:14; c.paddingBottom=isHead?10:16; c.paddingRight=16; if(opt.firstFill&&i===0&&!isHead){c.fills=[P('surface/sunk')]; c.paddingLeft=14;} const v=cells[i];
   if(isHead) await tx(c,v,'Label/Mono S','ink/tertiary');
   else if(Array.isArray(v)) tags(c,v);
   else if(v&&typeof v==='object') { if(v.tags) tags(c,v.tags); if(v.t) await tx(c,v.t,v.s||'Body/S',v.c||'ink/primary'); }
   else await tx(c,v,i===0?'Data/Mono':'Body/S',i===0?'ink/primary':'ink/secondary'); } return r; };
 await mk(head,true); for(const r of rows) await mk(r,false); return {t}; }
const arrow=async(par,label='→')=>{const w=AL('VERTICAL'); par.appendChild(w); w.paddingTop=18; await tx(w,label,'Label/Mono','ink/tertiary',null); return w;};
async function pipeline(par,steps){ const p=put(par,AL('HORIZONTAL',{itemSpacing:10})); p.layoutWrap='WRAP'; p.counterAxisSpacing=20; for(let i=0;i<steps.length;i++){ flow(p,...steps[i]); if(i<steps.length-1) await arrow(p);} return p; }

// ---------- SHEET 05 ----------
const f5=await sheet('05 · Journeys & Service Blueprint',0,3800,'05','JOURNEYS','From an assigned experiment to a returned kit','The student journey is the product backbone (D02). It is mapped stage by stage with the touchpoints — physical and digital — where each hypothesis would bite, and the design opportunity that answers it. The fault exception is then traced across every layer of the service.');
let s=await section(f5,'A — J1 · STUDENT · VISION EXPERIMENT E06','Eight stages, one connected record','Workflow W01. Emotion curve is a hypothesis to be redrawn from observation (M2).');
const stages=['Discover','Prepare','Reserve','Arrive & check in','Capture','Analyse','Document','Submit & return'];
const J=await table(s,[200,...stages.map(()=>195)],['STAGE',...stages.map((x,i)=>`${String(i+1).padStart(2,'0')}  ${x.toUpperCase()}`)],[
[{t:'Actions',s:'Heading/S'},'Opens the assigned experiment','Reads objective, checks prerequisites','Picks a time, reserves the full kit','Finds station CV-03, verifies kit','Sets light and camera, captures','Runs detection, compares lighting','Records observations and limits','Submits revision, returns kit'],
[{t:'Touchpoints',s:'Heading/S'},[['Page','P02'],['Page','P04']],[['Page','P05']],[['Page','P06'],['Page','P07']],[['Neutral','Signage'],['Page','P10'],['Page','P11']],[['Neutral','Zone C1'],['Page','P12']],[['Page','P14']],[['Page','P15']],[['Page','P16'],['Page','P11 return']]],
[{t:'Pain points',s:'Heading/S'},{tags:[['Hypothesis','H']],t:'Many similar experiments; no sense of duration'},{tags:[['Hypothesis','H01']],t:'Kit list unclear'},{tags:[['Hypothesis','H02']],t:'Room booked, devices not'},{tags:[['Hypothesis','H01']],t:'Missing accessory at the bench'},{tags:[['Hypothesis','H10']],t:'Light changes mid-capture'},{tags:[['Hypothesis','H12']],t:'Confidence read as correctness'},{tags:[['Hypothesis','H03']],t:'Settings lost'},{tags:[['Hypothesis','H']],t:'Unclear whether submission is final'}],
[{t:'Opportunities',s:'Heading/S'},{t:'Topic filters, duration and prerequisites up front'},{t:'Checklist that transfers into booking'},{t:'Complete-kit reservation with conflict handling'},{t:'Same manifest at check-in; report an issue inline'},{t:'Recording indicator; settings captured automatically'},{t:'Confidence vs ground truth explained'},{t:'Evidence embeds keep provenance'},{t:'Stable revision + return checklist'}],
[{t:'Requirements',s:'Heading/S'},[['Decision','R18']],[['Decision','R01']],[['Decision','R02'],['Decision','R03']],[['Decision','R04'],['Decision','R10']],[['Decision','R05']],[['Decision','R06'],['Decision','R07']],[['Decision','R08']],[['Decision','R09']]]]);
const er=AL('HORIZONTAL',{name:'Emotion curve'}); J.t.insertChild(3,er); er.layoutSizingHorizontal='FILL'; line(er,'b');
const elab=box(er,'VERTICAL',200,{itemSpacing:4}); elab.paddingTop=14; await tx(elab,'Likely emotion','Heading/S'); await tx(elab,'hypothesis','Label/Mono S','tag/hypothesis-fg');
const plot=figma.createFrame(); plot.name='Plot'; plot.fills=[]; er.appendChild(plot); plot.resize(1560,170);
const emo=[['Curious',0.7],['Uncertain',0.35],['Neutral',0.5],['Anxious',0.15],['Focused',0.6],['Engaged',0.85],['Tired',0.35],['Relieved',0.8]];
const mid=figma.createRectangle(); plot.appendChild(mid); mid.resize(1560,1); mid.y=85; mid.fills=[P('line/default')]; mid.name='Neutral line';
const pts=emo.map(([n,v],i)=>[i*195+97,20+(1-v)*110]);
let d=`M ${pts[0][0]} ${pts[0][1].toFixed(1)}`; for(let i=1;i<pts.length;i++){ const [x0,y0]=pts[i-1],[x1,y1]=pts[i]; const cx=(x0+x1)/2; d+=` C ${cx} ${y0.toFixed(1)} ${cx} ${y1.toFixed(1)} ${x1} ${y1.toFixed(1)}`; }
const cv=figma.createVector(); plot.appendChild(cv); cv.vectorPaths=[{windingRule:'NONE',data:d}]; cv.fills=[]; cv.strokes=[P('accent/signal')]; cv.strokeWeight=2.5; cv.name='Curve';
for (let i=0;i<pts.length;i++){ const [x,y]=pts[i]; const e=figma.createEllipse(); plot.appendChild(e); e.resize(14,14); e.x=x-7; e.y=y-7; e.fills=[P(emo[i][1]<0.4?'accent/signal':'surface/panel')]; e.strokes=[P('accent/signal')]; e.strokeWeight=2.5;
 const t=await tx(null,emo[i][0],'Label/Mono S',emo[i][1]<0.4?'accent/signal':'ink/secondary',null); plot.appendChild(t); t.x=x-t.width/2; t.y=y+14; }
s=await section(f5,'B — J2 · J3 · STAFF JOURNEYS','The technician and the instructor','Compressed to their critical path; each step names the page that carries it.');
const jr=put(s,AL('VERTICAL',{itemSpacing:28}));
await tx(jr,'J2 · TECHNICIAN · CAMERA KIT FAULT · W02','Label/Mono','ink/secondary');
await pipeline(jr,[['Terminal','P23','Report received'],['Step','P25','Triage with asset context'],['Exception','P09 · P06','Restrict the asset'],['System','P33','Notify affected bookings'],['Step','P26 · P25','Repair and verify'],['Terminal','P09','Restore availability']]);
await tx(jr,'Moments that matter: the report carries asset ID and symptoms · a restriction updates every availability view at once · verification is recorded before restoring.','Body/S','ink/secondary');
await tx(jr,'J3 · INSTRUCTOR · TEACHING SESSION · W04','Label/Mono','ink/secondary');
await pipeline(jr,[['Terminal','P27','Assign experiment'],['Step','P19 · P06','Reserve cohort resources'],['Decision','P27','Cohort ready?'],['System','P11 → P27','Attendance from check-in'],['Step','P27','Correct attendance with reason'],['Terminal','P28','Assess evidence']]);
s=await section(f5,'C — SERVICE BLUEPRINT · CAMERA KIT FAULT','One report, five layers, six moments','What the student sees above the line of visibility; what staff and systems must do below it for the exception to feel effortless.');
const B=await table(s,[200,260,260,260,260,260,260],['LAYER','1  REPORT','2  TRIAGE','3  RESTRICT','4  RE-ROUTE','5  REPAIR & VERIFY','6  RESTORE'],[
[{t:'Student',s:'Heading/S'},'Reports the fault from the passport or check-in','—','Sees “restricted” on the kit','Accepts another time or a compatible setup','—','Sees the kit available again'],
[{t:'Frontstage · digital',s:'Heading/S'},{tags:[['Page','P23']],t:'Issue form, asset preselected'},'—',{tags:[['Page','P09'],['Page','P06'],['Page','P10']],t:'Restriction shown everywhere'},{tags:[['Page','P33'],['Page','P07']],t:'Notice + reschedule'},'—',{tags:[['Page','P09']],t:'Ready state'}],
[{t:'Physical',s:'Heading/S'},'QR label on the kit','Inspection at S1 / C1','Kit tagged in storage','Alternate kit issued','Calibration target','Kit back in its bay'],
[{t:'Technician · backstage',s:'Heading/S'},'—',{tags:[['Page','P25']],t:'Queue with priority'},'Applies restriction rule','Confirms substitute',{tags:[['Page','P26']],t:'Record with evidence'},'Verification sign-off'],
[{t:'Data · systems',s:'Heading/S'},{t:'Issue',s:'Data/Mono'},{t:'Issue ↔ Asset',s:'Data/Mono'},{t:'Resource.condition',s:'Data/Mono'},{t:'Booking revalidation',s:'Data/Mono'},{t:'MaintenanceRecord',s:'Data/Mono'},{t:'AuditEvent',s:'Data/Mono'}]],{firstFill:true});
const vis=async(idx,label)=>{ const r=AL('HORIZONTAL',{name:label,itemSpacing:12}); B.t.insertChild(idx,r); r.layoutSizingHorizontal='FILL'; r.paddingTop=8; r.paddingBottom=8; r.counterAxisAlignItems='CENTER';
 await tx(r,label,'Label/Mono S','accent/signal',null); const dl=figma.createLine(); r.appendChild(dl); dl.layoutSizingHorizontal='FILL'; dl.strokes=[P('accent/signal')]; dl.strokeWeight=1.5; dl.dashPattern=[6,4]; };
await vis(3,'LINE OF INTERACTION'); await vis(5,'LINE OF VISIBILITY'); await vis(7,'LINE OF INTERNAL INTERACTION');

// ---------- SHEET 06 ----------
const f6=await sheet('06 · Problem → Requirements',2080,3800,'06','PROBLEM ANALYSIS','Six problems, twenty guarantees','Problems are written from the user’s side, reframed as opportunities, then turned into requirements the system must guarantee. Every requirement traces back to a hypothesis and forward to the pages that carry it — so when evidence changes a hypothesis, the affected design is obvious.');
s=await section(f6,'A — PROBLEM STATEMENTS & HOW MIGHT WE','From pain to opportunity');
const pg=put(s,AL('HORIZONTAL',{itemSpacing:20})); pg.layoutWrap='WRAP'; pg.counterAxisSpacing=20;
const PSs=[['PS1','Students cannot see a complete, compatible setup before they arrive.',['H01','H02'],'make a complete setup the unit of booking — not the room?'],['PS2','Evidence loses its settings and source between bench and report.',['H03','H12'],'make every result carry its own method?'],['PS3','Faults are invisible to the next person who books the equipment.',['H04'],'let one fault report protect every future booking?'],['PS4','Staff lack readiness and attendance visibility during sessions.',['H05','H07'],'give instructors readiness before the session starts?'],['PS5','Asset location and movement depend on memory.',['H08'],'turn every move of an asset into a record without extra work?'],['PS6','The physical room can undermine capture quality and orientation.',['H10','H11'],'let the room and the software share one map?']];
for (const [id,st,hs,hmw] of PSs){ const c=AL('VERTICAL',{name:id,itemSpacing:0}); pg.appendChild(c); c.resize(573,10); c.layoutSizingVertical='HUG'; c.fills=[P('surface/panel')]; c.strokes=[P('line/default')]; c.strokeWeight=1;
 const top=put(c,AL('VERTICAL',{itemSpacing:12})); top.paddingLeft=top.paddingRight=24; top.paddingTop=20; top.paddingBottom=22;
 const tr=put(top,AL('HORIZONTAL',{itemSpacing:12})); tr.primaryAxisAlignItems='SPACE_BETWEEN'; tr.counterAxisAlignItems='CENTER'; await tx(tr,id,'Display/M','accent/signal',null); const tg=AL('HORIZONTAL',{itemSpacing:4}); tr.appendChild(tg); for(const h of hs) tag(tg,'Hypothesis',h);
 await tx(top,st,'Heading/M');
 const bt=put(c,AL('VERTICAL',{itemSpacing:6})); bt.fills=[P('tag/decision-bg')]; bt.paddingLeft=bt.paddingRight=24; bt.paddingTop=14; bt.paddingBottom=18;
 await tx(bt,'HOW MIGHT WE','Label/Mono S','accent/signal'); const q=figma.createText(); q.fontName={family:'Instrument Serif',style:'Italic'}; q.fontSize=22; q.lineHeight={unit:'PIXELS',value:26}; q.characters=hmw; q.fills=[P('ink/inverse')]; bt.appendChild(q); q.layoutSizingHorizontal='FILL'; q.textAutoResize='HEIGHT'; }
s=await section(f6,'B — REQUIREMENT MATRIX','Twenty provisional requirements','“Must” and “Should” are planning priorities. All remain provisional until their linked hypotheses are tested.');
const R=[['R01','Experiments declare a versioned kit with accessory quantities.','PS1','Must',['P05','P06'],'H01'],['R02','A booking reserves every required resource for the same interval.','PS1','Must',['P06','P07'],'H02'],['R03','Conflicts preserve the user’s choices and offer alternatives.','PS1','Must',['P06'],'H02'],['R04','Check-in reuses the booking manifest and records attendance.','PS1 · PS4','Must',['P11','P27'],'H01 H05'],['R05','Every capture stores source, settings and timestamp automatically.','PS2','Must',['P12'],'H03'],['R06','Every processing output links input, parameters and version.','PS2','Must',['P12','P14'],'H03'],['R07','Confidence is labelled separately from correctness.','PS2','Must',['P14'],'H12'],['R08','Notebook embeds keep evidence identity and provenance.','PS2','Must',['P15'],'H03'],['R09','Submissions freeze a stable evidence-manifest revision.','PS2','Must',['P16'],'H03'],['R10','Issue reports preselect the asset ID and capture symptoms.','PS3','Must',['P23','P09'],'H04'],['R11','A restriction updates passport, booking and map availability together.','PS3','Must',['P09','P06','P10'],'H04'],['R12','Affected bookings are notified with an alternative.','PS3','Should',['P33','P07'],'H04'],['R13','Restoring availability requires recorded verification.','PS3','Must',['P25','P26'],'H04'],['R14','Instructors see cohort readiness before a session.','PS4','Should',['P27'],'H07'],['R15','Attendance corrections record actor, reason and time.','PS4','Must',['P27'],'H05'],['R16','Asset moves record from/to location, actor, time and reason.','PS5','Must',['P25'],'H08'],['R17','QR and manual ID entry resolve to the same asset record.','PS5','Must',['P31','P09'],'H08'],['R18','Zone and asset IDs are shared by signage, plan and software.','PS6','Must',['P10','Signage'],'H11'],['R19','Every 3D task has a list or 2D equivalent.','PS6','Must',['P10','P13'],'D10'],['R20','The capture zone avoids through-circulation and stray light.','PS6','Must',['Floor plan'],'H10']];
await table(s,[90,700,150,140,360,320],['ID','REQUIREMENT','PROBLEM','PRIORITY','CARRIED BY','DEPENDS ON · STATUS'],R.map(r=>[r[0],{t:r[1],s:'Body/M'},r[2],[[r[3]==='Must'?'Decision':'Neutral',r[3]]],r[4].map(p=>['Page',p]),[...r[5].split(' ').map(h=>[h.startsWith('D')?'Decision':'Hypothesis',h]),['Hypothesis','Provisional']]]));
s=await section(f6,'C — RUBRIC COVERAGE','What this phase earns toward the 100-mark scheme','Coverage is evidence of scope, not of quality; marks depend on depth and validation.');
const rc=put(s,AL('HORIZONTAL',{itemSpacing:16}));
for (const [n,m,st,b] of [['User research','10','Partial','Plan, personas, empathy, journeys ready; fieldwork pending'],['Problem analysis','10','Strong','PS1–PS6 → R01–R20 traceability'],['UX design','15','Started','IA and four flows (Sheets 07–08)'],['Accessibility & safety','10','Started','Inclusive overlays; R19; safety always reachable'],['Innovation','10','Framed','Signal-to-pixel story; Scene Studio in flows']]) { const c=put(rc,AL('VERTICAL',{itemSpacing:8})); c.fills=[P('surface/panel')]; c.strokes=[P('line/default')]; c.strokeWeight=1; c.paddingLeft=c.paddingRight=20; c.paddingTop=16; c.paddingBottom=20;
 const t=put(c,AL('HORIZONTAL',{itemSpacing:8})); t.counterAxisAlignItems='BASELINE'; await tx(t,m,'Display/M','accent/signal',null); await tx(t,'marks','Label/Mono S','ink/tertiary',null);
 await tx(c,n,'Heading/S'); tag(c,st==='Strong'?'Evidence':st==='Partial'?'Hypothesis':'Neutral',st); await tx(c,b,'Body/S','ink/secondary'); }
return {s05:f5.id,h05:f5.height,s06:f6.id,h06:f6.height};
