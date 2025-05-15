# Update framework versions in package.json files
param(
    [string]$baseDir = "d:\Projects\Odyssey\components\Uplink Protocol v0.1"
)

try {
    $packageJsonPath = Join-Path -Path $baseDir -ChildPath "package.json"
    $packageJsonContent = Get-Content -Raw -Path $packageJsonPath
    $packageJson = $packageJsonContent | ConvertFrom-Json

# Extract versions from root package.json
$reactVersion = ($packageJson.devDependencies.react -replace '[\^~]', '')
$vueVersion = "3.3.4"  # Default Vue version
$angularVersion = "15.0.0"  # Default Angular version
$svelteVersion = "3.59.2"  # Default Svelte version

Write-Host "Framework versions from root package.json:" -ForegroundColor Cyan
Write-Host "React: $reactVersion" -ForegroundColor Yellow
Write-Host "Vue: $vueVersion (default)" -ForegroundColor Yellow
Write-Host "Angular: $angularVersion (default)" -ForegroundColor Yellow
Write-Host "Svelte: $svelteVersion (default)" -ForegroundColor Yellow

# Update package.json files for each framework
$frameworks = @(
    @{ Name = "react"; Version = $reactVersion },
    @{ Name = "vue"; Version = $vueVersion },
    @{ Name = "angular"; Version = $angularVersion },
    @{ Name = "svelte"; Version = $svelteVersion }
)

foreach ($framework in $frameworks) {
    $frameworkName = $framework.Name
    $frameworkVersion = $framework.Version
    $frameworkPackageJsonPath = "$baseDir\packages\$frameworkName\package.json"
    
    Write-Host "Updating $frameworkName package.json..." -ForegroundColor Green
    
    if (Test-Path $frameworkPackageJsonPath) {
        $frameworkPackageJson = Get-Content -Raw -Path $frameworkPackageJsonPath | ConvertFrom-Json
        
        # Update peerDependencies version
        if ($frameworkPackageJson.peerDependencies.$frameworkName) {
            $frameworkPackageJson.peerDependencies.$frameworkName = "^$frameworkVersion"
        }
        
        # Update devDependencies version if it exists
        if ($frameworkPackageJson.devDependencies."@types/$frameworkName") {
            $frameworkPackageJson.devDependencies."@types/$frameworkName" = "^$frameworkVersion"
        }
        
        # Write updated package.json
        $frameworkPackageJson | ConvertTo-Json -Depth 10 | Out-File -FilePath $frameworkPackageJsonPath -Encoding utf8
        Write-Host "  ✓ Updated $frameworkName to version $frameworkVersion" -ForegroundColor Green
    } else {
        Write-Host "  ✗ Package.json not found: $frameworkPackageJsonPath" -ForegroundColor Red
    }
}

Write-Host "`nAll framework versions updated!" -ForegroundColor Cyan
Write-Host "Next step: Run 'npm install --legacy-peer-deps' to install dependencies" -ForegroundColor Yellow

} catch {
    Write-Host "Error: $_" -ForegroundColor Red
    Write-Host $_.ScriptStackTrace -ForegroundColor Red
    exit 1
}
