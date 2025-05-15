# Uplink Protocol Framework Package Creation Guide

This document explains how to create separate framework packages for the Uplink Protocol.

## Package Structure

The Uplink Protocol has been split into these packages:

1. `@uplink-protocol/core` - Core framework-agnostic functionality
2. `@uplink-protocol/react` - React integration
3. `@uplink-protocol/vue` - Vue integration
4. `@uplink-protocol/angular` - Angular integration
5. `@uplink-protocol/svelte` - Svelte integration

## Creating Framework Packages

For each framework, follow these steps to create a separate integration package:

### 1. Create Directory Structure

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

### 2. Setup Package Configuration

Create a `package.json` file for the framework package:

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
    ```

### 3. Create TypeScript Configuration

Create a `tsconfig.json` file:

```json
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
    "forceConsistentCasingInFileNames": true,
    "jsx": "react"
  },
  "include": [
    "src/**/*"
  ],
  "exclude": [
    "node_modules",
    "dist"
  ]
}
```

### 4. Create Webpack Configuration

Create a `webpack.config.js` file:

```javascript
const path = require('path');

module.exports = {
  entry: './src/index.ts',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'index.js',
    library: {
      name: 'UplinkProtocol[Framework]',
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
    'react': 'react',
    'vue': 'vue',
    'angular': 'angular',
    'svelte': 'svelte'
  }
};
```

## Framework-Specific Implementation

### 1. Copy Adapter Code

Copy the framework adapter from the core package and place it in the framework package:

```typescript
// src/adapter/[framework]-adapter.ts
import { AdapterInterface, BaseAdapter } from '@uplink-protocol/core';

export class [Framework]Adapter extends BaseAdapter implements AdapterInterface {
  // Implementation code from the core package
}
```

### 2. Create Integration Code

Create the framework-specific integration:

```typescript
// src/integration/[framework]-integration.ts
import { [Framework]Adapter } from '../adapter/[framework]-adapter';

export function use[Framework]Controller(controller) {
  // Framework-specific implementation
}
```

### 3. Create Package Index

Create the main entry point:

```typescript
// src/index.ts
import { [Framework]Adapter } from './adapter/[framework]-adapter';
import { AdapterRegistry } from '@uplink-protocol/core';
import { autoInitializeAdapter } from '@uplink-protocol/core';

// Export all from core
export * from '@uplink-protocol/core';

// Export framework-specific adapter
export { [Framework]Adapter };

// Auto-initialize the framework adapter
export function initialize[Framework](): void {
  const registry = AdapterRegistry.getInstance();
  
  // Register the framework adapter
  const adapter = new [Framework]Adapter();
  registry.registerAdapter(adapter);
  registry.setDefaultAdapter(adapter.name);
  console.log(`Uplink Protocol initialized with ${adapter.name} adapter`);
}

// Export framework-specific hooks
export { use[Framework]Controller } from './integration/[framework]-integration';
```

## Framework-Specific Examples

### React Package

```typescript
// src/adapter/react-adapter.ts
import { BaseAdapter } from '@uplink-protocol/core';
import * as React from 'react';

export class ReactAdapter extends BaseAdapter {
  readonly name = 'react';
  readonly version = '1.0.0';
  
  // Implementation from core package
}

// src/integration/react-integration.ts
import { useState, useEffect } from 'react';
import { connectController, disconnectController } from '@uplink-protocol/core';

export function useReactController(controller) {
  const [state, setState] = useState({});
  
  // Implementation of React-specific binding
  
  return state;
}
```

### Vue Package

```typescript
// src/adapter/vue-adapter.ts
import { BaseAdapter } from '@uplink-protocol/core';

export class VueAdapter extends BaseAdapter {
  readonly name = 'vue';
  readonly version = '1.0.0';
  
  // Implementation from core package
}

// src/integration/vue-integration.ts
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { connectController, disconnectController } from '@uplink-protocol/core';

export function useVueController(controller, element) {
  const state = ref({});
  
  // Implementation of Vue-specific binding
  
  onMounted(() => {
    // Connect controller
  });
  
  onBeforeUnmount(() => {
    // Disconnect controller
  });
  
  return state;
}
```

### Angular Package

```typescript
// src/adapter/angular-adapter.ts
import { BaseAdapter } from '@uplink-protocol/core';

export class AngularAdapter extends BaseAdapter {
  readonly name = 'angular';
  readonly version = '1.0.0';
  
  // Implementation from core package
}

// src/integration/angular-integration.ts
import { Injectable } from '@angular/core';
import { connectController, disconnectController } from '@uplink-protocol/core';

@Injectable({
  providedIn: 'root'
})
export class ControllerService {
  connect(controller, element) {
    // Implementation of Angular-specific binding
  }
}
```

### Svelte Package

```typescript
// src/adapter/svelte-adapter.ts
import { BaseAdapter } from '@uplink-protocol/core';

export class SvelteAdapter extends BaseAdapter {
  readonly name = 'svelte';
  readonly version = '1.0.0';
  
  // Implementation from core package
}

// src/integration/svelte-integration.ts
import { onMount, onDestroy } from 'svelte';
import { writable } from 'svelte/store';
import { connectController, disconnectController } from '@uplink-protocol/core';

export function useSvelteController(controller, element) {
  const store = writable({});
  
  // Implementation of Svelte-specific binding
  
  onMount(() => {
    // Connect controller
  });
  
  onDestroy(() => {
    // Disconnect controller
  });
  
  return store;
}
```

## Publishing Framework Packages

After creating each framework package:

1. Build the package:
   ```bash
   cd packages/[framework]
   npm run build
   ```

2. Publish to npm:
   ```bash
   npm publish --access=public
   ```

## Usage Examples

### React

```jsx
import React from 'react';
import { useReactController } from '@uplink-protocol/react';

function MyComponent() {
  const controller = {
    bindings: {
      count: 0
    },
    methods: {
      increment() {
        this.bindings.count++;
      }
    }
  };
  
  const state = useReactController(controller);
  
  return (
    <div>
      <p>Count: {state.count}</p>
      <button onClick={() => controller.methods.increment()}>Increment</button>
    </div>
  );
}
```

### Vue

```vue
<script setup>
import { ref } from 'vue';
import { useVueController } from '@uplink-protocol/vue';

const element = ref(null);
const controller = {
  bindings: {
    count: 0
  },
  methods: {
    increment() {
      this.bindings.count++;
    }
  }
};

const state = useVueController(controller, element);
</script>

<template>
  <div ref="element">
    <p>Count: {{ state.count }}</p>
    <button @click="controller.methods.increment()">Increment</button>
  </div>
</template>
```

```typescript
// index.ts
export { getController, connectElement } from './svelte';
export * from '@uplink-protocol/core';
```

## Publishing Process

1. Build the core package first
2. Build each framework package
3. Publish in order:
   a. Core package
   b. Framework packages

```bash
# From core package directory
npm publish --access=public

# From each framework package directory
npm publish --access=public
```
