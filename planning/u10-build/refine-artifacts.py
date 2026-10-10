from pathlib import Path
import json
p=Path('planning/u10-build/build-deck.mjs')
s=p.read_text(encoding='utf-8').replace("finalPath:out+'/PARALLAX-Presentation.pptx'", "finalPath:out+'/PARALLAX-Presentation-Final.pptx'")
p.write_text(s,encoding='utf-8')
p=Path('submission/source/presentation-content.json')
d=json.loads(p.read_text(encoding='utf-8'))
for i,name in [(8,'E01-3Hz.png'),(9,'E06-side.png'),(10,'fault-8.png'),(13,'mobile-viewport.png')]:
    d[i]['image']='apps/lab-web/evidence/u09-final/'+name
p.write_text(json.dumps(d,indent=2,ensure_ascii=False),encoding='utf-8')
