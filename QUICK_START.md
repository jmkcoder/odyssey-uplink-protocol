# Odyssey Uplink Protocol - Quick Start Guide

This guide will help you quickly get started with the Odyssey Uplink Protocol using the new zero-configuration approach.

## Installation

```bash
npm install @jmkcoder/uplink-protocol
```

## Zero-Configuration Setup

1. Add the auto-initialization import to your app's entry point:

```js
// src/index.js or your main entry file
import '@jmkcoder/uplink-protocol/uplink-auto-init';

// Rest of your code...
```

That's it! The protocol will automatically detect your framework and set up the appropriate adapter.

## Create a Controller

```typescript
// src/controllers/counter.controller.ts
import { Controller, StandardBinding, EventEmitter } from '@jmkcoder/uplink-protocol';

export class CounterController implements Controller {
  bindings = {
    count: new StandardBinding(0),
    isEven: new StandardBinding(true)
  };
  
  methods = {
    increment: () => {
      const newCount = this.bindings.count.current + 1;
      this.bindings.count.set(newCount);
      this.bindings.isEven.set(newCount % 2 === 0);
      this.events.increment.emit(newCount);
    },
    
    decrement: () => {
      const newCount = this.bindings.count.current - 1;
      this.bindings.count.set(newCount);
      this.bindings.isEven.set(newCount % 2 === 0);
      this.events.decrement.emit(newCount);
    }
  };
  
  events = {
    increment: new EventEmitter<number>(), // Type parameter for better type safety
    decrement: new EventEmitter<number>()
  };
}
```

## Use in your Framework

### React

```jsx
// src/components/Counter.jsx
import React from 'react';
import { useUplink } from '@jmkcoder/uplink-protocol/services/integration';
import { CounterController } from '../controllers/counter.controller';

export const Counter = () => {
  const { state, methods, Container } = useUplink(new CounterController(), {
    trackBindings: 'all'
  });
  
  return (
    <Container onIncrement={(val) => console.log(`Count: ${val}`)}>
      <div>Count: {state.count}</div>
      <button onClick={methods.increment}>+</button>
      <button onClick={methods.decrement}>-</button>
    </Container>
  );
};
```

### Vue

```vue
<!-- src/components/Counter.vue -->
<template>
  <div ref="containerRef">
    <div>Count: {{ state.count }}</div>
    <button @click="methods.increment">+</button>
    <button @click="methods.decrement">-</button>
  </div>
</template>

<script>
import { useUplink } from '@jmkcoder/uplink-protocol/services/integration';
import { CounterController } from '../controllers/counter.controller';

export default {
  setup() {
    const { state, methods, containerRef } = useUplink(new CounterController(), {
      trackBindings: 'all'
    });
    
    return { state, methods, containerRef };
  }
};
</script>
```

### Angular

```typescript
// src/components/counter.component.ts
import { Component } from '@angular/core';
import { CounterController } from '../controllers/counter.controller';

@Component({
  selector: 'app-counter',
  template: `
    <uplink-container [controller]="controller" (increment)="onIncrement($event)">
      <ng-template let-state="state" let-methods="methods">
        <div>Count: {{ state.count }}</div>
        <button (click)="methods.increment()">+</button>
        <button (click)="methods.decrement()">-</button>
      </ng-template>
    </uplink-container>
  `
})
export class CounterComponent {
  controller = new CounterController();
  
  onIncrement(value: number) {
    console.log(`Count: ${value}`);
  }
}
```

### Svelte

```svelte
<!-- src/components/Counter.svelte -->
<script>
  import { useUplink } from '@jmkcoder/uplink-protocol/services/integration';
  import { CounterController } from '../controllers/counter.controller';
  
  const { state, methods, element } = useUplink(new CounterController(), {
    trackBindings: 'all'
  });
</script>

<div bind:this={$element}>
  <div>Count: {$state.count}</div>
  <button on:click={methods.increment}>+</button>
  <button on:click={methods.decrement}>-</button>
</div>
```

## Two-Way Binding

You can easily implement two-way binding between your UI and the controller:

```javascript
// Controller setup
const controller = {
  bindings: {
    name: new StandardBinding('John'),
    age: new StandardBinding(30)
  }
};

// Create adapter and connect to element
const adapter = new ControllerAdapter(controller);
adapter.connect(document.getElementById('user-form'));

// One-way binding (controller → UI)
adapter.watchProperty('name', (newValue) => {
  document.getElementById('nameInput').value = newValue;
});

// Two-way binding (UI → controller)
document.getElementById('nameInput').addEventListener('input', (event) => {
  adapter.updateProperty('name', event.target.value);
});

// For numeric values with validation
document.getElementById('ageInput').addEventListener('input', (event) => {
  const value = parseInt(event.target.value, 10);
  if (!isNaN(value)) {
    adapter.updateProperty('age', value);
  }
});
```

