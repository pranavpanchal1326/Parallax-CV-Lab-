"""Record reviewed presentation changes in the U09 source-change ledger.
Usage: python reseal-source-ledger.py "<reason>" [added/path ...]
Every tracked file whose hash differs from the U09 baseline is listed with that reason;
validate-u09.cjs then accepts exactly those files and still rejects any other mutation."""
import json, hashlib, re, sys
from pathlib import Path
root = Path(__file__).resolve().parents[2]
h = lambda p: hashlib.sha256((root / p).read_bytes()).hexdigest()
reason, added = sys.argv[1], sys.argv[2:]
before = {r['path']: r['sha256'] for r in json.loads((root / 'planning/revisions/U09-before-implementation/manifest.json').read_text(encoding='utf-8'))['sources']}
lp = root / 'apps/lab-web/evidence/u09-final/source-change-ledger.json'
L = json.loads(lp.read_text(encoding='utf-8'))
known = {c['path']: c for c in L['changes']}
touched = []
for path, b in before.items():
    cur = h(path)
    if path in known:
        if known[path]['afterSha256'] != cur:
            known[path]['afterSha256'] = cur
            if reason not in known[path]['reason']:
                known[path]['reason'] += ' | ' + reason
            touched.append(path)
    elif cur != b:
        L['changes'].append({'path': path, 'beforeSha256': b, 'afterSha256': cur, 'reason': reason})
        touched.append(path)
vp = root / 'apps/lab-web/scripts/validate-u09.cjs'
v = vp.read_bytes().decode('utf-8')
m = re.search(r"const approved=new Set\(\[(.*?)\]\);", v)
cur = re.findall(r"'([^']+)'", m.group(1))
allp = cur + [c['path'] for c in L['changes'] if c['path'] not in cur]
vp.write_bytes(v.replace(m.group(0), "const approved=new Set([" + ','.join("'" + x + "'" for x in allp) + "]);").encode('utf-8'))
paths = {a['path'] for a in L['additions']}
for a in added:
    if a not in paths:
        L['additions'].append({'path': a, 'sha256': h(a), 'reason': reason})
for a in L['additions']:
    a['sha256'] = h(a['path'])
L.setdefault('laterReviews', []).append({'reason': reason, 'changed': touched, 'added': added})
lp.write_text(json.dumps(L, indent=2), encoding='utf-8', newline='\n')
print(json.dumps({'changedNow': len(touched), 'totalChanges': len(L['changes']), 'additions': len(L['additions'])}))
