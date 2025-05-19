# Open Helper Functions Demo
$WorkspaceRoot = Split-Path -Parent $PSScriptRoot
$DemoFile = Join-Path $WorkspaceRoot "examples\helper-functions-demo.html"

# Build the project first
npm run build

# Start a local server to serve the demo page
npx http-server -o $DemoFile

Write-Host "Press Ctrl+C to stop the server"
