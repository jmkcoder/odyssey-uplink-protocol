# Open Custom Binding Demo
$currentDir = Split-Path $MyInvocation.MyCommand.Path -Parent
$repoRoot = (Get-Item $currentDir).Parent.FullName

# Build the library first
Set-Location $repoRoot
npm run build

# Serve the examples directory
npx http-server -c-1 -o ./examples/custom-binding-demo.html
