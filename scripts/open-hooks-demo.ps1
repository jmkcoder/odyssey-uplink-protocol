# Script to open the framework hooks demo

$ErrorActionPreference = "Stop"

# Get the script directory and navigate to the project root
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$projectRoot = Split-Path -Parent $scriptDir

# Build the project if needed
Write-Host "Building the project..."
Set-Location $projectRoot
npm run build

# Navigate to the examples directory and start a server
Write-Host "Starting server for framework hooks demo..."
Set-Location $projectRoot

# Use http-server or another simple server to serve the demo
if (Get-Command "http-server" -ErrorAction SilentlyContinue) {
    Start-Process "http-server" -ArgumentList "$projectRoot"
    Start-Process "http://localhost:8080/examples/framework-hooks-demo.html"
} elseif (Get-Command "npx" -ErrorAction SilentlyContinue) {
    Start-Process "npx" -ArgumentList "http-server", "$projectRoot"
    Start-Process "http://localhost:8080/examples/framework-hooks-demo.html"
} else {
    Write-Host "Neither http-server nor npx found. Please install them with:"
    Write-Host "npm install -g http-server"
    Write-Host ""
    Write-Host "Or you can manually open the demo at:"
    Write-Host "$projectRoot\examples\framework-hooks-demo.html"
}

Write-Host "Framework hooks demo started!"
