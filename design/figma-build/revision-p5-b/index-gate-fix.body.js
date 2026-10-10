await figma.setCurrentPageAsync(await figma.getNodeByIdAsync("2034:910"));
const frame=await figma.getNodeByIdAsync("2034:911"),mutatedNodeIds=[];
for(const n of frame.findAllWithCriteria({types:["TEXT"]}).filter(n=>n.characters.includes("re-run the 24 checks"))){for(const seg of n.getStyledTextSegments(["fontName"]))await figma.loadFontAsync(seg.fontName);n.characters="Measure the actual room and services; rerun the current geometry checks and qualified reviews";mutatedNodeIds.push(n.id);}
return {mutatedNodeIds};
