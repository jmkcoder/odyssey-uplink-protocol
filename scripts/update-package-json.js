#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Read the current package.json
const packageJsonPath = path.join(__dirname, '../package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

// Update the scripts section
packageJson.scripts = {
  ...packageJson.scripts,
  "build": "npm run clean && npm run build:umd && npm run build:esm && npm run build:cjs",
  "build:umd": "webpack --config webpack.lib.js --mode=production",
  "build:esm": "tsc -p tsconfig.esm.json",
  "build:cjs": "tsc -p tsconfig.cjs.json",
  "clean": "rimraf dist"
};

// Update exports field to include ESM and CJS paths
packageJson.exports = {
  ".": {
    "import": "./dist/esm/index.js",
    "require": "./dist/cjs/index.js",
    "types": "./dist/esm/index.d.ts"
  },
  "./uplink-auto-init": {
    "import": "./dist/esm/uplink-auto-init.js",
    "require": "./dist/cjs/uplink-auto-init.js"
  },
  "./react": {
    "import": "./dist/esm/services/integration/react.js",
    "require": "./dist/cjs/services/integration/react.js",
    "types": "./dist/esm/services/integration/react.d.ts"
  }
};

// Update main/module/types
packageJson.main = "dist/cjs/index.js";
packageJson.module = "dist/esm/index.js";
packageJson.types = "dist/esm/index.d.ts";

// Write updated package.json
fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2), 'utf8');

console.log('Package.json has been updated successfully.');
