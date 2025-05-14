#!/usr/bin/env pwsh

$browserDemoPath = "D:\Projects\Odyssey\components\Uplink Protocol v0.1\examples\browser-demo.html"
$dirPath = Split-Path -Parent $browserDemoPath

Write-Host "Opening browser demo from: $browserDemoPath" -ForegroundColor Cyan

# Check if the file exists
if (Test-Path $browserDemoPath) {
    # Start the browser demo
    Start-Process $browserDemoPath
    Write-Host "Browser demo opened successfully!" -ForegroundColor Green
} else {
    Write-Host "Error: Could not find browser-demo.html at the specified path." -ForegroundColor Red
}
