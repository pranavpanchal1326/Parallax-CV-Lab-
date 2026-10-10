await figma.setCurrentPageAsync(await figma.getNodeByIdAsync("2034:910"));
const frame=await figma.getNodeByIdAsync("2034:911"),texts=frame.findAllWithCriteria({types:["TEXT"]}),mutatedNodeIds=[];
for(const [srcText,dstText]of [["04","05"],["Space & 3D foundation","Design system"]]){const src=texts.find(n=>n.characters===srcText),dst=texts.find(n=>n.characters===dstText);if(src&&dst){for(const seg of dst.getStyledTextSegments(["fontName"]))await figma.loadFontAsync(seg.fontName);dst.fills=src.fills;mutatedNodeIds.push(dst.id);}}
const src=texts.find(n=>n.characters==="DONE FOR CONCEPT ENVELOPE"),dst=texts.find(n=>n.characters==="BUILT");
if(src&&dst){for(const seg of dst.getStyledTextSegments(["fontName"]))await figma.loadFontAsync(seg.fontName);dst.fills=src.fills;mutatedNodeIds.push(dst.id);if("fills" in dst.parent){dst.parent.fills=src.parent.fills;dst.parent.strokes=src.parent.strokes;mutatedNodeIds.push(dst.parent.id);}}
return {mutatedNodeIds,scope:"Phase5 built-state hierarchy",indexId:frame.id};
