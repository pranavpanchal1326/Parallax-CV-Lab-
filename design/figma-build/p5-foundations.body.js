// Native P5-A build. Semantic-token and component-grid patterns adapted from
// figma-generate-library helper scripts. Prior PH2 and PH3 assets stay intact.
const created=[],collectionsOut=[],variablesOut=[],stylesOut=[];
const fonts=[['DM Sans','Regular'],['DM Sans','Medium'],['DM Sans','Bold'],['Familjen Grotesk','Regular'],['Familjen Grotesk','SemiBold'],['JetBrains Mono','Regular'],['Newsreader','Italic']];
const available=await figma.listAvailableFontsAsync();
for(const [family,style] of fonts)if(!available.some(f=>f.fontName.family===family&&f.fontName.style===style))throw Error('Unavailable font '+family+' '+style);
await Promise.all(fonts.map(([family,style])=>figma.loadFontAsync({family,style})));
let page=figma.root.children.find(p=>p.name==='Phase 5 · Design System — P5-A');
if(page)throw Error('Phase 5 page exists. Inspect and resume; no duplicate build.');
page=figma.createPage();page.name='Phase 5 · Design System — P5-A';created.push(page.id);
await figma.setCurrentPageAsync(page);
const cs=await figma.variables.getLocalVariableCollectionsAsync(),vs=await figma.variables.getLocalVariablesAsync();
function coll(name){if(cs.some(c=>c.name===name))throw Error('Collection exists; recover before creating '+name);const c=figma.variables.createVariableCollection(name);c.renameMode(c.modes[0].modeId,'Value');collectionsOut.push(c.id);return c;}
const primitives=coll('PH5 · Primitives / P5-A'),semantic=coll('PH5 · Semantic / P5-A'),geometry=coll('PH5 · Geometry / P5-A'),timing=coll('PH5 · Motion / P5-A');
const rgb=h=>({r:parseInt(h.slice(1,3),16)/255,g:parseInt(h.slice(3,5),16)/255,b:parseInt(h.slice(5,7),16)/255});
function token(c,name,type,value,scopes,css){const v=figma.variables.createVariable(name,c,type);v.scopes=scopes;v.setValueForMode(c.modes[0].modeId,value);v.setVariableCodeSyntax('WEB','var(--'+css+')');variablesOut.push(v.id);return v;}
const pv={},sv={},gv={};
for(const [n,h]of Object.entries(TOKENS.primitives))pv[n]=token(primitives,'primitive/'+n,'COLOR',rgb(h),[],'primitive-'+n);
for(const [n,target]of Object.entries(TOKENS.semantic)){
 const scopes=/Text|^text|Secondary$/.test(n)?['TEXT_FILL']:n==='border'?['STROKE_COLOR']:['FRAME_FILL','SHAPE_FILL','TEXT_FILL','STROKE_COLOR'];
 sv[n]=token(semantic,'color/'+n,'COLOR',figma.variables.createVariableAlias(pv[target]),scopes,n.replace(/[A-Z]/g,m=>'-'+m.toLowerCase()));
}
for(const [n,value]of Object.entries(TOKENS.spacing)){
 const prior=vs.find(v=>v.variableCollectionId==='VariableCollectionId:2:26'&&v.name==='space/'+value);
 gv[n]=token(geometry,'spacing/'+n,'FLOAT',prior?figma.variables.createVariableAlias(prior):value,['GAP'],'space-'+n);
}
for(const [n,value]of Object.entries(TOKENS.radius))gv['radius/'+n]=token(geometry,'radius/'+n,'FLOAT',value,['CORNER_RADIUS'],'radius-'+n);
for(const [n,value]of Object.entries(TOKENS.motion))token(timing,'duration/'+n,'FLOAT',value,[],'motion-'+n);
const styleDefs=[['Display','Familjen Grotesk','Regular',64,68],['Heading','Familjen Grotesk','SemiBold',32,38],['Subheading','Familjen Grotesk','Regular',24,30],['Body','DM Sans','Regular',16,25],['Label','DM Sans','Medium',14,20],['Strong','DM Sans','Bold',16,25],['Caption','DM Sans','Regular',14,21],['Data','JetBrains Mono','Regular',12,18],['Editorial','Newsreader','Italic',48,52]];
for(const [name,family,style,size,line]of styleDefs){const st=figma.createTextStyle();st.name='PH5/'+name;st.fontName={family,style};st.fontSize=size;st.lineHeight={unit:'PIXELS',value:line};stylesOut.push({id:st.id,name:st.name});}
return {pageId:page.id,createdNodeIds:created,collectionIds:collectionsOut,variableIds:variablesOut,textStyles:stylesOut,reusedGeometry:'Eight PH2 spacing values are aliased; PH3 experimental modes are preserved',fontChecks:fonts.length};
