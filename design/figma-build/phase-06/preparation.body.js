
const lib=await view('library','Experiments');
heading(lib.content,'EXPERIMENTS / TWO PATHS THROUGH ONE LAB','Choose a question worth testing.','Begin with a method, a complete setup and a claim you can support.');
const lr=row(lib.content,'Selected investigation & catalogue',1376,32),focus=auto(lr,'Selected vision investigation',944,'VERTICAL','surface',24,24),catalogue=auto(lr,'Investigation index',400,'VERTICAL',null,0,24);
tag(focus,'SELECTED / E06');instance(focus,await figma.getNodeByIdAsync('2048:178'));
const shot=box(focus,'Controlled capture / room study',896,340,'instrument');shot.fills=[{type:'IMAGE',imageHash:'6cc396c49564555cb889c3810ef2f62e6a917086',scaleMode:'FIT'}];
keyValue(focus,'Method','Change light; hold camera and objects constant');button(focus,'Prepare controlled capture','prepareVision');
tag(catalogue,'INVESTIGATION INDEX');txt(catalogue,'Two disciplines. One evidence standard.','Manuscript');
for(const [id,title,copy,dest]of [['E06','Light & inference','Illustrated objects / C1 + CV-02','prepareVision'],['E01','Sampling & ambiguity','Known 2 Hz reference / S1-B + CV-03','prepareSignal']]){rule(catalogue);tag(catalogue,id);txt(catalogue,title,'Heading');txt(catalogue,copy,'Body','textSecondary');button(catalogue,'Explore '+id,dest,true);}
button(catalogue,'Read the room atlas','atlas',true);footer(lib.content);
async function prepare(signal=false,missing=false){const key=missing?'calibrationMissing':signal?'prepareSignal':'prepareVision',v=await view(key,'Experiments'),id=signal?'E01':'E06';
heading(v.content,id+' / METHOD REVISION 01 / PREPARATION',signal?'Know the input. Change the sampling.':'Change the light. Keep the comparison fair.',signal?'A known mathematical source makes sample-rate effects inspectable.':'A prepared lighting comparison keeps the question, equipment and evidence connected.');
const r=row(v.content,'Method folio & setup manifest',1376,32),method=auto(r,'Preparation protocol',944,'VERTICAL','surface',24,24),rail=auto(r,'Preparation manifest',400,'VERTICAL',null,0,24);
tag(method,'01 / THE QUESTION');txt(method,signal?'How much of a known signal survives sparse sampling?':'How does lighting change the visible evidence?','Manuscript');
protocol(method,'01','Hold the reference constant',signal?'Use the same 2 Hz, ±1 V reference over 0–1 s. Record this generated source rather than describing it as a hardware measurement.':'Keep the illustrated camera position, object arrangement and comparison scale fixed. Change one lighting condition at a time.');
protocol(method,'02',signal?'Compare 20 Hz with 3 Hz':'Compare frontal with side light',signal?'Read both conditions on identical axes. The sparse points alone do not identify an unknown continuous signal.':'Identify C1-CAM, C1-L1 and C1-L2 before recording. Keep source illustration and annotation distinguishable.');
protocol(method,'03','Carry the method into the notebook',signal?'Keep the source equation, time interval, sample rate and units beside the observation. State what the prepared comparison can establish.':'Keep exposure, gain, light position, input identity and annotation provenance attached to both conditions.');
if(signal){wave(method,20,1,896,240);txt(method,'SOURCE / REF-2HZ-v1 / y(t) = sin(4πt) V','Data','action');}
else{tag(method,'02 / READINESS GROUPS');instance(method,await figma.getNodeByIdAsync(missing?'2048:372':'2048:392'));txt(method,'Lighting bundle LGT-01 contains C1-L1 and C1-L2. Verify both panels and the target before a physical session.','Caption','textSecondary');}
manifest(rail,signal,missing);notice(rail,missing?'Target missing / preserve the setup':'Prepared example is complete',missing?'CAL-01 is absent. Keep the booking and all other choices; check-in stays blocked.':'This study supplies example readiness. Physical calibration and availability must be verified before an actual session.',missing?'danger':'success');
button(rail,missing?'Continue unavailable':signal?'Choose signal session':'Choose capture session',missing?null:signal?'bookingSignal':'bookingVision',false,missing);
if(missing){button(rail,'Use complete-kit example','prepareVision',true);button(rail,'Keep draft and review booking','bookingVision',true);}else{if(!signal)button(rail,'Inspect missing-target state','calibrationMissing',true);button(rail,'Choose another investigation','library',true);}
footer(v.content);return v;}
await prepare();await prepare(true);await prepare(false,true);
const sb=await view('bookingSignal','Bookings');
heading(sb.content,'E01 / KIT-S1-v1 / EXAMPLE RESERVATION','Reserve space for the signal study.','S1-B and CV-03 share the same session. The generated reference travels with the method.');
const sr=row(sb.content,'Signal session agenda & manifest',1376,32),agenda=auto(sr,'Bench agenda',944,'VERTICAL','surface',24,24),srail=auto(sr,'Signal booking manifest',400,'VERTICAL',null,0,24);
tag(agenda,'FRI 9 OCT 2026 / B-2042');txt(agenda,'11:00–12:00','Display');
for(const [time,title,state]of [['09:00–10:00','Another teaching session','Booked'],['10:00–11:00','Preparation interval','Available'],['11:00–12:00','Your complete signal setup','Selected'],['12:00–13:00','Another teaching session','Booked']]){const r=row(agenda,'Agenda / '+time,896,24),t=auto(r,'Interval',160,'VERTICAL',null,0,8),c=auto(r,'Session resources',712,'VERTICAL',state==='Selected'?'actionSoft':'surfaceSubtle',16,8);txt(t,time,'Data',state==='Selected'?'action':'textSecondary');txt(c,title,'Subheading');txt(c,'S1-B + CV-03 / '+state,'Label',state==='Selected'?'action':'textSecondary');}
manifest(srail,true);notice(srail,'Both resources align','B-2042 / E01 / 11:00–12:00. Prepared-source activity; no additional acquisition device is booked.','success');button(srail,'Review signal check-in','checkinSignal');button(srail,'Return to the method','prepareSignal',true);footer(sb.content);
async function checkin(signal=false,mismatch=false){const key=signal?'checkinSignal':mismatch?'wrongStation':'checkinVision',v=await view(key,'Lab Map'),booking=signal?'B-2042':'B-2041';
heading(v.content,'ARRIVAL / '+booking+' / '+(signal?'E01':'E06'),mismatch?'This station belongs to another setup.':'Match the place to the plan.',mismatch?'You entered CV-03. Your capture booking requires CV-02; the booking stays intact.':'Manual identity and the physical label should resolve to the same booked resource.');
const r=row(v.content,'Arrival identity & readiness',1376,32),passport=auto(r,'Station passport',944,'VERTICAL','surface',24,24),rail=auto(r,'Arrival decisions',400,'VERTICAL',null,0,24);
tag(passport,'BOOKED ID / '+(signal?'S1-B + CV-03':'C1 + CV-02'));txt(passport,signal?'S1-B':mismatch?'CV-03':'CV-02','Identity',mismatch?'danger':'action');
keyValue(passport,'Entered ID',signal?'S1-B / bench':mismatch?'CV-03 / computing':'CV-02 / computing');keyValue(passport,'Booking',booking+' / 11:00–12:00');keyValue(passport,'Source',signal?'REF-2HZ-v1 / generated':'Prepared lighting diagrams / L1 + L2');
const line=row(passport,'Identifier comparison',896,24);for(const [label,copy]of [['Booked',signal?'S1-B + CV-03':'C1 + CV-02'],['Located',signal?'S1 / signal bench':mismatch?'CMP / CV-03':'CMP / CV-02'],['Readiness',mismatch?'Identity mismatch':'Example complete']]){const p=auto(line,label,(896-48)/3,'VERTICAL','surfaceSubtle',16,8);tag(p,label);txt(p,copy,'Subheading');}
txt(passport,'Manual lookup is available beside scanning. This prototype presents prepared identity states; it does not read a QR code.','Caption','textSecondary');button(passport,'Inspect the 2D plan','plan',true);
manifest(rail,signal);notice(rail,mismatch?'Do not silently change the booking':'The prepared identity matches',mismatch?'Check the label and return to CV-02. Starting this session at CV-03 would break the selected setup.':'The same manifest remains visible at arrival. Check-in and attendance are example states in this prototype.',mismatch?'danger':'success');
button(rail,mismatch?'Start unavailable':signal?'Check in to signal study':'Check in to capture study',mismatch?null:signal?'signal20':'vision',false,mismatch);
if(mismatch)button(rail,'Use the booked CV-02 example','checkinVision',true);else if(!signal)button(rail,'Inspect wrong-station state','wrongStation',true);
button(rail,'Keep booking and review method',signal?'prepareSignal':'prepareVision',true);footer(v.content);return v;}
await checkin();await checkin(false,true);await checkin(true);
await wire();
return {createdNodeIds:[...new Set(created)],mutatedNodeIds:[...new Set(mutated)].filter(id=>!created.includes(id)),views:views.map(v=>({key:v.key,id:v.id,width:v.root.width,height:v.root.height})),links,scope:'Experiment discovery, versioned preparation, missing target, signal booking and arrival identity states.'};

