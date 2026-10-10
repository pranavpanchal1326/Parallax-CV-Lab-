// P7-A composition helpers. Prepended to each Phase 7 body sent through use_figma.
// Reuses PH5 semantic/geometry variables, PH5/PH5B text styles, C03 actions and C06 status labels.
const page=await figma.getNodeByIdAsync('2108:62');await figma.setCurrentPageAsync(page);
const VARS=await figma.variables.getLocalVariablesAsync(),sv={},gv={};
for(const v of VARS){if(v.variableCollectionId==='VariableCollectionId:2045:24')sv[v.name.slice(6)]=v;if(v.variableCollectionId==='VariableCollectionId:2045:25')gv[v.name]=v;}
const SP={4:'xs',8:'sm',12:'md',16:'lg',24:'xl',32:'2xl',48:'3xl',64:'4xl'};
const ST={};for(const s of await figma.getLocalTextStylesAsync()){if(s.name.startsWith('PH5B/'))ST[s.name.slice(5)]=s;else if(s.name.startsWith('PH5/'))ST[s.name.slice(4)]=s;}
await Promise.all(Object.values(ST).map(s=>figma.loadFontAsync(s.fontName)));
const C=[],M=[];
const P=r=>{if(!sv[r])throw Error('role '+r);return [figma.variables.setBoundVariableForPaint({type:'SOLID',color:{r:0,g:0,b:0}},'color',sv[r])];};
function pad(n,p,g){n.paddingTop=n.paddingBottom=n.paddingLeft=n.paddingRight=p;n.itemSpacing=g;if(SP[p])for(const k of['paddingTop','paddingBottom','paddingLeft','paddingRight'])n.setBoundVariable(k,gv['spacing/'+SP[p]]);if(SP[g])n.setBoundVariable('itemSpacing',gv['spacing/'+SP[g]]);}
// A: auto-layout container. w: number (fixed) | 'fill' | undefined (hug)
function A(parent,name,w,dir='V',bg=null,p=0,g=12){const n=figma.createAutoLayout(dir==='V'?'VERTICAL':'HORIZONTAL');C.push(n.id);n.name=name;n.fills=bg?P(bg):[];pad(n,p,g);parent.appendChild(n);if(w==='fill')n.layoutSizingHorizontal='FILL';else if(typeof w==='number'){n.resize(w,Math.max(1,n.height));n.layoutSizingHorizontal='FIXED';}n.layoutSizingVertical='HUG';return n;}
function T(parent,copy,role='Body',color='text',w='fill'){const s=ST[role];if(!s)throw Error('style '+role);const n=figma.createText();C.push(n.id);n.fontName=s.fontName;n.textStyleId=s.id;n.characters=copy;n.fills=P(color);n.name=role+' / '+copy.slice(0,40);parent.appendChild(n);if(w==='hug')n.textAutoResize='WIDTH_AND_HEIGHT';else if(w==='fill'){n.textAutoResize='HEIGHT';n.layoutSizingHorizontal='FILL';}else{n.textAutoResize='HEIGHT';n.resize(w,Math.max(1,n.height));}return n;}
function R(parent,color='border'){const n=figma.createRectangle();C.push(n.id);n.name='Divider';n.fills=P(color);parent.appendChild(n);n.layoutSizingHorizontal='FILL';n.resize(n.width,1);return n;}
function BOX(parent,name,w,h,bg='surfaceSubtle'){const n=figma.createFrame();C.push(n.id);n.name=name;n.resize(w,h);n.fills=bg?P(bg):[];parent.appendChild(n);return n;}
function TAG(p,copy,dark=false){return T(p,copy,'Data',dark?'instrumentSecondary':'action');}
function KV(p,k,v,kw=150,dark=false){const r=A(p,'Row / '+k,'fill','H',null,0,12);T(r,k,'Caption',dark?'instrumentSecondary':'textSecondary',kw);T(r,v,'Label',dark?'instrumentText':'text','fill');return r;}
const ACTS=(await figma.getNodeByIdAsync('2045:124')).children;
const STATUS={};for(const c of(await figma.getNodeByIdAsync('2045:133')).children)STATUS[{'State=Ready':'ready','State=Restricted':'restricted','State=Review':'review','State=Unknown':'unknown'}[c.name]]=c;
// B: C03 action instance. target = view key; wiring pass resolves "→ KEY" names to roots named "P7-A / KEY · …"
function B(p,label,target=null,style='Primary',state='Default'){const c=ACTS.find(c=>c.name==='Style='+style+', State='+state);const i=c.createInstance();p.appendChild(i);C.push(i.id);const key=Object.keys(c.parent.componentPropertyDefinitions).find(k=>k.startsWith('Label#'));i.setProperties({[key]:label});i.name='Action / '+label+(target&&state!=='Disabled'?' → '+target:'');return i;}
function S(p,label,kind='unknown'){const i=STATUS[kind].createInstance();p.appendChild(i);C.push(i.id);const t=i.findOne(n=>n.type==='TEXT');t.characters=label;i.name='Status / '+label;try{i.layoutSizingHorizontal='HUG';}catch(e){}return i;}
function NOTE(p,title,body,kind='warning'){const c=A(p,'Notice / '+kind,'fill','V',kind==='danger'?'dangerSurface':kind==='success'?'successSurface':kind==='info'?'actionSoft':'warningSurface',16,8);T(c,title,'Strong',kind==='info'?'action':kind);T(c,body,'Caption',kind==='info'?'text':kind);return c;}
function SVG(p,markup,name){const n=figma.createNodeFromSvg(markup);C.push(n.id);n.name=name;p.appendChild(n);return n;}
const NAV={Faculty:{Teaching:'2108:63',Attendance:'2108:90',Assessment:'2108:117'},Technician:{Queue:'2108:144',Assets:'2108:171',Calibration:'2108:198'}};
// V: desktop root frame with staff navigation and padded content column
async function V(key,title,x,y,role,active,w=1440){if(page.children.some(n=>n.name.startsWith('P7-A / '+key+' · ')))throw Error('exists '+key);const root=figma.createAutoLayout('VERTICAL');C.push(root.id);root.name='P7-A / '+key+' · '+title;root.fills=P('canvas');root.itemSpacing=0;page.appendChild(root);root.resize(w,100);root.layoutSizingHorizontal='FIXED';root.layoutSizingVertical='HUG';root.x=x;root.y=y;if(role){const nav=(await figma.getNodeByIdAsync(NAV[role][active])).createInstance();root.appendChild(nav);C.push(nav.id);}const content=A(root,'Page content',w,'V',null,32,32);return {root,content};}
function HEAD(p,label,title,body,bodyW=900){TAG(p,label);T(p,title,'Page','text');if(body)T(p,body,'Body','textSecondary',bodyW);}
function COLS(p,mainW=944,sideW=400){const r=A(p,'Columns','fill','H',null,0,32);const main=A(r,'Main column',mainW,'V','surface',24,20);const side=A(r,'Side column',sideW,'V',null,0,16);return {main,side};}
function FOOT(p,copy='Prepared study / Example staff, inventory and evidence states. No institutional record, message or device is changed.'){R(p);T(p,copy,'Data','textSecondary');}
// TABLE: header + rows, weights per column
function TABLE(p,headers,rows,weights,dark=false){const t=A(p,'Data table','fill','V',null,0,0);const tw=weights.reduce((a,b)=>a+b,0);[headers,...rows].forEach((vals,ri)=>{const r=A(t,ri?'Row '+ri:'Header row','fill','H',ri===0?(dark?'instrumentRaised':'surfaceSubtle'):null,0,0);vals.forEach((v,i)=>{const cell=A(r,'Cell '+i,Math.floor(t.width*weights[i]/tw),'V',null,8,4);if(typeof v==='object'&&v.status){S(cell,v.status,v.kind);}else T(cell,String(v),ri===0?'Label':'Caption',dark?'instrumentText':(ri===0?'text':'text'),'fill');});if(ri>0)R(t,dark?'instrumentSecondary':'surfaceSubtle');});return t;}
