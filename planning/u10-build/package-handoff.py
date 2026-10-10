from pathlib import Path
import json, hashlib, zipfile, html
from html.parser import HTMLParser
from urllib.parse import urlparse, unquote
root=Path(__file__).resolve().parents[2]
out=root/'submission';zip_path=out/'PARALLAX-Source-Handoff.zip'
roots=['prototype','design','spatial','research','apps','planning','submission','.design']
root_files=['package.json','package-lock.json','README.md','PARALLAX_EXCELLENCE_BLUEPRINT.md']
def admitted(p):
 rel=p.relative_to(root).as_posix();parts=p.relative_to(root).parts
 if any(x in parts for x in ['.git','__pycache__']):return False
 if p.suffix in ['.pyc','.bak','.tmp'] or p.name.startswith('.env'):return False
 if 'node_modules' in parts and not rel.startswith('design/phase-08/node_modules/three/'):return False
 if rel.startswith(('planning/revisions/','planning/u10-clean-check','spatial/revisions/')):return False
 if rel.startswith('planning/u10-build/') and p.suffix not in ['.py','.mjs','.cjs','.ps1']:return False
 if rel.startswith('.design/') and p.name!='phase-01-04-audit-checks.cjs':return False
 if rel.startswith('submission/') and p.name in ['PARALLAX-Source-Handoff.zip','SOURCE_MANIFEST.json','package-receipt.json']:return False
 if p.name in ['Thumbs.db','.DS_Store']:return False
 return True
files=[]
for folder in roots:
 for p in (root/folder).rglob('*'):
  if p.is_file() and admitted(p):files.append(p)
for name in root_files:
 if (root/name).is_file():files.append(root/name)
files=sorted(set(files),key=lambda p:p.relative_to(root).as_posix())
rows=[{'path':p.relative_to(root).as_posix(),'bytes':p.stat().st_size,'sha256':hashlib.sha256(p.read_bytes()).hexdigest()} for p in files]
manifest={'revision':'U10-R3','date':'2026-10-05','files':rows,'scope':'Current source, built preview and reviewed artifacts. Excludes development dependencies, browser storage, credentials, model binaries and private preservation archives. The manifest and ZIP do not self-hash.'}
(out/'SOURCE_MANIFEST.json').write_text(json.dumps(manifest,indent=2),encoding='utf-8')
with zipfile.ZipFile(zip_path,'w',zipfile.ZIP_DEFLATED,compresslevel=6) as z:
 for p in files:z.write(p,p.relative_to(root).as_posix())
 z.write(out/'SOURCE_MANIFEST.json','submission/SOURCE_MANIFEST.json')
 with_manifest=len(files)+1
with zipfile.ZipFile(zip_path) as z:
 assert z.testzip() is None
receipt={'revision':'U10-R3','entries':with_manifest,'sourceBytes':sum(r['bytes'] for r in rows),'zipBytes':zip_path.stat().st_size,'zipSha256':hashlib.sha256(zip_path.read_bytes()).hexdigest(),'zipCrcCheck':'pass'}
(out/'package-receipt.json').write_text(json.dumps(receipt,indent=2),encoding='utf-8')
print(json.dumps(receipt))
