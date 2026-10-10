const fs=require('fs'),path=require('path');
const t=JSON.parse(fs.readFileSync(path.join(__dirname,'tokens.json'),'utf8'));
const body=fs.readFileSync(path.join(__dirname,'figma-body.js.txt'),'utf8');
const output='// Prepared additive Figma Plugin API build. NOT EXECUTED in this session.\n// use_figma: fileKey QaLr3W9rzW1WGhkDeHx9WF; skills figma-use,figma-generate-library\nconst TOKEN_SOURCE = '+JSON.stringify(t,null,2)+';\n'+body;
fs.writeFileSync(path.join(__dirname,'../figma-build/phase-05-foundations.js'),output);
console.log('Prepared Figma foundations + five component-family build.');
