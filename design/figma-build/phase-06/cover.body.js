
const cover=await figma.getNodeByIdAsync(MAP.cover);if(cover.children.length)throw Error('Cover already composed');cover.fills=paint('instrument');spacing(cover,80,48);mutated.push(cover.id);
tag(cover,'PARALLAX / STUDENT JOURNEY / P6-A',true);
txt(cover,'A question.\nA traceable conclusion.','Identity','instrumentText');
txt(cover,'Preparation, place and evidence belong to one journey.','Manuscript','trace');
const intro=row(cover,'The room & the student journey',1760,32),room=auto(intro,'Physical anchor',960,'VERTICAL',null,0,16),story=auto(intro,'Student journey guide',768,'VERTICAL',null,0,24);
const render=box(room,'Current P4-D room / content asset',960,667,'instrument');render.fills=[{type:'IMAGE',imageHash:'6cc396c49564555cb889c3810ef2f62e6a917086',scaleMode:'FIT'}];txt(room,'70 m² / ONE GEOMETRY SOURCE / TWO INVESTIGATION PATHS','Data','instrumentSecondary');
tag(story,'01 / CHOOSE A QUESTION',true);txt(story,'Light or sampling. A method before a measurement.','Heading','instrumentText');
tag(story,'02 / MATCH THE SETUP',true);txt(story,'The booking manifest survives preparation and arrival.','Body','instrumentSecondary');
tag(story,'03 / REASON FROM THE SOURCE',true);txt(story,'An image stage, matched plots and an evidence margin keep the claim inspectable.','Body','instrumentSecondary');
tag(story,'04 / NAME THE REVISION',true);txt(story,'Review the copy. Keep the receipt. Close the kit return.','Body','instrumentSecondary');
button(story,'Open the experiment library','library');button(story,'Start the signal preparation','prepareSignal',true);
rule(cover,'instrumentRaised');
txt(cover,'The interface follows the work.','Heading','instrumentText');
const previewRow=row(cover,'Preparation and confirmation / editable previews',1760,32),previewCopies=[];
for(const [key,label]of [['prepareVision','METHOD / THE SETUP STAYS WITH THE QUESTION'],['receiptVision','RECEIPT / THE REVISION STAYS WITH THE EVIDENCE']]){const col=auto(previewRow,'Preview / '+key,864,'VERTICAL',null,0,16);txt(col,label,'Data','trace');const src=await figma.getNodeByIdAsync(MAP[key]),n=src.clone();col.appendChild(n);n.rescale(.6);n.name='Editable 0.6x preview / '+key;created.push(n.id,...n.findAll(()=>true).map(c=>c.id));previewCopies.push({source:src.id,copy:n.id,scale:.6});button(col,'Open the full '+(key==='prepareVision'?'method':'receipt'),key,true);}
rule(cover,'instrumentRaised');
const notes=row(cover,'Preservation & prototype scope',1760,32);const preserved=auto(notes,'Preserved foundation',864,'VERTICAL',null,0,12),scope=auto(notes,'Honest prototype scope',864,'VERTICAL',null,0,12);
txt(preserved,'Built on the existing Atlas+ language.','Subheading','instrumentText');txt(preserved,'Earlier research, creative studies, spatial boards and the 40-family / 87-variant library are retained. Phase6 uses its own native copies and destinations.','Caption','instrumentSecondary');
txt(scope,'Linked student journeys, prepared states.','Subheading','instrumentText');txt(scope,'This Figma prototype illustrates booking, attendance, evidence submission and return contracts. Hardware, institutional records and participant validation remain separate work.','Caption','instrumentSecondary');
cover.y=Math.min(-3000,-cover.height-300);cover.placeholder=false;views.push({key:'cover',id:cover.id,root:cover});await wire();
return {createdNodeIds:[...new Set(created)],mutatedNodeIds:[...new Set(mutated)].filter(id=>!created.includes(id)),cover:{id:cover.id,x:cover.x,y:cover.y,width:cover.width,height:cover.height},previewCopies,links};

