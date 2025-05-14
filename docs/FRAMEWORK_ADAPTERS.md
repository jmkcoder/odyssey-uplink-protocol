# Framework Adapters for Odyssey Uplink Protocol

The Odyssey Uplink Protocol provides adapters for various JavaScript frameworks to enable seamless integration between your application and Odyssey controllers.

## Available Adapters

- **React Adapter** - For React applications
- **Vue Adapter** - For Vue applications
- **Angular Adapter** - For Angular applications
- **Svelte Adapter** - For Svelte applications
- **Vanilla Adapter** - For plain JavaScript applications without a framework

## Using the Adapters

### Setup

First, import and register the adapter for your framework:

```typescript
// Import the adapter registry and your preferred adapter
import { getAdapterRegistry, ReactAdapter, VueAdapter, AngularAdapter, SvelteAdapter, VanillaAdapter } from '@odyssey/uplink';

// Get the adapter registry singleton
const adapterRegistry = getAdapterRegistry();

// Register your framework adapter
// Only register the adapter(s) you need for your framework
adapterRegistry.registerAdapter(new ReactAdapter());
adapterRegistry.registerAdapter(new VueAdapter());
adapterRegistry.registerAdapter(new AngularAdapter());
adapterRegistry.registerAdapter(new SvelteAdapter());
adapterRegistry.registerAdapter(new VanillaAdapter());

// Optionally, set a specific adapter as the default
adapterRegistry.setDefaultAdapter('react'); // or 'vue', 'angular', 'svelte', 'vanilla'
```

### Framework-Specific Usage

#### React

```tsx
import React, { useEffect, useState } from 'react';
import { useController } from '@odyssey/uplink/react';

function MyComponent() {
  // Get a controller instance
  const controller = useController('my-controller');
  
  // Access controller properties
  const [value, setValue] = useState(controller.bindings.value.current);
  
  // Watch for property changes
  useEffect(() => {
    controller.bindings.value.subscribe(setValue);
    return () => {
      // Clean up subscription when component unmounts
    };
  }, [controller]);
  
  // Call controller methods
  const handleClick = () => {
    controller.methods.doSomething();
  };
  
  return (
    <div>
      <p>Value: {value}</p>
      <button onClick={handleClick}>Do Something</button>
    </div>
  );
}
```

#### Vue

```vue
<template>
  <div>
    <p>Value: {{ value }}</p>
    <button @click="handleClick">Do Something</button>
  </div>
</template>

<script>
import { useController } from '@odyssey/uplink/vue';

export default {
  setup() {
    // Get a controller instance
    const { controller, bindings } = useController('my-controller');
    
    // Access controller properties with Vue reactivity
    const value = bindings.value;
    
    // Call controller methods
    const handleClick = () => {
      controller.methods.doSomething();
    };
    
    return {
      value,
      handleClick
    };
  }
}
</script>
```

#### Angular

```typescript
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ControllerService } from '@odyssey/uplink/angular';

@Component({
  selector: 'app-my-component',
  template: `
    <div>
      <p>Value: {{ value }}</p>
      <button (click)="handleClick()">Do Something</button>
    </div>
  `
})
export class MyComponent implements OnInit, OnDestroy {
  value: any;
  private controller: any;
  private subscription: any;
  
  constructor(private controllerService: ControllerService) {}
  
  ngOnInit() {
    // Get a controller instance
    this.controller = this.controllerService.getController('my-controller');
    
    // Access controller properties
    this.value = this.controller.bindings.value.current;
    
    // Watch for property changes
    this.subscription = this.controller.bindings.value.subscribe(newValue => {
      this.value = newValue;
    });
  }
  
  ngOnDestroy() {
    // Clean up subscription when component is destroyed
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
  
  handleClick() {
    // Call controller methods
    this.controller.methods.doSomething();
  }
}
```

#### Svelte

```svelte
<script>
  import { getController } from '@odyssey/uplink/svelte';
  
  // Get a controller instance and its stores
  const { controller, stores } = getController('my-controller');
  
  // Access controller properties as Svelte stores
  const value = stores.value;
  
  // Call controller methods
  function handleClick() {
    controller.methods.doSomething();
  }
</script>

<div>
  <p>Value: {$value}</p>
  <button on:click={handleClick}>Do Something</button>
</div>
```

#### Vanilla JavaScript

```javascript
import { getController } from '@odyssey/uplink';

// Get a controller instance
const controller = getController('my-controller');

// Access controller properties
const value = controller.bindings.value.current;

// Watch for property changes
controller.bindings.value.subscribe(newValue => {
  document.getElementById('value-display').textContent = newValue;
});

// Call controller methods
document.getElementById('action-button').addEventListener('click', () => {
  controller.methods.doSomething();
});
```

## Auto-Detection

The Uplink Protocol can automatically detect which framework you're using and select the appropriate adapter. To use this feature, simply register all adapters you want to support and ensure auto-detection is enabled:

```typescript
import { getAdapterRegistry, ReactAdapter, VueAdapter, AngularAdapter, SvelteAdapter, VanillaAdapter } from '@odyssey/uplink';

const adapterRegistry = getAdapterRegistry();

// Register all adapters
adapterRegistry.registerAdapter(new ReactAdapter());
adapterRegistry.registerAdapter(new VueAdapter());
adapterRegistry.registerAdapter(new AngularAdapter());
adapterRegistry.registerAdapter(new SvelteAdapter());
adapterRegistry.registerAdapter(new VanillaAdapter());

// Enable auto-detection (enabled by default)
adapterRegistry.setAutoDetect(true);
```

When you connect a controller, the adapter registry will automatically determine which framework you're using and use the appropriate adapter.
