from pathlib import Path
import zipfile,json,hashlib
root=Path(__file__).resolve().parents[2]
destination=root/'planning/u10-clean-check-20261004'
assert destination.resolve().is_relative_to(root.resolve())
assert not destination.exists(),'Use a fresh destination; never overwrite an existing assessor copy.'
with zipfile.ZipFile(root/'submission/PARALLAX-Source-Handoff.zip') as z:
 for name in z.namelist():assert (destination/name).resolve().is_relative_to(destination.resolve())
 z.extractall(destination)
manifest=json.loads((destination/'submission/SOURCE_MANIFEST.json').read_text())
for row in manifest['files']:
 p=destination/row['path'];assert p.stat().st_size==row['bytes'];assert hashlib.sha256(p.read_bytes()).hexdigest()==row['sha256'],row['path']
(root/'submission/clean-verification.json').write_text(json.dumps({'date':'2026-10-04','manifestEntriesVerified':len(manifest['files']),'manifestSha256':'pass','sourceExtraction':'fresh folder','checks':[],'scope':'Prebuilt source hash verification; build/test and browser launch follow.'},indent=2))
print('Fresh extraction; '+str(len(manifest['files']))+' source/artifact hashes verified.')