This creates a complete two-way binding where:
1. UI elements automatically update when controller bindings change
2. Controller bindings update when users interact with UI elements

## Methods with Parameters

The Uplink Protocol supports methods with parameters:

```javascript
// Controller with parameterized methods
const controller = {
  bindings: {
    count: new StandardBinding(0)
  },
  
  methods: {
    // Method without parameters
    increment() {
      this.bindings.count.set(this.bindings.count.current + 1);
    },
    
    // Method with parameters
    updateCount(amount, message) {
      const newValue = this.bindings.count.current + amount;
      this.bindings.count.set(newValue);
      console.log(`${message}: ${newValue}`);
      return newValue;
    }
  }
};

// Call methods with parameters
const adapter = new ControllerAdapter(controller);
adapter.callMethod('updateCount', [5, 'Increased by 5']);
```

For vanilla JS controllers that don't use classes, maintain proper context:

```javascript
const createController = () => {
  const controller = {
    bindings: {
      count: new StandardBinding(0)
    },
    
    methods: {
      // Use explicit reference to controller
      updateCount: function(amount, message) {
        const newValue = controller.bindings.count.current + amount;
        controller.bindings.count.set(newValue);
        return newValue;
      }
    }
  };
  return controller;
};
```

## TypeScript Support

For better TypeScript support, use the `TypedController` interface:

```typescript
import { 
  TypedController, 
  Binding, 
  EventEmitter, 
  StandardBinding,
  BindingValue,
  EventData
} from '@jmkcoder/uplink-protocol';

// Define types for bindings, methods, and events
interface CounterBindings {
  count: Binding<number>;
  isEven: Binding<boolean>;
}

interface CounterMethods {
  increment(): void;
  decrement(): void;
  reset(): void;
}

interface CounterEvents {
  increment: EventEmitter<number>;
  decrement: EventEmitter<number>;
}

// Implement typed controller
export class CounterController implements TypedController<CounterBindings, CounterMethods, CounterEvents> {
  // Now everything is fully typed!
  bindings = {
    count: new StandardBinding<number>(0),
    isEven: new StandardBinding<boolean>(true)
  };
  
  methods = {
    increment: () => { 
      const newCount = this.bindings.count.current + 1;
      this.bindings.count.set(newCount);
      this.bindings.isEven.set(newCount % 2 === 0);
      this.events.increment.emit(newCount);
    },
    decrement: () => { 
      const newCount = this.bindings.count.current - 1;
      this.bindings.count.set(newCount);
      this.bindings.isEven.set(newCount % 2 === 0);
      this.events.decrement.emit(newCount);
    },
    reset: () => {
      this.bindings.count.set(0);
      this.bindings.isEven.set(true);
    }
  };
  
  events = {
    increment: new EventEmitter<number>(),
    decrement: new EventEmitter<number>()
  };
}

// Helper types for framework integration
type CountState = ControllerState<CounterController>;
// Results in: { count: number, isEven: boolean }

type CountEventHandlers = ControllerEventHandlers<CounterController>;
// Results in: { onIncrement?: (data: number) => void, onDecrement?: (data: number) => void }

// Usage in framework integration
function useTypedController() {
  const controller = new CounterController();
  
  // Fully typed state access
  const count: BindingValue<typeof controller.bindings.count> = controller.bindings.count.current;
  
  // Fully typed event data
  const onIncrement = (data: EventData<typeof controller.events.increment>) => {
    console.log(`Count increased to ${data}`);
  };
  
  return { controller };
}
```

The TypedController system provides complete type safety throughout your application, including in framework integration hooks.

## Lifecycle Methods

Controllers can implement lifecycle methods to manage their state throughout their lifecycle:

