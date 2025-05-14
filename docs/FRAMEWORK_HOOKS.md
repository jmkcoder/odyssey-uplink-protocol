# Framework Integration Hooks for Odyssey Uplink Protocol

The Odyssey Uplink Protocol provides framework-specific hooks and integrations for all major JavaScript frameworks, making it easy to use controllers with your preferred UI library.

## Available Framework Integrations

### React: `useUplink`

```tsx
import { useUplink } from '@odyssey/uplink/react';
import CounterController from './controllers/counter-controller';

const MyComponent = () => {
  // Initialize with a controller instance, factory function, or controller name
  const { state, methods, Container } = useUplink(new CounterController());
  
  return (
    <Container onIncrement={(val) => console.log(`Counter: ${val}`)}>
      <div>Count: {state.count}</div>
      <button onClick={methods.increment}>+</button>
    </Container>
  );
};
```

### Vue: `useUplink`

```vue
<template>
  <Container>
    <div>Count: {{ state.count }}</div>
    <button @click="methods.increment">+</button>
  </Container>
</template>

<script>
import { useUplink } from '@odyssey/uplink/vue';
import CounterController from './controllers/counter-controller';

export default {
  setup() {
    const { state, methods, Container } = useUplink(new CounterController());
    return { state, methods, Container };
  }
}
</script>
```

### Angular: `useController`

First, set up the Angular module in your application:

```typescript
import { NgModule } from '@angular/core';
import { UplinkControllerDirective, ControllerService } from '@odyssey/uplink/angular';
import { autoInitializeAdapter } from '@odyssey/uplink/auto-detect';

@NgModule({
  declarations: [UplinkControllerDirective],
  exports: [UplinkControllerDirective],
  providers: [ControllerService]
})
export class UplinkModule {
  constructor() {
    // Auto-initialize the adapter
    autoInitializeAdapter();
  }
}

// Import this module in your app module
@NgModule({
  imports: [UplinkModule]
})
export class AppModule { }
```

Then use the controller in your components:

```typescript
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { useController, ControllerService } from '@odyssey/uplink/angular';
import { CounterController } from './controllers/counter.controller';

@Component({
  selector: 'app-counter',
  template: `
    <div>Count: {{ count }}</div>
    <button (click)="increment()">+</button>
  `
})
export class CounterComponent implements OnInit {
  count = 0;
  private controller: CounterController;
  
  constructor(
    private controllerService: ControllerService,
    private cdr: ChangeDetectorRef
  ) {
    // Pass the component instance to bind properties automatically
    this.controller = useController(new CounterController(), this);
  }
  
  increment(): void {
    this.controller.methods.increment();
  }
}
```

### Svelte: `getController`

```svelte
<script>
  import { getController, connectElement } from '@odyssey/uplink/svelte';
  import CounterController from './controllers/counter-controller';
  
  // Get controller with reactive stores
  const { controller, stores, methods } = getController(new CounterController());
  
  // Access store values with $-prefix
  $: count = $stores.count;
</script>

<div use:connectElement={controller}>
  <div>Count: {count}</div>
  <button on:click={methods.increment}>+</button>
</div>
```

## Framework Agnostic Access

You can also use the framework-agnostic `getFrameworkHook()` function to get the appropriate hook for the current framework:

```typescript
import { getFrameworkHook } from '@odyssey/uplink';

// This will return useUplink, useController, or getController based on the current framework
const useController = getFrameworkHook();

// Use the hook appropriate for the current framework
const { state, methods } = useController(new MyController());
```

This is useful for building libraries that work with multiple frameworks.

## How Adapters and Hooks Work Together

The Odyssey Uplink Protocol integrates with UI frameworks at two levels:

1. **Adapter Level** - Low-level integration with framework internals:
   - Adapters handle the mechanics of connecting controllers to the DOM
   - They translate between controller events and framework-specific events
   - They integrate with framework-specific reactivity systems
   - They ensure proper cleanup when components unmount

2. **Hook Level** - High-level developer API:
   - Hooks provide a framework-idiomatic way to use controllers
   - They automatically handle subscription management
   - They expose state in a framework-appropriate way (React state, Vue refs, Svelte stores, etc.)
   - They return appropriate components/directives for integrating with templates

This two-level approach ensures both deep framework integration and a developer-friendly API.

```
┌───────────────────┐     ┌──────────────────┐     ┌─────────────┐
│ Framework Hooks   │     │ Uplink Protocol  │     │ UI Framework│
│ (useUplink, etc.) ├────►│ Core & Adapters  ├────►│ (React, etc)│
└───────────────────┘     └──────────────────┘     └─────────────┘
        ^                          ^                      ^
        │                          │                      │
        └──────────────────────────┴──────────────────────┘
                       Two-way integration
```

## Auto-Detection

The Odyssey Uplink Protocol automatically detects which framework you're using and applies the appropriate adapter:

- React detection: Checks for `React` global object or React DevTools
- Vue detection: Checks for `Vue` global object or elements with `data-v-app` attribute
- Angular detection: Checks for `ng` or `angular` global objects or elements with `ng-version` attribute
- Svelte detection: Checks for `__SVELTE__` global object or Svelte hook elements

This makes it easy to use the Uplink Protocol in any project without manual configuration.
