# Uplink Protocol Workspace Setup

This document explains how to work with the Uplink Protocol packages using npm workspaces.

## Package Structure

The Uplink Protocol is now structured as a monorepo with the following packages:

1. `@uplink-protocol/core` - The root package, containing core functionality
2. `@uplink-protocol/react` - React integration package
3. `@uplink-protocol/vue` - Vue integration package
4. `@uplink-protocol/angular` - Angular integration package
5. `@uplink-protocol/svelte` - Svelte integration package

## Development Workflow

When developing locally, the framework packages use the core package from the workspace. This allows you to make changes to both the core and framework packages simultaneously.

### Steps for local development:

1. Install all dependencies:
   ```bash
   npm install
   ```

2. Build the core package:
   ```bash
   npm run build
   ```

3. Build specific framework packages:
   ```bash
   npm run build --workspace=@uplink-protocol/react
   npm run build --workspace=@uplink-protocol/vue
   npm run build --workspace=@uplink-protocol/angular
   npm run build --workspace=@uplink-protocol/svelte
   ```

4. Run tests:
   ```bash
   npm test
   ```

### Publishing workflow:

1. Build and publish the core package first:
   ```bash
   npm run build
   npm publish
   ```

2. Update framework packages to use the published core package:
   ```bash
   # Update dependency versions if needed
   ```

3. Build and publish framework packages:
   ```bash
   npm run build --workspace=@uplink-protocol/react
   npm publish --workspace=@uplink-protocol/react
   
   # Repeat for other framework packages
   ```

## Creating a New Application

To use Uplink Protocol in a new application:

```bash
# Install the core package
npm install @uplink-protocol/core

# Install the framework-specific package
npm install @uplink-protocol/react # or vue, angular, svelte
```

## Working with Framework Packages

Each framework package exports its adapter and integration utilities:

```javascript
// React
import { initializeReact, useReactController } from '@uplink-protocol/react';

// Vue
import { initializeVue, useVueController } from '@uplink-protocol/vue';

// Angular
import { initializeAngular, ControllerService } from '@uplink-protocol/angular';

// Svelte
import { initializeSvelte, useSvelteController } from '@uplink-protocol/svelte';
```

For examples of how to use each framework integration, see the respective package README.
