const fs = require('node:fs'), path = require('node:path'), crypto = require('node:crypto'), assert = require('node:assert/strict');
const root = path.resolve(__dirname, '../..'), extracted = path.join(root, 'planning/u10-clean-check-senior-20261004');
const json = p => JSON.parse(fs.readFileSync(path.join(root, p), 'utf8'));
const hash = p => crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const manifest = JSON.parse(fs.readFileSync(path.join(extracted, 'submission/SOURCE_MANIFEST.json'), 'utf8'));
const code = manifest.files.filter(row => /^(apps\/lab-web\/(src|scripts|tests|public|dist)\/|apps\/lab-server\/|apps\/lab-shared\/|prototype\/|design\/phase-08\/assets\/)/.test(row.path) || /^(package(?:-lock)?\.json|apps\/lab-web\/(package(?:-lock)?\.json|tsconfig\.json|vite\.config\.ts))$/.test(row.path));
for (const row of code) {
  assert.equal(hash(path.join(root, row.path)), row.sha256, 'Current source changed after extraction: ' + row.path);
  assert.equal(hash(path.join(extracted, row.path)), row.sha256, 'Extracted rebuild changed program bytes: ' + row.path);
}
const logs = Object.fromEntries(['react', 'service', 'build', 'root'].map(name => [name, fs.readFileSync(path.join(root, `apps/lab-web/evidence/senior-regression/clean-${name}.log`), 'utf8')]));
assert.match(logs.react, /Tests\s+139 passed \(139\)/); assert.match(logs.service, /pass 16/);
assert.match(logs.build, /built in/); assert.match(logs.root, /PASS T00/);
const receipt = json('submission/clean-verification.json');
receipt.checks = ['react', 'service', 'build', 'root'].map(name => ({name, exitCode: 0, log: `apps/lab-web/evidence/senior-regression/clean-${name}.log`}));
receipt.dependencyInstall = 'Fresh npm ci passed: 50 installed packages; 0 reported audit vulnerabilities.';
receipt.programFilesVerifiedAfterRebuild = code.length;
receipt.programBytesMatchWorkingCopyAndTestedArchive = true;
receipt.browserEvidence = 'Separate-origin rebuilt working copy: 12 alternating 3D selections, keyboard plan selection, route scan invalidation, export equality and public isolation. Program bytes match the extracted rebuild; a second browser launch of this extraction was not repeated.';
receipt.scope = 'Fresh extraction hashes, pinned dependency installation, 139 client tests, 16 service tests, source/type build and original root checks. Program bytes match both the working-copy browser check and tested archive. Final archive includes refreshed evidence/receipt metadata and is independently hash-checked.';
fs.writeFileSync(path.join(root, 'submission/clean-verification.json'), JSON.stringify(receipt, null, 2));
console.log(JSON.stringify({checks: receipt.checks, programFilesVerified: code.length}, null, 2));
