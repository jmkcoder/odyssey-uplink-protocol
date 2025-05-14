# This script opens the Framework Adapters Demo in a browser

$demoPath = Join-Path $PSScriptRoot "..\examples\framework-adapters-demo.html"

# Check if the file exists
if (-not (Test-Path -Path $demoPath)) {
    Write-Error "The Framework Adapters Demo file doesn't exist at $demoPath"
    exit 1
}

# Convert to absolute path
$absolutePath = Resolve-Path $demoPath

# Open the demo in the default browser
Start-Process $absolutePath.Path
