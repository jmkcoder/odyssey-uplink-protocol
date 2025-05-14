# Open the React Form Stepper demo in a browser
$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path
$demoPath = Join-Path $scriptPath "..\examples\react-form-stepper-demo.html"
$absolutePath = Resolve-Path $demoPath

Write-Host "Opening React Form Stepper demo at: $absolutePath"
Start-Process $absolutePath
