from pathlib import Path
import json, hashlib, zipfile
root = Path(__file__).resolve().parents[2]
archive = root / 'submission/PARALLAX-Source-Handoff.zip'
receipt_path = root / 'submission/package-receipt.json'
receipt = json.loads(receipt_path.read_text())
assert hashlib.sha256(archive.read_bytes()).hexdigest() == receipt['zipSha256']
with zipfile.ZipFile(archive) as z:
    assert z.testzip() is None
    manifest = json.loads(z.read('submission/SOURCE_MANIFEST.json'))
    assert z.read('submission/SOURCE_MANIFEST.json') == (root / 'submission/SOURCE_MANIFEST.json').read_bytes()
    assert len(z.namelist()) == len(manifest['files']) + 1 == receipt['entries']
    for row in manifest['files']:
        packaged = z.read(row['path'])
        assert len(packaged) == row['bytes'], row['path']
        assert hashlib.sha256(packaged).hexdigest() == row['sha256'], row['path']
        current = root / row['path']
        assert current.stat().st_size == row['bytes'], row['path']
        assert hashlib.sha256(current.read_bytes()).hexdigest() == row['sha256'], row['path']
receipt.update({'archiveEntriesVerified': len(manifest['files']), 'archiveManifestHashes': 'pass', 'currentSelectedSourceHashes': 'pass', 'review': 'senior regression follow-up; final source and evidence metadata verified'})
receipt_path.write_text(json.dumps(receipt, indent=2))
print(json.dumps(receipt, indent=2))
