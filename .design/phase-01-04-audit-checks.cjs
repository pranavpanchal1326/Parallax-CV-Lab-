const fs = require('fs');
const path = require('path');
const root = process.cwd();
const g = JSON.parse(fs.readFileSync(path.join(root,'spatial/lab_geometry.json'),'utf8'));
const stats = JSON.parse(fs.readFileSync(path.join(root,'spatial/exports/blockout_stats.json'),'utf8'));
const glb = fs.readFileSync(path.join(root,'spatial/exports/lab_blockout.glb'));
const findings = [];
const zones = g.zones.map(z=>({id:z.id,area:Number((z.w*z.d).toFixed(2))}));
const overlap = (a,b)=>Math.max(0,Math.min(a.x+a.w,b.x+b.w)-Math.max(a.x,b.x))*Math.max(0,Math.min(a.y+a.d,b.y+b.d)-Math.max(a.y,b.y));
const zoneOverlaps=[];
for(let i=0;i<g.zones.length;i++)for(let j=i+1;j<g.zones.length;j++){const a=overlap(g.zones[i],g.zones[j]);if(a>1e-8)zoneOverlaps.push({a:g.zones[i].id,b:g.zones[j].id,area:a});}
const outside = g.furniture.filter(f=>f.x < -1e-8 || f.y < -1e-8 || f.x+f.w > g.meta.room.width+1e-8 || f.y+f.d > g.meta.room.depth+1e-8).map(f=>f.id);
const furnitureOverlaps=[];
for(let i=0;i<g.furniture.length;i++)for(let j=i+1;j<g.furniture.length;j++){const a=overlap(g.furniture[i],g.furniture[j]);if(a>1e-8)furnitureOverlaps.push({a:g.furniture[i].id,b:g.furniture[j].id,area:Number(a.toFixed(4))});}
let off=12, doc=null, chunks=[];
while(off+8<=glb.length){const len=glb.readUInt32LE(off),type=glb.readUInt32LE(off+4);chunks.push({type:type.toString(16),bytes:len});if(type===0x4e4f534a)doc=JSON.parse(glb.subarray(off+8,off+8+len).toString('utf8').trim());off+=8+len;}
let triangles=0;
for(const m of doc.meshes||[])for(const p of m.primitives||[])if((p.mode??4)===4)triangles+=(p.indices!==undefined?doc.accessors[p.indices].count:doc.accessors[p.attributes.POSITION].count)/3;
const sceneNodes=(doc.nodes||[]).filter(n=>n.mesh!==undefined).length;
const expectedIDs=g.furniture.map(f=>f.id);
const missingPrefixes=expectedIDs.filter(id=>!(doc.nodes||[]).some(n=>n.name===id || n.name?.startsWith(id+'_')));
const spine=g.zones.find(z=>z.id==='SPN');
const workstation=g.furniture.find(f=>f.id==='CV-04');
const requiredDepth=g.planning_rules.wheelchair_floor_space.value[1];
const explicitFloor=g.accessible_clear_floors?.find(f=>f.station===workstation.id);
const frontStart=explicitFloor?.y??workstation.y+workstation.d;
const frontEnd=explicitFloor?explicitFloor.y+explicitFloor.d:frontStart+requiredDepth;
const spineOverlap=explicitFloor?(overlap(explicitFloor,spine)>1e-8?Math.max(0,Math.min(frontEnd,spine.y+spine.d)-Math.max(frontStart,spine.y)):0):Math.max(0,Math.min(frontEnd,spine.y+spine.d)-Math.max(frontStart,spine.y));
const camera=g.furniture.find(f=>f.id==='C1-CAM');
const stage=g.furniture.find(f=>f.id==='C1-TB');
const cameraCentre=[camera.x+camera.w/2,camera.y+camera.d/2];
const stageCentre=[stage.x+stage.w/2,stage.y+stage.d/2];
const distance=(a,b)=>Math.hypot(a[0]-b[0],a[1]-b[1]);
const phase2=fs.readFileSync(path.join(root,'research/PHASE_02_RESEARCH_AND_EXPERIENCE.md'),'utf8');
const phase3=fs.readFileSync(path.join(root,'design/PHASE_03_CREATIVE_DIRECTION.md'),'utf8');
const phase4=fs.readFileSync(path.join(root,'spatial/PHASE_04_SPACE_AND_3D.md'),'utf8');
const output={
date:'2026-10-02',geometryRevision:g.meta.revision,
roomArea:g.meta.room.width*g.meta.room.depth,
zoneAreas:zones,zoneAreaTotal:Number(zones.reduce((s,z)=>s+z.area,0).toFixed(2)),
zoneOverlaps,furnitureOutsideRoom:outside,furnitureFootprintOverlaps:furnitureOverlaps,
glb:{magic:glb.subarray(0,4).toString(),version:glb.readUInt32LE(4),declaredBytes:glb.readUInt32LE(8),actualBytes:glb.length,chunkEndsAtFileEnd:off===glb.length,meshNodes:sceneNodes,triangles,missingFurnitureIDPrefixes:missingPrefixes,statsMatch:stats.glb_bytes===glb.length&&stats.triangles===triangles&&stats.mesh_objects===sceneNodes},
clearance:{spineDepth:spine.d,statedMinimum:g.planning_rules.spine_min.value,accessibleFloorFrontStart:frontStart,accessibleFloorFrontEnd:frontEnd,overlapWithSpine:Number(spineOverlap.toFixed(3)),remainingSpineAtOccupiedClearFloor:Number((spine.d-spineOverlap).toFixed(3)),note:'Geometric overlap only. This is not certification; simultaneous use and route policy need review.'},
capture:{cameraCentre,stageCentre,cameraToStageCentre:Number(distance(cameraCentre,stageCentre).toFixed(3)),cameraAxisToBackdrop:Number(distance(g.camera_axis.from,g.camera_axis.to).toFixed(3)),statedPlanningMinimum:g.planning_rules.camera_distance_min.value,note:'The 2.05 m backdrop distance is different from distance to the object stage.'},
documents:{phase2OpenGateCount:(phase2.match(/^- \[ \]/gm)||[]).length,phase3OpenGateCount:(phase3.match(/^- \[ \]/gm)||[]).length,phase4BrowserViewerPending:phase4.includes('Pending: load the GLB'),phase4ContainsOldMetrics:phase4.includes('1 224')&&phase4.includes('1 272')},
limitations:['Figma tools returned unknown-tool errors.','Direct browser could not access the documented file.','No live browser model viewer was available in this workspace.','Academic and physical-standard claims are not recertified by these calculations.']
};
fs.writeFileSync(path.join(root,'.design/phase-01-04-audit-evidence.json'),JSON.stringify(output,null,2)+'\n');
console.log(JSON.stringify(output,null,2));
