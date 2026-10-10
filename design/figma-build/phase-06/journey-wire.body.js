
const ROUTES={
atlas:{'Prepare this investigation':'prepareVision','Use the 2D asset list':'plan'},
plan:{'Prepare a compatible setup':'prepareVision','Return to the room view':'atlas'},
bookingVision:{'Review readiness':'checkinVision','Inspect conflict example':'bookingConflict'},
bookingConflict:{'Use 11:00–12:00':'bookingVision'},
vision:{'Compare conditions':'notebookVision','Inspect disconnect example':'visionOffline'},
visionOffline:{'Use prepared condition':'notebookVision','Retry device example':'vision'},
signal20:{'Compare with 3 Hz':'signal3','Return to the lab atlas':'atlas'},
signal3:{'Restore the 20 Hz view':'signal20','Return to the lab atlas':'atlas'},
notebookVision:{'Save revision example':'reviewVision','Return to the comparison':'vision'},
saveFailed:{'Retry saving example':'notebookVision','Return to the comparison':'vision'}
};
for(const [key,routes]of Object.entries(ROUTES)){const root=await figma.getNodeByIdAsync(MAP[key]);for(const n of root.findAllWithCriteria({types:['INSTANCE']})){const props=n.componentProperties;const lk=Object.keys(props).find(k=>k.startsWith('Label#'));if(!lk)continue;const old=props[lk].value,target=routes[old];if(target){for(const t of n.findAllWithCriteria({types:['TEXT']}))for(const seg of t.getStyledTextSegments(['fontName']))await figma.loadFontAsync(seg.fontName);if(key==='notebookVision'&&old==='Save revision example'){n.setProperties({[lk]:'Review prepared revision'});n.name='Action / Review prepared revision';}links.push({id:n.id,target});mutated.push(n.id);}}
}
const library=await figma.getNodeByIdAsync(MAP.library);for(const n of library.findAllWithCriteria({types:['INSTANCE']})){const label=Object.values(n.componentProperties).find(p=>p.type==='TEXT'&&p.value==='Inspect setup requirements');if(label)links.push({id:n.id,target:'prepareVision'});}
const notebook=await figma.getNodeByIdAsync(MAP.notebookVision),nrail=notebook.findOne(n=>n.name==='Revision & provenance margin');if(!nrail)throw Error('Notebook margin required');button(nrail,'Inspect save interruption','saveFailed',true);
for(const key of ['signal20','signal3']){const root=await figma.getNodeByIdAsync(MAP[key]),rail=root.findOne(n=>n.name==='Generated-source parameters');button(rail,'Record the signal observation','notebookSignal',true);}
for(const key of ['prepareSignal','bookingSignal','checkinSignal']){const root=await figma.getNodeByIdAsync(MAP[key]);for(const t of root.findAllWithCriteria({types:['TEXT']}).filter(t=>t.characters==='GEN-2HZ')){for(const seg of t.getStyledTextSegments(['fontName']))await figma.loadFontAsync(seg.fontName);t.characters='REF-2HZ-v1';mutated.push(t.id);}}
for(const key of ['vision','visionOffline']){const root=await figma.getNodeByIdAsync(MAP[key]);for(const t of root.findAllWithCriteria({types:['TEXT']}).filter(t=>t.characters.includes('SESSION S-0917'))){for(const seg of t.getStyledTextSegments(['fontName']))await figma.loadFontAsync(seg.fontName);t.characters=t.characters.replace('SESSION S-0917','SESSION EX-S-2041');mutated.push(t.id);}}
for(const key of ['notebookVision','saveFailed']){const root=await figma.getNodeByIdAsync(MAP[key]);for(const t of root.findAllWithCriteria({types:['TEXT']})){if(t.characters==='Example C1 / C2'){for(const seg of t.getStyledTextSegments(['fontName']))await figma.loadFontAsync(seg.fontName);t.characters='ILL-L1-v1 / ILL-L2-v1';mutated.push(t.id);}}}
for(const [key,id]of Object.entries(MAP)){if(key==='cover')continue;const root=await figma.getNodeByIdAsync(id),signal=/signal/i.test(key);
for(const n of root.findAll(c=>c.name?.startsWith('Destination / '))){const label=n.name.slice(14),target=label==='My Lab'||label==='Experiments'?'library':label==='Lab Map'?'atlas':label==='Bookings'?(signal?'bookingSignal':'bookingVision'):label==='Notebook'?(signal?'notebookSignal':'notebookVision'):null;if(!target||MAP[target]===id)continue;links.push({id:n.id,target});}
}
for(const l of links){const n=await figma.getNodeByIdAsync(l.id);await n.setReactionsAsync([{trigger:{type:'ON_CLICK'},actions:[{type:'NODE',destinationId:MAP[l.target],navigation:'NAVIGATE',transition:null,resetScrollPosition:true}]}]);mutated.push(n.id);}
bindArtwork([notebook]);
return {createdNodeIds:[...new Set(created)],mutatedNodeIds:[...new Set(mutated)].filter(id=>!created.includes(id)),links,scope:'All Phase6 destinations stay in Phase6; session, source and evidence identities aligned.'};

