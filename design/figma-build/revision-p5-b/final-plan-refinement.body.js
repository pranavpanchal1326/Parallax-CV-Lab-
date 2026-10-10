await figma.setCurrentPageAsync(await figma.getNodeByIdAsync("2045:22"));
const plan=await figma.getNodeByIdAsync("2070:1527"),template=await figma.getNodeByIdAsync("2070:1536");
for(const seg of template.getStyledTextSegments(["fontName"])) await figma.loadFontAsync(seg.fontName);
const createdNodeIds=[],mutatedNodeIds=[];
function label(text,x,y,w){const n=template.clone();plan.appendChild(n);n.name="Plan identifier / "+text;n.characters=text;n.textAutoResize="HEIGHT";n.resize(w,18);n.x=x;n.y=y;createdNodeIds.push(n.id);return n;}
label("CV-04",11.6,222,46);label("CMP",8,92,90);label("STO",488,183,54);
label("CAM",551,137,39);label("L1",619,48,38);label("L2",619,223,38);
label("STG",707,134,40);label("FAC-1",19,488,95);label("COL-T",240,478,173);label("S1-B",521,501,218);
label("D1 · ENTRY",12,350,110);label("D2 · EXIT",638,350,110);
const focus=await figma.variables.getVariableByIdAsync("VariableID:2006:921");
for(const x of [0,757]){const n=figma.createRectangle();plan.appendChild(n);n.name=x===0?"D1 / west opening":"D2 / east opening";n.resize(3,76);n.x=x;n.y=315.4;n.fills=[figma.variables.setBoundVariableForPaint({type:"SOLID",color:{r:.1,g:.25,b:1}},'color',focus)];createdNodeIds.push(n.id);}
const handle=await figma.getNodeByIdAsync("2072:2349");handle.x=0;mutatedNodeIds.push(handle.id);
return {createdNodeIds,mutatedNodeIds,planId:plan.id,openingSource:"D1/W and D2/E from 4.15 to 5.15 m",sliderCopyBounds:{x:handle.x,y:handle.y,w:handle.width,h:handle.height,parentWidth:handle.parent.width}};

