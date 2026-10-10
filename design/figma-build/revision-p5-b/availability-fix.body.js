await figma.setCurrentPageAsync(await figma.getNodeByIdAsync("2045:22"));
const createdNodeIds=[],mutatedNodeIds=[];
const bar=await figma.getNodeByIdAsync("2065:2882"),label=await figma.getNodeByIdAsync("2065:2883");
for(const seg of label.getStyledTextSegments(["fontName"]))await figma.loadFontAsync(seg.fontName);
bar.resize(120,86);label.resize(96,20);mutatedNodeIds.push(bar.id,label.id);
const pairs=[["2065:2662",1],["2065:2812",1],["2072:1675",.6]];
for(const [id,scale]of pairs){const root=await figma.getNodeByIdAsync(id),canvas=root.findOne(n=>n.name==="Resource-linked time canvas");
const c1Booking=canvas.children.find(n=>n.name==="Other booking"&&Math.abs(n.y-496*scale)<.1);if(c1Booking){c1Booking.x=588*scale;mutatedNodeIds.push(c1Booking.id);}
if(id!=="2065:2812"){for(const src of [bar,label]){const n=src.clone();canvas.appendChild(n);if(scale!==1)n.rescale(scale);n.x=src.x*scale;n.y=src.y*scale;createdNodeIds.push(n.id,...("children"in n?n.findAll(()=>true).map(x=>x.id):[]));}}
}
return {createdNodeIds,mutatedNodeIds,fixture:{restricted:"C1-CAM 10:00–11:00",compatible:"11:00–12:00",captureZoneOtherBooking:"12:00–13:00"},views:["2065:2662","2065:2812","2072:1675"]};
