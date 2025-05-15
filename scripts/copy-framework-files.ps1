#!/usr/bin/env pwsh
# Copy framework-specific files to respective packages

$baseDir = "d:\Projects\Odyssey\components\Uplink Protocol v0.1"
$frameworks = @("react", "vue", "angular", "svelte")

foreach ($framework in $frameworks) {
    Write-Host "Copying files for $framework package..." -ForegroundColor Green
    
    $sourceAdapterPath = "$baseDir\src\services\adapter\$framework-adapter.ts"
    $targetAdapterPath = "$baseDir\packages\$framework\src\adapter\$framework-adapter.ts"
    
    $sourceIntegrationPath = if ($framework -eq "react") {
        "$baseDir\src\services\integration\$framework.tsx"
    } else {
        "$baseDir\src\services\integration\$framework.ts"
    }
    $targetIntegrationPath = "$baseDir\packages\$framework\src\integration\$framework-integration.ts"
    
    # Copy adapter file
    if (Test-Path $sourceAdapterPath) {
        # Read the content and update imports
        $adapterContent = Get-Content $sourceAdapterPath -Raw
        $adapterContent = $adapterContent -replace "import \{ (.*?) \} from '\.\/";
        $adapterContent = $adapterContent -replace "import \{ (.*?) \} from '\.\./";
        
        # Insert new imports
        $adapterImports = "import { BaseAdapter, AdapterInterface } from '@uplink-protocol/core';"
        $adapterContent = $adapterImports + "`n`n" + $adapterContent
        
        # Write to the target file
        $adapterContent | Out-File $targetAdapterPath -Encoding utf8
        Write-Host "  ✓ Copied and updated adapter file"
    } else {
        Write-Host "  ✗ Adapter file not found: $sourceAdapterPath" -ForegroundColor Red
    }
    
    # Copy integration file
    if (Test-Path $sourceIntegrationPath) {
        # Read the content and update imports
        $integrationContent = Get-Content $sourceIntegrationPath -Raw
        $integrationContent = $integrationContent -replace "import \{ (.*?) \} from '\.\/";
        $integrationContent = $integrationContent -replace "import \{ (.*?) \} from '\.\./";
        
        # Insert new imports
        $integrationImports = "import { connectController, disconnectController } from '@uplink-protocol/core';`nimport { ${framework}Adapter } from '../adapter/${framework}-adapter';"
        $integrationContent = $integrationImports + "`n`n" + $integrationContent
        
        # Write to the target file
        $integrationContent | Out-File $targetIntegrationPath -Encoding utf8
        Write-Host "  ✓ Copied and updated integration file"
    } else {
        Write-Host "  ✗ Integration file not found: $sourceIntegrationPath" -ForegroundColor Red
    }
    
    Write-Host "✅ Files copied for $framework package" -ForegroundColor Green
}

Write-Host "`nAll files copied!" -ForegroundColor Cyan
Write-Host "Next step: Run 'npm install' to link workspaces" -ForegroundColor Yellow
