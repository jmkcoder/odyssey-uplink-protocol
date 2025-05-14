## 6. Zero-Configuration Framework Integration

The Odyssey Uplink Protocol provides a zero-configuration approach to framework integration, allowing controllers to work seamlessly with any supported framework without requiring manual adapter setup or custom integration code.

### 6.1 Automatic Framework Detection

The protocol automatically detects which framework your application is using and sets up the appropriate adapter:

```ts
// Just import this at your app's entry point
import 'odyssey/uplink-auto-init';

// That's it! The protocol will auto-detect your framework and initialize everything
```

### 6.2 Framework-Specific APIs

Each supported framework provides a tailored API that feels native to that framework's patterns:

#### React Integration

```tsx
import { useUplink } from 'odyssey/services/integration';
import { CounterController } from './counter.controller';

function Counter() {
  // Fully typed integration with your controller
  const { state, methods, Container } = useUplink(new CounterController(), {
    trackBindings: 'all' // Automatically track all bindings
  });
  
  return (
    <Container onIncrement={(val) => console.log(`Count: ${val}`)}>
      <div>Count: {state.count}</div>
      <button onClick={methods.increment}>+</button>
      <button onClick={methods.decrement}>-</button>
    </Container>
  );
}
```

#### Vue Integration

```vue
<template>
  <div ref="containerRef">
    <div>Count: {{ state.count }}</div>
    <button @click="methods.increment">+</button>
    <button @click="methods.decrement">-</button>
  </div>
</template>

<script>
import { useUplink } from 'odyssey/services/integration';
import { CounterController } from './counter.controller';

export default {
  setup() {
    const { state, methods, containerRef } = useUplink(new CounterController());
    return { state, methods, containerRef };
  }
}
</script>
```

#### Angular Integration

```typescript
import { Component } from '@angular/core';
import { CounterController } from './counter.controller';

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

#### Svelte Integration

```svelte
<script>
  import { useUplink } from 'odyssey/services/integration';
  import { CounterController } from './counter.controller';
  
  const { state, methods, element } = useUplink(new CounterController());
</script>

<div bind:this={$element}>
  <div>Count: {$state.count}</div>
  <button on:click={methods.increment}>+</button>
  <button on:click={methods.decrement}>-</button>
</div>
```

### 6.3 Controller Factory for Dependency Management

For applications that use dependency injection or need to manage controller lifecycles, the protocol provides a factory system:

```ts
import { getControllerFactory, UplinkController } from 'odyssey/uplink';

// Register a controller with dependencies
@UplinkController('counter')
class CounterController implements Controller {
  constructor(private apiService: ApiService) {
    // Dependencies injected
  }
  // ...
}

// Custom factory registration for more complex scenarios
getControllerFactory().register('userDashboard', () => {
  const authService = getAuthService();
  const dataService = getDataService();
  return new UserDashboardController(authService, dataService);
});

// Then in components, get by name:
const { state, methods } = useUplink('counter');
```

### 6.4 TypeScript Integration

The protocol provides strong TypeScript typing for an improved development experience:

```ts
import { TypedController } from 'odyssey/uplink';

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

// Fully typed controller implementation
class CounterController implements TypedController<CounterBindings, CounterMethods, CounterEvents> {
  bindings = {
    count: new StandardBinding(0),
    isEven: new StandardBinding(true)
  };
  
  methods = {
    increment: () => { /* implementation */ },
    decrement: () => { /* implementation */ },
    reset: () => { /* implementation */ }
  };
  
  events = {
    increment: new EventEmitter<number>(),
    decrement: new EventEmitter<number>()
  };
}

// In React, everything is fully typed
const { state, methods, Container } = useUplink(new CounterController());
// state.count is typed as number
// methods.increment is typed as () => void
// Container accepts onIncrement prop that expects (value: number) => void
```

By providing zero-configuration integration, the Odyssey Uplink Protocol makes it exceptionally easy to write truly framework-agnostic code while still benefiting from the native patterns and developer experience of each supported framework.
