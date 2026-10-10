const fs=require('fs'),assert=require('assert');
const g=JSON.parse(fs.readFileSync('spatial/lab_geometry.json','utf8'));
const overlap=(a,b)=>Math.max(0,Math.min(a.x+a.w,b.x+b.w)-Math.max(a.x,b.x))*Math.max(0,Math.min(a.y+a.d,b.y+b.d)-Math.max(a.y,b.y));
const spine=g.zones.find(x=>x.id==='SPN'),ac=g.accessible_clear_floors[0];
const failures=[],check=(name,pass)=>{if(!pass)failures.push(name);return {name,pass}};
const checks=[];
checks.push(check('Zone area equals 70 m²',Math.abs(g.zones.reduce((s,z)=>s+z.w*z.d,0)-70)<1e-8));
checks.push(check('Spine is at least 1.5 m',spine.d>=1.5));
checks.push(check('Accessible floor is 1.2 × 0.9 m',ac.w>=1.2&&ac.d>=.9));
checks.push(check('Accessible floor does not overlap spine',overlap(ac,spine)<1e-8));
checks.push(check('Accessible floor does not overlap furniture',g.furniture.every(f=>overlap(ac,f)<1e-8)));
checks.push(check('Furniture stays outside spine',g.furniture.every(f=>overlap(spine,f)<1e-8)));
checks.push(check('Furniture stays in room',g.furniture.every(f=>f.x>=0&&f.y>=0&&f.x+f.w<=10+1e-8&&f.y+f.d<=7+1e-8)));
checks.push(check('Furniture footprints do not overlap',g.furniture.every((f,i)=>g.furniture.slice(i+1).every(b=>overlap(f,b)<1e-8))));
const cam=g.furniture.find(f=>f.id==='C1-CAM'),stage=g.furniture.find(f=>f.id==='C1-TB');
const distance=Math.hypot(cam.x+cam.w/2-stage.x-stage.w/2,cam.y+cam.d/2-stage.y-stage.d/2);
checks.push(check('Camera-to-subject meets 2 m planning rule',distance>=g.planning_rules.camera_distance_min.value));
checks.push(check('Camera axis matches actual subject centre',Math.abs(g.camera_axis.to[0]-stage.x-stage.w/2)<1e-8&&Math.abs(g.camera_axis.from[0]-cam.x-cam.w/2)<1e-8));
const exportStats=[];
for(const name of ['lab_blockout','lab_studio']){
 const b=fs.readFileSync('spatial/exports/'+name+'.glb');let offset=12,doc;while(offset+8<=b.length){const length=b.readUInt32LE(offset);if(b.readUInt32LE(offset+4)===0x4e4f534a)doc=JSON.parse(b.subarray(offset+8,offset+8+length).toString());offset+=8+length;}
 let triangles=0;for(const m of doc.meshes)for(const p of m.primitives)if((p.mode??4)===4)triangles+=(p.indices!==undefined?doc.accessors[p.indices].count:doc.accessors[p.attributes.POSITION].count)/3;
 exportStats.push({name,bytes:b.length,triangles,meshNodes:doc.nodes.filter(n=>n.mesh!==undefined).length});
 checks.push(check(name+' GLB header / chunks valid',b.subarray(0,4).toString()==='glTF'&&b.readUInt32LE(4)===2&&b.readUInt32LE(8)===b.length&&offset===b.length));
 checks.push(check(name+' under 5 MB / 150k triangle budget',b.length<=5*1024*1024&&triangles<=150000));
 checks.push(check(name+' furniture IDs preserved',g.furniture.every(f=>doc.nodes.some(n=>n.name===f.id||n.name?.startsWith(f.id+'_')))));
}
const result={revision:g.meta.revision,checks,passed:checks.filter(c=>c.pass).length,total:checks.length,cameraToSubject:distance,accessibleSpineOverlap:overlap(ac,spine),exports:exportStats,scope:'Geometric fit and GLB structure only; not code certification, usability testing, photometry, or hardware validation.'};
fs.writeFileSync('spatial/exports/upgrade-validation.json',JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify(result,null,2));if(failures.length)process.exitCode=1;
