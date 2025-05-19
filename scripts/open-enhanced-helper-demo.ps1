# Open Enhanced Helper Functions Demo
$currentDir = Split-Path $MyInvocation.MyCommand.Path -Parent
$repoRoot = (Get-Item $currentDir).Parent.FullName

# Build the library first
Set-Location $repoRoot
npm run build

# Serve the examples directory
npx http-server -c-1 -o ./examples/helper-functions-updated-demo.html
