await figma.setCurrentPageAsync(await figma.getNodeByIdAsync("2019:902"));
const board=await figma.getNodeByIdAsync("2022:976"),targets=board.findAllWithCriteria({types:["TEXT"]}).filter(n=>n.characters.includes("12 computed fit checks")),mutatedNodeIds=[];
for(const n of targets){for(const seg of n.getStyledTextSegments(["fontName"]))await figma.loadFontAsync(seg.fontName);n.characters="16 geometry and export checks · P4-D source";mutatedNodeIds.push(n.id);}
return {mutatedNodeIds};
