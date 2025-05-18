# Uplink Protocol

A universal frontend protocol for decoupling UI and logic.

> **PACKAGE STRUCTURE NOTICE:**  
> This package (@uplink-protocol/core) contains only the core functionality of the Uplink Protocol.  
> Framework-specific adapters are available in separate packages:
> - @uplink-protocol/react - React integration
> - @uplink-protocol/vue - Vue integration
> - @uplink-protocol/angular - Angular integration
> - @uplink-protocol/svelte - Svelte integration
>
> **Vanilla JavaScript integration is included in the core package.**
>
> **Module Format:** This package is delivered as ESM (ECMAScript Modules) only.

## Introduction

Uplink Protocol is a framework-agnostic approach to frontend development that provides a clean separation between UI components and application logic. It enables you to write business logic once and render it with any UI framework.

## Installation

```bash
# Install the core package
npm install @uplink-protocol/core

# For React integration
npm install @uplink-protocol/react
```

## Quick Start

### Initializing the Adapter

Initialize the appropriate adapter for your framework at your application's entry point:

```javascript
// For vanilla JavaScript
import { initializeVanillaAdapter } from '@uplink-protocol/core';
initializeVanillaAdapter();

// For React
import { initializeReactAdapter } from '@uplink-protocol/react';
initializeReactAdapter();
```

### Creating a Controller

```javascript
import { StandardBinding, EventEmitter } from '@uplink-protocol/core';

class CounterController {
  constructor() {
    // Bindings (reactive state)
    this.bindings = {
      count: new StandardBinding(0)
    };
    
    // Methods
    this.methods = {
      increment: () => {
        const newCount = this.bindings.count.current + 1;
        this.bindings.count.set(newCount);
        this.events.increment.emit(newCount);
      },
      
      decrement: () => {
        const newCount = this.bindings.count.current - 1;
        this.bindings.count.set(newCount);
      }
    };
    
    // Events
    this.events = {
      increment: new EventEmitter()
    };
  }
}
```

### Using with Vanilla JavaScript

```javascript
import { initializeVanillaAdapter, useUplink } from '@uplink-protocol/core';
import { CounterController } from './counter.controller';

// Initialize the adapter
initializeVanillaAdapter();

// Use the controller
const { state, methods, connect } = useUplink(new CounterController());

// Connect to DOM
const counterElement = document.getElementById('counter');
connect(counterElement, {
  onIncrement: (value) => {
    console.log(`Counter: ${value}`);
  }
});

// Set up UI
counterElement.innerHTML = `
  <div>Count: <span id="count">${state.count}</span></div>
  <button id="increment">+</button>
  <button id="decrement">-</button>
`;

// Add event listeners
document.getElementById('increment').addEventListener('click', methods.increment);
document.getElementById('decrement').addEventListener('click', methods.decrement);

// Update UI when state changes
methods.bindings.count.subscribe(value => {
  document.getElementById('count').textContent = value;
});
```

### Using with React

```jsx
import React from 'react';
import { initializeReactAdapter, useUplink } from '@uplink-protocol/react';
import { CounterController } from './counter.controller';

// Initialize the adapter
initializeReactAdapter();

function Counter() {
  const { state, methods, Container } = useUplink(new CounterController());
  
  return (
    <Container onIncrement={(value) => console.log(`Counter: ${value}`)}>
      <div>Count: {state.count}</div>
      <button onClick={methods.increment}>+</button>
      <button onClick={methods.decrement}>-</button>
    </Container>
  );
}
```

## Documentation

Comprehensive documentation is available in the `docs` folder:

- [Feature Guide](docs/FEATURE_GUIDE.md) - Overview of the main features
- [Usage Guide](docs/USAGE_GUIDE.md) - Practical examples and patterns
- [Technical Guide](docs/TECHNICAL_GUIDE.md) - Architecture and implementation details
- [TypeScript Usage](docs/TYPESCRIPT_USAGE.md) - Using TypeScript with the Uplink Protocol

## Core Features

- **Decoupled Logic & UI**: Controllers manage state, UI handles rendering
- **Universal Reactivity**: Framework-agnostic state updates
- **Logic Portability**: Write once, render anywhere approach
- **Framework Adapters**: Built-in support for major frameworks
- **TypeScript Support**: Comprehensive type definitions
- **Testing-First Design**: Easy to test business logic in isolation

## License

MIT
