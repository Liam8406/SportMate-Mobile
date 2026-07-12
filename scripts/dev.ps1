param([switch]$Clear)

$ErrorActionPreference = "Stop"

$root = Split-Path -Parent $PSScriptRoot
$backendPath = Join-Path $root "backend"
$mobilePath = Join-Path $root "mobile"
$env:DOTENV_CONFIG_QUIET = "true"

$backendJob = Start-Job -Name "sportmate-backend" -ScriptBlock {
  param($path)
  Set-Location $path
  node server.js
} -ArgumentList $backendPath

try {
  Start-Sleep -Seconds 2
  Receive-Job $backendJob -Keep

  Set-Location $mobilePath
  if ($Clear) {
    & ".\node_modules\.bin\expo.cmd" start --clear
  } else {
    & ".\node_modules\.bin\expo.cmd" start
  }
} finally {
  Stop-Job $backendJob -ErrorAction SilentlyContinue
  Remove-Job $backendJob -Force -ErrorAction SilentlyContinue
}
