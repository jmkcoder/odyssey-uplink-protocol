# Test Two-Way Binding in Browser Demo
# This script opens the browser demo and provides instructions for testing the two-way binding

Write-Host "Starting two-way binding test..." -ForegroundColor Green

# Determine the full path to the browser demo
$demoPath = Join-Path $PSScriptRoot "..\examples\browser-demo.html"
$demoPath = [System.IO.Path]::GetFullPath($demoPath)

# Open the demo in the default browser
Write-Host "Opening browser demo from: $demoPath"
Start-Process $demoPath

Write-Host @"

TWO-WAY BINDING TEST INSTRUCTIONS:
==================================

1. The browser demo should now be open in your browser.

2. Test these two-way binding behaviors:

   a) BINDING → UI:
      - Click the "+" or "+5" buttons
      - The counter display AND the input field should both update

   b) UI → BINDING:
      - Type a different value in the input field
      - After typing, the counter display should update to match

3. To run automatic validation:
   - Open the browser's developer console (F12 or right-click > Inspect)
   - Copy and paste the content of this script:
     ${PSScriptRoot}\validate-two-way-binding.js
   - The script will run tests and report the results

"@ -ForegroundColor Cyan

Write-Host "Browser demo opened for testing!" -ForegroundColor Green