```typescript
import { LifecycleAwareController, UIContext } from '@jmkcoder/uplink-protocol';

export class DataController implements LifecycleAwareController {
  bindings = {
    data: new StandardBinding([]),
    isLoading: new StandardBinding(false)
  };
  
  // Called when controller is created
  initialize() {
    console.log('Controller initialized');
  }
  
  // Called when UI connects to controller
  connect(element: HTMLElement) {
    console.log('UI connected');
    this.loadData();
    return new UIContext({ id: 'main-view', element });
  }
  
  // Modern approach with framework context
  connectWithContext(frameworkContext: { id: string, element?: HTMLElement }) {
    console.log('UI connected with context');
    this.loadData();
    return new UIContext(frameworkContext);
  }
  
  // Called when UI disconnects from controller
  disconnect() {
    console.log('UI disconnected');
  }
  
  // Called when controller is destroyed
  dispose() {
    console.log('Controller disposed');
  }
  
  // Register UI elements with the controller for automatic binding
  registerUI(context: UIContext) {
    const element = context.getElement();
    if (!element) return () => {};
    
    // Set up data bindings, event handlers, etc.
    // ...
    
    return () => {
      // Clean up code when UI is disconnected
    };
  }
  
  private loadData() {
    this.bindings.isLoading.set(true);
    
    // Simulate API call
    setTimeout(() => {
      this.bindings.data.set([1, 2, 3, 4, 5]);
      this.bindings.isLoading.set(false);
    }, 1000);
  }
}
```

These lifecycle methods give you fine-grained control over when to fetch data, set up resources, and clean up when done.

## UIContext System

The UIContext system allows a single controller to connect to multiple UI components simultaneously:

```typescript
import { LifecycleAwareController, UIContext, StandardBinding } from '@jmkcoder/uplink-protocol';

class MultiViewController implements LifecycleAwareController {
  bindings = {
    count: new StandardBinding(0)
  };
  
  // Store contexts for multiple UI connections
  private _uiContexts: Map<string, UIContext> = new Map();
  
  // Connect with a new UI component
  connectWithContext(frameworkContext: { id: string, element?: HTMLElement }) {
    const context = new UIContext(frameworkContext);
    
    // Store the context by ID
    this._uiContexts.set(context.id, context);
    
    // Initialize the context state
    context.updateState('count', this.bindings.count.current);
    
    // Set up subscription for this specific UI
    const unsubscribe = this.bindings.count.subscribe((newValue) => {
      context.updateState('count', newValue);
    });
    
    // Store the subscription with the context for cleanup
    context.addSubscription(unsubscribe);
    
    return context;
  }
  
  // Disconnect a specific UI
  disconnect(context: UIContext) {
    if (this._uiContexts.has(context.id)) {
      // Clean up context subscriptions
      context.dispose();
      this._uiContexts.delete(context.id);
    }
  }
  
  // Get all connected UIs
  getConnectedUIs() {
    return Array.from(this._uiContexts.values());
  }
  
  // Update all connected UIs
  updateAll() {
    const newCount = this.bindings.count.current + 1;
    this.bindings.count.set(newCount);
  }
}

// Usage example
const controller = new MultiViewController();

// Connect multiple UIs
const mainContext = controller.connectWithContext({ id: 'main-view', element: document.getElementById('main') });
const sidebarContext = controller.connectWithContext({ id: 'sidebar', element: document.getElementById('sidebar') });
const modalContext = controller.connectWithContext({ id: 'modal', element: document.getElementById('modal') });

// Later, disconnect a specific UI
controller.disconnect(modalContext);

// Update all remaining connected UIs
controller.updateAll();
```

This system is particularly useful for:
- Dashboards with multiple views of the same data
- Complex forms spread across multiple steps/screens
- Components that can appear in multiple contexts (e.g., in a list and in a modal)

## Batch Updates

When you need to update multiple bindings at once without triggering multiple UI updates, use batch updates:

```typescript
import { batchUpdates } from '@jmkcoder/uplink-protocol/utilities';

class FormController implements Controller {
  bindings = {
    name: new StandardBinding(''),
    email: new StandardBinding(''),
    age: new StandardBinding(0),
    isValid: new StandardBinding(false)
  };
  
  methods = {
    setUserData(userData) {
      // Without batching, this would trigger 4 separate UI updates
      batchUpdates(() => {
        this.bindings.name.set(userData.name);
        this.bindings.email.set(userData.email);
        this.bindings.age.set(userData.age);
        this.bindings.isValid.set(this.validate(userData));
      });
      // Only one UI update will be triggered after all changes are applied
    },
    
    resetForm() {
      batchUpdates(() => {
        this.bindings.name.set('');
        this.bindings.email.set('');
        this.bindings.age.set(0);
        this.bindings.isValid.set(false);
      });
    },
    
    validate(data) {
      return !!data.name && !!data.email && data.age > 0;
    }
  };
}
```

Batch updates are especially useful for:
- Loading data from an API and updating multiple fields at once
- Form resets or initializations
- Complex state transitions that affect multiple bindings

## Next Steps

1. Explore the [full documentation](../Odyssey%20Uplink%20Protocol.md) to learn more about the protocol
2. Check out the [integration examples](../src/services/integration/examples) for more advanced usage
3. Use the [migration script](../src/scripts/migrate-uplink.js) to update existing projects

---

Happy coding!
