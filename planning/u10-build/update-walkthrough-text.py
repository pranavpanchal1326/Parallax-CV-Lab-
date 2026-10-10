"""Copies the re-captured page text alternatives into the backup walkthrough (frames.json and the page)."""
import json
from pathlib import Path
root = Path(__file__).resolve().parents[2]
res = json.loads((root / 'planning/u10-build/capture-ui-result.json').read_text(encoding='utf-8'))
fp = root / 'submission/demo/frames.json'
frames = json.loads(fp.read_text(encoding='utf-8'))
old = json.loads(json.dumps(frames))
for f in frames:
    key = Path(f['file']).stem
    if key in res['text'] and f['text'] != f['caption']:
        f['text'] = res['text'][key]
fp.write_text(json.dumps(frames, indent=2), encoding='utf-8', newline='\n')
hp = root / 'submission/demo/index.html'
h = hp.read_bytes().decode('utf-8')
i = h.index('const frames=') + len('const frames=')
j = h.index(';let index=0', i)
assert json.loads(h[i:j]) == old
payload = json.dumps(frames)
assert '</script' not in payload.lower()
hp.write_bytes((h[:i] + payload + h[j:]).encode('utf-8'))
print('walkthrough text alternatives updated')
