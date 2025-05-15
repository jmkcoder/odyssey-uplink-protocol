#!/usr/bin/env pwsh
# Fix imports in framework packages

$baseDir = "d:\Projects\Odyssey\components\Uplink Protocol v0.1"
$frameworks = @("react", "vue", "angular", "svelte")

# Create core directory in each package to allow relative imports
foreach ($framework in $frameworks) {
    Write-Host "Setting up core reference for $framework package..." -ForegroundColor Green
    
    # Create core directory
    $coreDir = "$baseDir\packages\$framework\src\core"
    $adapterDir = "$baseDir\packages\$framework\src\adapter"
    $integrationDir = "$baseDir\packages\$framework\src\integration"
    
    if (!(Test-Path $coreDir)) {
        New-Item -ItemType Directory -Force -Path $coreDir | Out-Null
    }
    
    # Create index.ts file that re-exports core functionality
    $coreIndexContent = @"
/**
 * Re-exports from @uplink-protocol/core
 * This file exists to allow workspace development without publishing the core package
 */

export * from '../../../../src';
"@
    
    $coreIndexContent | Out-File "$coreDir\index.ts" -Encoding utf8
    
    Write-Host "  ✓ Created core reference" -ForegroundColor Green
    
    # Update imports in adapter files to use the core directory
    $adapterFiles = Get-ChildItem -Path $adapterDir -Filter "*.ts"
    foreach ($adapterFile in $adapterFiles) {
        $content = Get-Content -Path $adapterFile.FullName -Raw
        $newContent = $content -replace "@uplink-protocol/core", "../core"
        $newContent | Out-File -FilePath $adapterFile.FullName -Encoding utf8
        Write-Host "  ✓ Updated imports in $($adapterFile.Name)" -ForegroundColor Green
    }
    
    # Update imports in integration files to use the core directory
    $integrationFiles = Get-ChildItem -Path $integrationDir -Filter "*.ts"
    if (!$integrationFiles) {
        $integrationFiles = Get-ChildItem -Path $integrationDir -Filter "*.tsx"
    }
    
    foreach ($integrationFile in $integrationFiles) {
        $content = Get-Content -Path $integrationFile.FullName -Raw
        $newContent = $content -replace "@uplink-protocol/core", "../core"
        $newContent | Out-File -FilePath $integrationFile.FullName -Encoding utf8
        Write-Host "  ✓ Updated imports in $($integrationFile.Name)" -ForegroundColor Green
    }
}

Write-Host "All imports updated!" -ForegroundColor Cyan
