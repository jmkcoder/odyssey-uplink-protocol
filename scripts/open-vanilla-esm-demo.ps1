# Open the Vanilla Integration ESM Demo in the default browser
$demoFile = Join-Path $PSScriptRoot ".." "examples" "vanilla-integration-demo-esm.html"
$demoPath = [System.IO.Path]::GetFullPath($demoFile)

Write-Host "Opening ESM demo at: $demoPath" -ForegroundColor Green

# Open the file in the default browser
Start-Process $demoPath
