// Appended after helpers.js for P31 mobile screens (390×844). Tab bar set: 2122:619.
const TABS={Student:{Today:'2122:481',Scan:'2122:504',Report:'2122:527',Bookings:'2122:550'},Technician:{Queue:'2122:573',Scan:'2122:596'}};
async function MV(key,title,x,y,role,active,context,ctxKind='actionSoft'){if(page.children.some(n=>n.name.startsWith('P7-A / '+key+' · ')))throw Error('exists '+key);
 const root=figma.createAutoLayout('VERTICAL');C.push(root.id);root.name='P7-A / '+key+' · '+title;root.fills=P('canvas');root.itemSpacing=0;page.appendChild(root);root.resize(390,844);root.primaryAxisSizingMode='FIXED';root.counterAxisSizingMode='FIXED';root.clipsContent=true;root.x=x;root.y=y;
 const sb=A(root,'Status bar','fill','H','surface',0,0);sb.paddingLeft=sb.paddingRight=20;sb.paddingTop=12;sb.paddingBottom=8;sb.primaryAxisAlignItems='SPACE_BETWEEN';T(sb,'10:05','Label','text','hug');T(sb,'PARALLAX · Lab companion','Data','textSecondary','hug');
 if(context){const cb=A(root,'Persistent context','fill','H',ctxKind,0,8);cb.paddingLeft=cb.paddingRight=16;cb.paddingTop=cb.paddingBottom=10;cb.counterAxisAlignItems='CENTER';T(cb,context,'Data',ctxKind==='dangerSurface'?'danger':ctxKind==='warningSurface'?'warning':'action','fill');}
 const body=A(root,'Screen content','fill','V',null,16,16);body.layoutGrow=1;body.layoutSizingVertical='FILL';
 const tab=(await figma.getNodeByIdAsync(TABS[role][active])).createInstance();root.appendChild(tab);C.push(tab.id);tab.layoutSizingHorizontal='FILL';
 return {root,body};}
function MB(p,label,target,style='Primary',state='Default'){const b=B(p,label,target,style,state);b.layoutSizingHorizontal='FILL';return b;}
function CARD(p,name,bg='surface',pd=16,gap=10){const c=A(p,name,'fill','V',bg,pd,gap);c.setBoundVariable('cornerRadius',gv['radius/dialog']);return c;}
