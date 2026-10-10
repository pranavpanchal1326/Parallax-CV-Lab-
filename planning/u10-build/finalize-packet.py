"""Seals the handoff: rebuilds manifest and ZIP, then verifies every archived file against the
manifest and the working copy. Run after all validators (they rewrite small receipt files)."""
import json, hashlib, subprocess, sys, zipfile
from pathlib import Path

root = Path(__file__).resolve().parents[2]
note = sys.argv[1] if len(sys.argv) > 1 else 'U10-R2 seal'
subprocess.run([sys.executable, str(root / 'planning/u10-build/package-handoff.py')], check=True, stdout=subprocess.DEVNULL)
out = root / 'submission'
archive = zipfile.ZipFile(out / 'PARALLAX-Source-Handoff.zip')
manifest = json.loads((out / 'SOURCE_MANIFEST.json').read_text(encoding='utf-8'))
sha = lambda b: hashlib.sha256(b).hexdigest()
bad = [r['path'] for r in manifest['files'] if sha(archive.read(r['path'])) != r['sha256'] or sha((root / r['path']).read_bytes()) != r['sha256']]
receipt_path = out / 'package-receipt.json'
receipt = json.loads(receipt_path.read_text(encoding='utf-8'))
receipt.update({'archiveEntriesVerified': len(manifest['files']), 'archiveManifestHashes': 'pass' if not bad else 'FAIL',
                'currentSelectedSourceHashes': 'pass' if not bad else 'FAIL', 'review': note})
receipt_path.write_text(json.dumps(receipt, indent=2), encoding='utf-8', newline='\n')
print(json.dumps({'entries': receipt['entries'], 'zipSha256': receipt['zipSha256'][:16], 'mismatches': len(bad)}))
sys.exit(1 if bad else 0)
