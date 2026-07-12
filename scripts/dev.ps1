param([switch]$Clear)

$ErrorActionPreference = "Stop"

$root = Split-Path -Parent $PSScriptRoot
$backendPath = Join-Path $root "backend"
$mobilePath = Join-Path $root "mobile"

Write-Host "[dev] starting backend..."

$backendJob = Start-Job -Name "sportmate-backend" -ScriptBlock {
  param($path)
  Set-Location $path
  node server.js
} -ArgumentList $backendPath

try {
  Start-Sleep -Seconds 2
  Receive-Job $backendJob -Keep

  Write-Host "[dev] starting Expo..."
  Set-Location $mobilePath
  if ($Clear) {
    npm start -- --clear
  } else {
    npm start
  }
} finally {
  Write-Host "[dev] stopping backend..."
  Stop-Job $backendJob -ErrorAction SilentlyContinue
  Remove-Job $backendJob -Force -ErrorAction SilentlyContinue
}
