param([int]$Port=4180)
$ErrorActionPreference='Stop'
$taskRoot=Split-Path -Parent $PSScriptRoot
Set-Location -LiteralPath $taskRoot
if (-not (Get-Command node -ErrorAction SilentlyContinue)) { throw 'Node.js is required. Install Node.js, then run this script again.' }
Write-Host "Open http://127.0.0.1:$Port/submission/index.html. Keep this terminal open."
Write-Host 'If the port is already in use, reuse the existing project server or choose -Port 4191.'
& node (Join-Path $PSScriptRoot 'serve.cjs') $Port
