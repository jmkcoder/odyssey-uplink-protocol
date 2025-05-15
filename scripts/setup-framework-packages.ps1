#!/usr/bin/env pwsh
# Setup framework packages for Uplink Protocol

$frameworks = @("react", "vue", "angular", "svelte")
$baseDir = "d:\Projects\Odyssey\components\Uplink Protocol v0.1"
$packagesDir = "$baseDir\packages"

foreach ($framework in $frameworks) {
    Write-Host "Setting up $framework package..." -ForegroundColor Green
    
    # Create directory structure
    $frameworkDir = "$packagesDir\$framework"
    $srcDir = "$frameworkDir\src"
    $adapterDir = "$srcDir\adapter"
    $integrationDir = "$srcDir\integration"
    
    New-Item -ItemType Directory -Force -Path $srcDir | Out-Null
    New-Item -ItemType Directory -Force -Path $adapterDir | Out-Null
    New-Item -ItemType Directory -Force -Path $integrationDir | Out-Null
    
    # Create package.json
    $frameworkVersion = switch ($framework) {
        "react" { "^18.0.0" }
        "vue" { "^3.2.0" }
        "angular" { "^14.0.0" }
        "svelte" { "^3.0.0" }
        default { "^1.0.0" }
    }
    
    $frameworkTypesVersion = switch ($framework) {
        "react" { "^18.0.0" }
        "vue" { "^3.2.0" }
        "angular" { "^14.0.0" }
        "svelte" { "^3.0.0" }
        default { "^1.0.0" }
    }
    
    $frameworkPascalCase = (Get-Culture).TextInfo.ToTitleCase($framework)
    
    # Create package.json
    $packageJson = @"
{
  "name": "@uplink-protocol/$framework",
  "version": "0.0.1",
  "description": "Odyssey Uplink Protocol $frameworkPascalCase Integration",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "files": [
    "dist"
  ],
  "scripts": {
    "build": "webpack --config webpack.config.js --mode=production",
    "clean": "rimraf dist",
    "prepare": "npm run build"
  },
  "keywords": [
    "web-components",
    "ui",
    "components",
    "$framework"
  ],
  "author": "",
  "license": "ISC",
  "peerDependencies": {
    "@uplink-protocol/core": "^0.0.1",
    "$framework": "$frameworkVersion"
  },
  "devDependencies": {
    "@types/$framework": "$frameworkTypesVersion",
    "rimraf": "^5.0.1",
    "ts-loader": "^9.4.2",
    "typescript": "^5.0.4",
    "webpack": "^5.82.0",
    "webpack-cli": "^5.1.1"
  }
}
"@
    $packageJson | Out-File "$frameworkDir\package.json" -Encoding utf8
    
    # Create tsconfig.json
    $tsConfig = @"
{
  "compilerOptions": {
    "target": "ES2018",
    "module": "ESNext",
    "moduleResolution": "node",
    "declaration": true,
    "outDir": "./dist",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
"@

    if ($framework -eq "react") {
        $tsConfig += ',
    "jsx": "react"'
    }

    $tsConfig += @"

  },
  "include": [
    "src/**/*"
  ],
  "exclude": [
    "node_modules",
    "dist"
  ]
}
"@
    $tsConfig | Out-File "$frameworkDir\tsconfig.json" -Encoding utf8
    
    # Create webpack.config.js
    $webpackConfig = @"
const path = require('path');

module.exports = {
  entry: './src/index.ts',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'index.js',
    library: {
      name: 'UplinkProtocol$frameworkPascalCase',
      type: 'umd'
    },
    globalObject: 'this'
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js']
  },
  externals: {
    '@uplink-protocol/core': '@uplink-protocol/core',
    '$framework': '$framework'
  }
};
"@
    $webpackConfig | Out-File "$frameworkDir\webpack.config.js" -Encoding utf8
    
    # Create README.md
    $readme = @"
# @uplink-protocol/$framework

$frameworkPascalCase integration for Odyssey Uplink Protocol.

## Installation

```bash
npm install @uplink-protocol/core @uplink-protocol/$framework
```

## Usage

```javascript
import { initialize$frameworkPascalCase } from '@uplink-protocol/$framework';

// Initialize the $framework adapter
initialize$frameworkPascalCase();
```

For more detailed usage, see the documentation.
"@
    $readme | Out-File "$frameworkDir\README.md" -Encoding utf8
    
    # Create index.ts
    $index = @"
/**
 * @uplink-protocol/$framework
 * $frameworkPascalCase integration for Odyssey Uplink Protocol
 */

import { ${frameworkPascalCase}Adapter } from './adapter/${framework}-adapter';
import { AdapterRegistry } from '@uplink-protocol/core';

// Export everything from core
export * from '@uplink-protocol/core';

// Export framework-specific adapter
export { ${frameworkPascalCase}Adapter };

/**
 * Initialize the $frameworkPascalCase adapter
 */
export function initialize$frameworkPascalCase(): void {
  const registry = AdapterRegistry.getInstance();
  
  // Skip if adapters are already registered
  if (registry.getAllAdapters().length > 0) {
    console.log('Uplink Protocol adapters are already registered');
    return;
  }
  
  // Register the framework adapter
  const adapter = new ${frameworkPascalCase}Adapter();
  registry.registerAdapter(adapter);
  registry.setDefaultAdapter(adapter.name);
  console.log(`Uplink Protocol initialized with \${adapter.name} adapter`);
}

// Export framework-specific integration
export { use${frameworkPascalCase}Controller } from './integration/${framework}-integration';
"@
    $index | Out-File "$srcDir\index.ts" -Encoding utf8
    
    Write-Host "✅ $framework package setup complete" -ForegroundColor Green
}

Write-Host "`nAll framework packages have been set up!" -ForegroundColor Cyan
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Copy adapter code from core to each framework package" -ForegroundColor Yellow
Write-Host "2. Copy integration code from core to each framework package" -ForegroundColor Yellow
Write-Host "3. Run 'npm install' in the root directory to link workspaces" -ForegroundColor Yellow
