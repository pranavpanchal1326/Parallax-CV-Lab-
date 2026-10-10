from pathlib import Path
import zipfile, json, hashlib
root = Path(__file__).resolve().parents[2]
destination = root / 'planning/u10-clean-check-senior-20261004'
assert destination.resolve().is_relative_to(root.resolve())
assert not destination.exists(), 'Never overwrite an existing extracted copy.'
archive = root / 'submission/PARALLAX-Source-Handoff.zip'
archive_hash = hashlib.sha256(archive.read_bytes()).hexdigest()
with zipfile.ZipFile(archive) as z:
    assert z.testzip() is None
    for name in z.namelist():
        assert (destination / name).resolve().is_relative_to(destination.resolve())
    z.extractall(destination)
manifest = json.loads((destination / 'submission/SOURCE_MANIFEST.json').read_text())
for row in manifest['files']:
    p = destination / row['path']
    assert p.stat().st_size == row['bytes']
    assert hashlib.sha256(p.read_bytes()).hexdigest() == row['sha256'], row['path']
receipt = {'date': '2026-10-04', 'review': 'senior regression follow-up', 'manifestEntriesVerified': len(manifest['files']), 'manifestSha256': 'pass', 'testedArchiveSha256': archive_hash, 'sourceExtraction': 'fresh folder; no browser state reset', 'checks': [], 'scope': 'Fresh repaired-source extraction hashes; dependency install and tests/build follow. Final archive receipts are refreshed separately.'}
(root / 'submission/clean-verification.json').write_text(json.dumps(receipt, indent=2))
print(f'Fresh senior extraction: {len(manifest["files"])} source/artifact hashes verified.')
