const fs=require('fs');
const p='spatial/lab_geometry.json';
const g=JSON.parse(fs.readFileSync(p,'utf8'));
g.meta.revision='P4-D';
const f=id=>g.furniture.find(x=>x.id===id);
Object.assign(f('CV-04'),{x:0.1,y:2.35,w:0.7,d:1.4,seat:'E',note:'Rotated accessible workstation; east approach and dedicated clear floor outside circulation spine. Concept geometry pending qualified review.'});
g.accessible_clear_floors=[{id:'AC-CV04',station:'CV-04',x:0.8,y:2.6,w:1.2,d:0.9}];
Object.assign(f('C1-CAM'),{x:7.2});
Object.assign(f('C1-TB'),{x:9.25,w:0.6});
g.camera_axis={from:[7.5,1.9],to:[9.55,1.9],target:'object-stage centre',backdrop:[9.85,1.9],note:'2.05 m camera-to-subject planning distance. Lens and field of view still require physical calibration.'};
Object.assign(f('COL-T'),{x:3.1,w:2.4});
for(const id of ['PW-B','NW-B']){const s=g.services.find(x=>x.id===id);s.x=0.45;s.y=2.85;s.mount='under workstation; flush floor box';}
fs.writeFileSync(p,JSON.stringify(g,null,2)+'\n');
