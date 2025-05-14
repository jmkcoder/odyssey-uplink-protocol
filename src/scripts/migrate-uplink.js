#!/usr/bin/env node

/**
 * Odyssey Uplink Protocol - Migration Script
 * 
 * This script helps migrate from manual adapter configuration to the
 * zero-configuration approach.
 */

const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

console.log('\n🚀 Odyssey Uplink Protocol - Zero-Config Migration Tool\n');
console.log('This tool will help you migrate your project to use the zero-configuration approach.\n');

// Ask for entry file
const entryFile = process.argv[2] || '';
const defaultEntry = 'src/index.js';

let targetFile = entryFile;
if (!entryFile) {
  console.log(`No entry file specified. Using default: ${defaultEntry}`);
  targetFile = defaultEntry;
}

// Check if file exists
const resolvedFile = path.resolve(process.cwd(), targetFile);
if (!fs.existsSync(resolvedFile)) {
  console.log(`⚠️  Warning: File ${resolvedFile} not found.`);
  
  // Try to automatically detect common entry files
  const commonEntryFiles = [
    'src/index.js', 
    'src/index.ts', 
    'src/main.js', 
    'src/main.ts',
    'src/App.jsx',
    'src/App.tsx',
    'index.js'
  ];
  
  let foundFile = null;
  for (const file of commonEntryFiles) {
    const testPath = path.resolve(process.cwd(), file);
    if (fs.existsSync(testPath)) {
      foundFile = file;
      break;
    }
  }
  
  if (foundFile) {
    console.log(`✅ Found potential entry file: ${foundFile}`);
    targetFile = foundFile;
  } else {
    console.error('❌ Error: Could not find a suitable entry file.');
    console.log('Please run the script with your main entry file:');
    console.log('  node migrate-uplink.js src/index.js');
    process.exit(1);
  }
}

// Detect framework
console.log('\n🔍 Detecting framework...');

const packageJsonPath = path.resolve(process.cwd(), 'package.json');
let detectedFramework = 'unknown';

if (fs.existsSync(packageJsonPath)) {
  try {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    const dependencies = { ...packageJson.dependencies, ...packageJson.devDependencies };
    
    if (dependencies.react) {
      detectedFramework = 'react';
    } else if (dependencies.vue) {
      detectedFramework = 'vue';
    } else if (dependencies['@angular/core']) {
      detectedFramework = 'angular';
    } else if (dependencies.svelte) {
      detectedFramework = 'svelte';
    }
    
    console.log(`✅ Detected framework: ${detectedFramework}`);
  } catch (error) {
    console.error('❌ Error parsing package.json:', error.message);
  }
}

// Update the entry file
console.log('\n🔄 Updating entry file...');

try {
  const content = fs.readFileSync(path.resolve(process.cwd(), targetFile), 'utf8');
  
  // Check if there are any manual adapter registrations
  const hasManualRegistration = 
    content.includes('registerAdapter') || 
    content.includes('setDefaultAdapter') ||
    content.includes('getAdapterRegistry');
  
  if (hasManualRegistration) {
    console.log('⚠️  Found manual adapter registration code that can be replaced.');
    
    // Create backup
    const backupFile = `${targetFile}.backup`;
    fs.writeFileSync(path.resolve(process.cwd(), backupFile), content, 'utf8');
    console.log(`✅ Created backup at: ${backupFile}`);
    
    // Replace with auto-initialization
    const newContent = content.replace(
      /\/\/ Set up adapter registry[\s\S]*?(?:registerAdapter|setDefaultAdapter)\(.*?\);/g,
      "// Auto-initialize adapters\nimport 'odyssey/uplink-auto-init';"
    );
    
    fs.writeFileSync(path.resolve(process.cwd(), targetFile), newContent, 'utf8');
    console.log(`✅ Updated ${targetFile} to use auto-initialization.`);
  } else {
    // Just add the import if no manual registration is found
    const importStatement = "import 'odyssey/uplink-auto-init';\n";
    
    // Determine where to add the import
    const lines = content.split('\n');
    const lastImportIndex = lines.reduce((lastIndex, line, index) => {
      if (line.trim().startsWith('import ')) {
        return index;
      }
      return lastIndex;
    }, -1);
    
    if (lastImportIndex >= 0) {
      lines.splice(lastImportIndex + 1, 0, importStatement);
    } else {
      lines.unshift(importStatement);
    }
    
    fs.writeFileSync(path.resolve(process.cwd(), targetFile), lines.join('\n'), 'utf8');
    console.log(`✅ Added auto-initialization import to ${targetFile}.`);
  }
} catch (error) {
  console.error(`❌ Error updating entry file: ${error.message}`);
}

console.log('\n✨ Migration completed!');
console.log('\nNext steps:');
console.log('1. Update your components to use the framework integration hooks:');
console.log(`   import { useUplink } from 'odyssey/services/integration';`);
console.log('2. Remove any manual adapter registration code from your application.');
console.log('3. Check the documentation for more information on the zero-configuration approach.');

// Offer to run the application
console.log('\nWould you like to run your application now? (y/N)');
process.stdin.once('data', (data) => {
  const input = data.toString().trim().toLowerCase();
  if (input === 'y' || input === 'yes') {
    console.log('\n🚀 Running application...');
    exec('npm start', (error, stdout, stderr) => {
      if (error) {
        console.error(`❌ Error: ${error.message}`);
        return;
      }
      console.log(stdout);
    });
  } else {
    console.log('\nSee you later! Happy coding! 👋');
    process.exit(0);
  }
});
