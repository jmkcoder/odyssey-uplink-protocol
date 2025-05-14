# Odyssey Uplink Protocol - Zero Configuration Framework Integration

This guide explains how to use the zero-configuration framework integration feature of the Odyssey Uplink Protocol.

## Overview

The Odyssey Uplink Protocol now provides a zero-configuration approach to framework integration. This means you no longer need to manually register framework adapters or create custom hooks/components for each framework. The protocol automatically detects the framework environment and sets up the appropriate integration.

## Supported Frameworks

- React
- Vue
- Angular
- Svelte
- Vanilla JS (fallback)

## How It Works

1. When your application starts, the Uplink Protocol automatically detects which framework you're using
2. The appropriate adapter is registered automatically
3. Framework-specific integration utilities are provided with a consistent API
4. Your controllers work out-of-the-box with the detected framework

## Usage Examples

### React

```jsx
import { useUplink } from 'odyssey/services/integration';
import { CounterController } from './controllers/counter.controller';

function CounterComponent() {
  // All integration is handled automatically
  const { state, methods, Container } = useUplink(new CounterController(), {
    trackBindings: 'all' // Track all bindings (can also specify individual bindings)
  });

  return (
    <Container onIncrement={(val) => console.log(`Count increased to ${val}`)}>
      <div className="counter">
        <h2>Count: {state.count}</h2>
        <button onClick={methods.increment}>+</button>
        <button onClick={methods.decrement}>-</button>
      </div>
    </Container>
  );
}
```

### Vue

```vue
<template>
  <div ref="containerRef">
    <h2>Count: {{ state.count }}</h2>
    <button @click="methods.increment">+</button>
    <button @click="methods.decrement">-</button>
  </div>
</template>

<script>
import { useUplink } from 'odyssey/services/integration';
import { CounterController } from './controllers/counter.controller';

export default {
  setup() {
    const { state, methods, containerRef } = useUplink(new CounterController(), {
      trackBindings: 'all'
    });

    return {
      state,
      methods,
      containerRef
    };
  }
}
</script>
```

### Angular

```typescript
// counter.component.ts
import { Component } from '@angular/core';
import { CounterController } from './counter.controller';

@Component({
  selector: 'app-counter',
  template: `
    <uplink-container [controller]="controller" (increment)="onIncrement($event)">
      <ng-template let-state="state" let-methods="methods">
        <h2>Count: {{ state.count }}</h2>
        <button (click)="methods.increment()">+</button>
        <button (click)="methods.decrement()">-</button>
      </ng-template>
    </uplink-container>
  `
})
export class CounterComponent {
  controller = new CounterController();
  
  onIncrement(value) {
    console.log(`Count increased to ${value}`);
  }
}
```

```typescript
// app.module.ts
import { NgModule } from '@angular/core';
import { UplinkModule } from 'odyssey/services/integration';
import { CounterComponent } from './counter.component';

@NgModule({
  imports: [UplinkModule],
  declarations: [CounterComponent],
  exports: [CounterComponent]
})
export class AppModule {}
```

### Svelte

```svelte
<script>
  import { useUplink } from 'odyssey/services/integration';
  import { CounterController } from './counter.controller';
  
  const { state, methods, element } = useUplink(new CounterController());
</script>

<div bind:this={$element}>
  <h2>Count: {$state.count}</h2>
  <button on:click={methods.increment}>+</button>
  <button on:click={methods.decrement}>-</button>
</div>
```

Or using the component approach:

```svelte
<script>
  import { UplinkContainer } from 'odyssey/services/integration';
  import { CounterController } from './counter.controller';
  
  const controller = new CounterController();
  
  function handleIncrement(event) {
    console.log(`Count increased to ${event.detail}`);
  }
</script>

<UplinkContainer {controller} let:state let:methods on:increment={handleIncrement}>
  <h2>Count: {state.count}</h2>
  <button on:click={methods.increment}>+</button>
  <button on:click={methods.decrement}>-</button>
</UplinkContainer>
```

## Advanced Configuration

While the zero-configuration approach works in most cases, you can still customize the integration if needed:

```typescript
import { autoInitializeAdapter, setDefaultAdapter } from 'odyssey/services/integration';

// Force initialization (normally happens automatically)
autoInitializeAdapter();

// Override the default adapter if needed
setDefaultAdapter('react');

// For SSR applications, you might need to explicitly initialize on the client-side
if (typeof window !== 'undefined') {
  autoInitializeAdapter();
}
```

## TypeScript Integration

The Uplink Protocol provides excellent TypeScript support with the `TypedController` interface, enabling fully typed controllers and framework integrations.

### Creating Typed Controllers

```typescript
// Import the TypedController interface
import { TypedController, Binding, EventEmitter, StandardBinding } from "odyssey/uplink";

// Define the types for bindings, methods, and events
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
  reset: EventEmitter<void>;
}

// Implement a fully typed controller
export class TypedCounterController implements TypedController<CounterBindings, CounterMethods, CounterEvents> {
  bindings: CounterBindings = {
    count: new StandardBinding<number>(0),
    isEven: new StandardBinding<boolean>(true)
  };
  
  methods: CounterMethods = {
    increment: () => { /* implementation */ },
    decrement: () => { /* implementation */ },
    reset: () => { /* implementation */ }
  };
  
  events: CounterEvents = {
    increment: new EventEmitter<number>(),
    reset: new EventEmitter<void>()
  };
}
```

### Using Typed Controllers in Frameworks

When using typed controllers with the framework integration hooks, you get full type safety:

```tsx
// React example with typed controller
const { state, methods, Container } = useUplink(new TypedCounterController());

// state.count - TypeScript knows this is a number
// methods.increment - TypeScript knows this is a function with no parameters
// Container accepts onIncrement prop that expects (value: number) => void
```

## Examples

For complete working examples, see:

- [`examples/typed-react-counter.tsx`](./examples/typed-react-counter.tsx) - React implementation
- [`examples/typed-vue-counter.vue`](./examples/typed-vue-counter.vue) - Vue implementation
- [`examples/typed-angular-counter.component.ts`](./examples/typed-angular-counter.component.ts) - Angular implementation
- [`examples/typed-counter.controller.ts`](./examples/typed-counter.controller.ts) - Shared typed controller

## Best Practices

1. **Controller Creation**: Create controllers outside component render/setup functions to avoid recreation on re-renders
2. **Tracked Bindings**: Specify which bindings to track for better performance or use `'all'` for convenience
3. **Event Handling**: Use the framework's native event handling mechanisms as shown in the examples
4. **Container Usage**: Always use the provided Container component (React/Svelte) or directive (Angular) or ref (Vue) to ensure proper event propagation
5. **TypeScript**: Use the `TypedController` interface for full type safety throughout your application

## Conclusion

The zero-configuration approach makes it seamless to use the Odyssey Uplink Protocol with your preferred framework. Your controllers remain framework-agnostic, while the integration layer automatically adapts to your environment.
