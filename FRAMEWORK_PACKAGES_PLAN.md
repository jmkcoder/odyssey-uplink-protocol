# Framework Packages Implementation Plan

## Overview

We've successfully refactored the core package (`@uplink-protocol/core`) to remove all framework-specific code. Now we need to create separate packages for each framework:

- `@uplink-protocol/react`
- `@uplink-protocol/vue` 
- `@uplink-protocol/angular`
- `@uplink-protocol/svelte`

## Implementation Steps

### 1. Create Package Structure

For each framework package, create the following structure:

```
packages/
  [framework]/
    package.json
    tsconfig.json
    webpack.config.js
    src/
      index.ts
      adapter/
        [framework]-adapter.ts
      integration/
        [framework]-integration.ts
    README.md
```

### 2. Package.json Template

```json
{
  "name": "@uplink-protocol/[framework]",
  "version": "0.0.1",
  "description": "Odyssey Uplink Protocol [Framework] Integration",
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
    "[framework]"
  ],
  "author": "",
  "license": "ISC",
  "peerDependencies": {
    "@uplink-protocol/core": "^0.0.1",
    "[framework]": "[appropriate version]"
  },
  "devDependencies": {
    "@types/[framework]": "[appropriate version]",
    "rimraf": "^5.0.1",
    "ts-loader": "^9.4.2",
    "typescript": "^5.0.4",
    "webpack": "^5.82.0",
    "webpack-cli": "^5.1.1"
  }
}
```

### 3. Adapter Implementation

Move the framework-specific adapter code from the core package to each framework package:

```typescript
// From src/services/adapter/[framework]-adapter.ts in core
// To packages/[framework]/src/adapter/[framework]-adapter.ts
```

### 4. Integration Implementation

Move the framework-specific integration code from the core package to each framework package:

```typescript
// From src/services/integration/[framework].ts in core
// To packages/[framework]/src/integration/[framework]-integration.ts
```

### 5. Framework-specific Index

Create an index.ts file that exports all necessary components:

```typescript
// packages/[framework]/src/index.ts
import { [Framework]Adapter } from './adapter/[framework]-adapter';
import { autoInitializeAdapter } from '@uplink-protocol/core';
import { AdapterRegistry } from '@uplink-protocol/core';

// Export everything from core
export * from '@uplink-protocol/core';

// Export framework-specific adapter
export { [Framework]Adapter };

// Auto-initialize the framework adapter
export function initialize[Framework](): void {
  const registry = AdapterRegistry.getInstance();
  
  // Skip if adapters are already registered
  if (registry.getAllAdapters().length > 0) {
    console.log('Uplink Protocol adapters are already registered');
    return;
  }
  
  // Register the framework adapter
  const adapter = new [Framework]Adapter();
  registry.registerAdapter(adapter);
  registry.setDefaultAdapter(adapter.name);
  console.log(`Uplink Protocol initialized with ${adapter.name} adapter`);
}

// Export framework-specific hook if applicable
export { use[Framework]Controller } from './integration/[framework]-integration';
```

### 6. Framework-specific Entry Points

Update each framework's webpack configuration to generate the appropriate output format.

### 7. Update Documentation

Create README files for each framework package with installation and usage instructions.

## Publishing Steps

1. Build the core package:
   ```bash
   cd "d:\Projects\Odyssey\components\Uplink Protocol v0.1"
   npm run build
   ```

2. Publish the core package:
   ```bash
   npm publish --access=public
   ```

3. For each framework package:
   ```bash
   cd packages/[framework]
   npm run build
   npm publish --access=public
   ```

## Timeline

- Core Package Refactoring: Completed
- Framework Package Creation: Next
- Documentation Updates: After package implementation
- Publishing: Final step

## Responsibilities

- Ensure all framework-specific code is properly moved to respective packages
- Keep dependencies minimal and correctly specified
- Include appropriate installation and usage examples in each package README
