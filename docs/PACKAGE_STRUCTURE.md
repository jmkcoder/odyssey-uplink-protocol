# Uplink Protocol Package Structure

The Uplink Protocol has been reorganized into separate packages to improve modularity and reduce bundle size. This approach allows you to only install the packages you need for your specific project.

## Available Packages

### Core Package

- **@uplink-protocol/core**: Contains the core functionality of the Uplink Protocol
  - Controllers, Bindings, EventEmitters
  - Lifecycle management
  - Core adapter functionality
  - Does NOT include framework-specific integrations

### Framework Integration Packages

- **@uplink-protocol/react**: React integration for Uplink Protocol
  - React-specific hooks (`useUplink`)
  - React components and utilities

- **@uplink-protocol/vue**: Vue integration for Uplink Protocol
  - Vue composables (`useUplink`)
  - Vue-specific integration utilities

- **@uplink-protocol/angular**: Angular integration for Uplink Protocol
  - Angular services (`ControllerService`)
  - Angular-specific utilities (`useController`)

- **@uplink-protocol/svelte**: Svelte integration for Uplink Protocol
  - Svelte stores (`getController`)
  - Svelte actions (`connectElement`)

## Installation

Install only the packages you need:

```bash
# Core package (required)
npm install @uplink-protocol/core

# Framework integration (install only what you need)
npm install @uplink-protocol/react      # For React projects
npm install @uplink-protocol/vue        # For Vue projects
npm install @uplink-protocol/angular    # For Angular projects
npm install @uplink-protocol/svelte     # For Svelte projects
```

## Usage

Import from the appropriate package:

```js
// Core functionality
import { Controller, Binding } from '@uplink-protocol/core';

// Framework-specific integration
import { useUplink } from '@uplink-protocol/react';
// OR
import { useUplink } from '@uplink-protocol/vue';
// OR
import { useController } from '@uplink-protocol/angular';
// OR
import { getController } from '@uplink-protocol/svelte';
```
