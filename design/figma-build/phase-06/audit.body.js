const MAP={"atlas":"2089:43","plan":"2089:118","bookingVision":"2089:250","bookingConflict":"2089:402","vision":"2089:546","visionOffline":"2089:734","signal20":"2089:925","signal3":"2089:1040","notebookVision":"2089:1138","saveFailed":"2089:1269","cover":"2089:1400","library":"2089:1401","prepareVision":"2089:1402","prepareSignal":"2089:1403","calibrationMissing":"2089:1404","bookingSignal":"2089:1405","checkinVision":"2089:1406","wrongStation":"2089:1407","checkinSignal":"2089:1408","notebookSignal":"2089:1409","reviewVision":"2089:1410","reviewSignal":"2089:1411","submitFailedVision":"2089:1412","submitFailedSignal":"2089:1413","receiptVision":"2089:1414","receiptSignal":"2089:1415","returnVision":"2089:1416","returnMissing":"2089:1417"},PREVIEWS=[{"source":"2089:1402","copy":"2095:806","scale":0.6},{"source":"2089:1414","copy":"2095:936","scale":0.6}];
await figma.setCurrentPageAsync(await figma.getNodeByIdAsync("2089:42"));
const issues={overflow:[],unboundPaint:[],unstyledText:[],unresolvedInstances:[],brokenDestinations:[],crossPageDestinations:[],placeholders:[],topLevelOverlap:[],disabledActions:[]};
const ids=new Set(Object.values(MAP)),copyIds=new Set(PREVIEWS.map(p=>p.copy)),rootKey=Object.fromEntries(Object.entries(MAP).map(([k,id])=>[id,k])),frames=[],graph={},links=[],fonts=new Set(),images=[],counts={};
function previewNode(n){for(let p=n;p&&p.type!=="PAGE";p=p.parent)if(copyIds.has(p.id))return true;return false;}
let scaledOverrideCount=0;
for(const [key,id]of Object.entries(MAP)){const root=await figma.getNodeByIdAsync(id);frames.push({key,id,name:root.name,x:root.x,y:root.y,width:root.width,height:root.height});graph[key]=[];
for(const n of [root,...root.findAll(()=>true)]){counts[n.type]=(counts[n.type]||0)+1;if(n.placeholder)issues.placeholders.push(n.id);
if(n.visible&&n.parent&&n.parent.type!=="PAGE"&&n.type!=="VECTOR"&&n.type!=="LINE"&&n.rotation===0){const p=n.parent;if(n.x<-.1||n.y<-.1||n.x+n.width>p.width+.1||n.y+n.height>p.height+.1)issues.overflow.push({id:n.id,name:n.name,parent:p.id,x:n.x,y:n.y,w:n.width,h:n.height,pw:p.width,ph:p.height});}
if(n.type==="TEXT"){if(!n.textStyleId){if(previewNode(n))scaledOverrideCount++;else issues.unstyledText.push(n.id);}for(const seg of n.getStyledTextSegments(["fontName"]))fonts.add(seg.fontName.family);}
for(const prop of ["fills","strokes"])if(prop in n&&Array.isArray(n[prop]))for(const paint of n[prop]){if(paint.type==="SOLID"&&!paint.boundVariables?.color)issues.unboundPaint.push({id:n.id,prop});if(paint.type==="IMAGE")images.push({id:n.id,name:n.name,hash:paint.imageHash});}
if(n.type==="INSTANCE"&&!(await n.getMainComponentAsync()))issues.unresolvedInstances.push(n.id);
if("reactions"in n)for(const reaction of n.reactions||[])for(const action of reaction.actions||[])if(action.destinationId){const dest=await figma.getNodeByIdAsync(action.destinationId);if(!dest)issues.brokenDestinations.push(n.id);if(!ids.has(action.destinationId))issues.crossPageDestinations.push({id:n.id,to:action.destinationId});if(rootKey[action.destinationId])graph[key].push(rootKey[action.destinationId]);const label=n.type==="INSTANCE"?Object.values(n.componentProperties).find(p=>p.type==="TEXT"&&p.value!=="Working…")?.value:n.name;links.push({from:key,nodeId:n.id,label,to:rootKey[action.destinationId]});if(n.type==="INSTANCE"&&n.componentProperties.State?.value==="Disabled")issues.disabledActions.push(n.id);}
}}
for(let i=0;i<frames.length;i++)for(let j=i+1;j<frames.length;j++){const a=frames[i],b=frames[j];if(a.x<b.x+b.width-.1&&a.x+a.width>b.x+.1&&a.y<b.y+b.height-.1&&a.y+a.height>b.y+.1)issues.topLevelOverlap.push([a.key,b.key]);}
const expectedPaths=[
["cover","library","prepareVision","bookingVision","checkinVision","vision","notebookVision","reviewVision","receiptVision","returnVision","atlas"],
["cover","library","prepareSignal","bookingSignal","checkinSignal","signal20","signal3","notebookSignal","reviewSignal","receiptSignal","atlas"],
["prepareVision","calibrationMissing","prepareVision"],
["bookingVision","bookingConflict","bookingVision"],
["checkinVision","wrongStation","checkinVision"],
["vision","visionOffline","vision"],
["notebookVision","saveFailed","notebookVision"],
["reviewVision","submitFailedVision","receiptVision"],
["reviewSignal","submitFailedSignal","receiptSignal"],
["returnVision","returnMissing","returnVision"]];
const pathChecks=expectedPaths.map(path=>({path,missingEdges:path.slice(0,-1).map((from,i)=>({from,to:path[i+1]})).filter(e=>!graph[e.from].includes(e.to))}));
const reached=new Set(["cover"]),queue=["cover"];while(queue.length){const k=queue.shift();for(const to of graph[k])if(!reached.has(to)){reached.add(to);queue.push(to);}}
const previewChecks=[];for(const p of PREVIEWS){const src=await figma.getNodeByIdAsync(p.source),copy=await figma.getNodeByIdAsync(p.copy),st=src.findAllWithCriteria({types:["TEXT"]}),ct=copy.findAllWithCriteria({types:["TEXT"]}),mismatch=[];if(st.length!==ct.length)mismatch.push("count");for(let i=0;i<Math.min(st.length,ct.length);i++)if(st[i].characters!==ct[i].characters||Math.abs(ct[i].fontSize-st[i].fontSize*p.scale)>.05)mismatch.push(ct[i].id);previewChecks.push({...p,textCount:ct.length,mismatch});}
return {pageId:figma.currentPage.id,frames,issues,counts,fonts:[...fonts],images,scaledOverrideCount,previewChecks,linkCount:links.length,graph:Object.fromEntries(Object.entries(graph).map(([k,v])=>[k,[...new Set(v)]])),pathChecks,unreachable:Object.keys(MAP).filter(k=>!reached.has(k))};
