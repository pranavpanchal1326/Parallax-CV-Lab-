await figma.setCurrentPageAsync(await figma.getNodeByIdAsync("2045:22"));
const createdNodeIds=[],mutatedNodeIds=[],rows=[708,828,828,228,588,588],views=[];
for(const [id,scale]of [["2065:2662",1],["2065:2812",1],["2072:1675",.6]]){const root=await figma.getNodeByIdAsync(id),canvas=root.findOne(n=>n.name==="Resource-linked time canvas");
const proto=canvas.children.find(n=>n.name==="Other booking");
for(const t of proto.findAllWithCriteria({types:["TEXT"]}))for(const seg of t.getStyledTextSegments(["fontName"]))await figma.loadFontAsync(seg.fontName);
const entries=[];
for(let row=0;row<6;row++){const y=(56+row*88)*scale;let n=canvas.children.find(n=>n.name==="Other booking"&&Math.abs(n.y-y)<.1);if(!n){n=proto.clone();canvas.appendChild(n);n.y=y;createdNodeIds.push(n.id,...n.findAll(()=>true).map(x=>x.id));}n.x=rows[row]*scale;mutatedNodeIds.push(n.id);entries.push({row,x:n.x/scale,y:n.y/scale,width:n.width/scale});}
views.push({id,otherBookings:entries});}
return {createdNodeIds,mutatedNodeIds,views,consistent:true};
