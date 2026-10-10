await figma.setCurrentPageAsync(await figma.getNodeByIdAsync("2089:42"));
const mutatedNodeIds=[];
for(const n of figma.currentPage.findAllWithCriteria({types:["TEXT"]})){
if(n.parent?.name==="Protocol marker"&&n.width>n.parent.width+.1){for(const seg of n.getStyledTextSegments(["fontName"]))await figma.loadFontAsync(seg.fontName);n.resize(n.parent.width,n.height);mutatedNodeIds.push(n.id);}
if(n.parent?.name==="Signal plot / volts against seconds"&&n.characters==="1 s"&&n.x+n.width>n.parent.width+.1){for(const seg of n.getStyledTextSegments(["fontName"]))await figma.loadFontAsync(seg.fontName);n.resize(n.parent.width-n.x,n.height);mutatedNodeIds.push(n.id);}
}
return {mutatedNodeIds,scope:"Bound protocol markers and plot-end labels inside their containers; no type or source-data changes."};
