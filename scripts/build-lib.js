#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// ANSI color codes for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

function executeCommand(command, label) {
  console.log(`\n${colors.bright}${colors.blue}${label}${colors.reset}`);
  console.log(`${colors.dim}$ ${command}${colors.reset}`);
  
  try {
    execSync(command, { stdio: 'inherit' });
    console.log(`${colors.green}✓ Done${colors.reset}`);
    return true;
  } catch (error) {
    console.log(`${colors.red}× Failed${colors.reset}`);
    return false;
  }
}

function copyFile(src, dest) {
  try {
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.copyFileSync(src, dest);
    console.log(`${colors.green}✓ Copied ${path.basename(src)} to ${dest}${colors.reset}`);
    return true;
  } catch (error) {
    console.log(`${colors.red}× Failed to copy ${src} to ${dest}: ${error.message}${colors.reset}`);
    return false;
  }
}

function prepareDist() {
  const distPath = path.join(__dirname, '../dist');
  
  if (!fs.existsSync(distPath)) {
    console.log(`${colors.yellow}Creating dist directory...${colors.reset}`);
    fs.mkdirSync(distPath, { recursive: true });
  } else {
    console.log(`${colors.yellow}Cleaning dist directory...${colors.reset}`);
    const files = fs.readdirSync(distPath);
    for (const file of files) {
      if (file !== '.git') {
        const filePath = path.join(distPath, file);
        fs.rmSync(filePath, { recursive: true, force: true });
      }
    }
  }
}

function createPackageJson() {
  console.log(`${colors.bright}${colors.blue}Creating package.json for distribution${colors.reset}`);
  
  const packageJson = require('../package.json');
  const distPackageJson = {
    name: packageJson.name,
    version: packageJson.version,
    description: packageJson.description,
    main: 'index.js',
    module: 'index.esm.js',
    types: 'index.d.ts',
    exports: packageJson.exports,
    keywords: packageJson.keywords,
    author: packageJson.author,
    license: packageJson.license,
    repository: packageJson.repository,
    bugs: packageJson.bugs,
    homepage: packageJson.homepage,
    peerDependencies: {
      "react": ">=16.8.0",
      "react-dom": ">=16.8.0"
    }
  };
  
  fs.writeFileSync(
    path.join(__dirname, '../dist/package.json'),
    JSON.stringify(distPackageJson, null, 2)
  );
  console.log(`${colors.green}✓ Created dist/package.json${colors.reset}`);
}

function copyReadmeAndLicense() {
  console.log(`${colors.bright}${colors.blue}Copying documentation files${colors.reset}`);
  copyFile(path.join(__dirname, '../README.md'), path.join(__dirname, '../dist/README.md'));
  copyFile(path.join(__dirname, '../QUICK_START.md'), path.join(__dirname, '../dist/QUICK_START.md'));
  copyFile(path.join(__dirname, '../LICENSE'), path.join(__dirname, '../dist/LICENSE'));
}

// Main build process
console.log(`${colors.bright}${colors.magenta}=== Building Uplink Protocol ====${colors.reset}`);

prepareDist();

// Build UMD bundle
const umdBuild = executeCommand('webpack --config webpack.lib.js --mode=production', 'Building UMD bundles');

// Build ESM module
const esmBuild = executeCommand('webpack --config webpack.esm.js --mode=production', 'Building ESM module');

// Generate TypeScript declarations
const typesBuild = executeCommand('tsc -p tsconfig.declarations.json', 'Generating TypeScript declarations');

if (umdBuild && esmBuild && typesBuild) {
  // Create package.json for the dist folder
  createPackageJson();
  
  // Copy README and LICENSE
  copyReadmeAndLicense();
  
  console.log(`\n${colors.bright}${colors.green}=== Build completed successfully ===${colors.reset}`);
} else {
  console.log(`\n${colors.bright}${colors.red}=== Build failed ===${colors.reset}`);
  process.exit(1);
}
