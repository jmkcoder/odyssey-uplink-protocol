# Uplink Protocol TypeScript Usage Guide

This guide shows how to use TypeScript effectively with the Uplink Protocol to get the best development experience with strong typing.

## TypedController Interface

The TypedController interface extends the base Controller interface to provide strong typing for bindings, methods, and events:

```typescript
import { TypedController, Binding, EventEmitter, StandardBinding } from '@uplink-protocol/core';

// Define your specific controller types
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

// Implement with strong typing
class CounterController implements TypedController<CounterBindings, CounterMethods, CounterEvents> {
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
```

## Helper Types

The Uplink Protocol includes several helper types to improve the development experience:

```typescript
/**
 * Helper type to extract the value type from a Binding
 */
type BindingValue<T extends Binding<any>> = T extends Binding<infer U> ? U : never;

/**
 * Helper type to extract the event data type from an EventEmitter
 */
type EventData<T extends EventEmitter<any>> = T extends EventEmitter<infer U> ? U : never;

/**
 * Helper type to create a state object type from a controller's bindings
 */
type ControllerState<T extends Controller> = {
  [K in keyof T['bindings']]: T['bindings'][K] extends Binding<infer U> ? U : never;
};

/**
 * Helper type to create an event handlers object type from a controller's events
 */
type ControllerEventHandlers<T extends Controller> = {
  [K in keyof T['events'] as `on${Capitalize<string & K>}`]?: 
    T['events'][K] extends EventEmitter<infer U> ? (data: U) => void : never;
};
```

## Framework Integration with TypeScript

### React Integration

```tsx
import { initializeReactAdapter, useUplink } from '@uplink-protocol/react';
import { CounterController } from './counter.controller';

// Initialize the adapter
initializeReactAdapter();

function Counter() {
  // Everything is fully typed
  const { state, methods, Container } = useUplink(new CounterController());
  
  // TypeScript knows:
  // - state.count is a number
  // - state.isEven is a boolean
  // - methods.increment is a function
  // - Container accepts onIncrement and onDecrement props
  
  return (
    <Container 
      onIncrement={(value: number) => console.log(`Incremented to: ${value}`)}
      onDecrement={(value: number) => console.log(`Decremented to: ${value}`)}
    >
      <div>Count: {state.count}</div>
      <div>{state.isEven ? 'Even' : 'Odd'}</div>
      <button onClick={methods.increment}>+</button>
      <button onClick={methods.decrement}>-</button>
      <button onClick={methods.reset}>Reset</button>
    </Container>
  );
}
```

### Vanilla JS Integration

```typescript
import { initializeVanillaAdapter, useUplink } from '@uplink-protocol/core';
import { CounterController } from './counter.controller';

// Initialize the adapter
initializeVanillaAdapter();

// Everything is fully typed
const { state, methods, events, connect, disconnect } = useUplink(new CounterController());

// TypeScript knows:
// - state.count is a number
// - state.isEven is a boolean
// - methods.increment is a function
// - events.increment is an EventEmitter<number>

// connect expects a DOM element and event handlers with correct types
connect(document.getElementById('counter')!, {
  onIncrement: (value: number) => console.log(`Incremented to: ${value}`),
  onDecrement: (value: number) => console.log(`Decremented to: ${value}`)
});
```

## Advanced TypeScript Patterns

### Generic Controllers

```typescript
class DataController<T> implements TypedController {
  bindings = {
    data: new StandardBinding<T[]>([]),
    isLoading: new StandardBinding<boolean>(false),
    error: new StandardBinding<Error | null>(null)
  };
  
  methods = {
    fetchData: async () => {
      try {
        this.bindings.isLoading.set(true);
        const response = await fetch('/api/data');
        const data = await response.json() as T[];
        this.bindings.data.set(data);
      } catch (error) {
        this.bindings.error.set(error as Error);
      } finally {
        this.bindings.isLoading.set(false);
      }
    }
  };
}

// Usage with a specific type
const userController = new DataController<User>();
```

### Union Types for States

```typescript
type FormState = 'idle' | 'submitting' | 'success' | 'error';

class FormController implements TypedController {
  bindings = {
    state: new StandardBinding<FormState>('idle'),
    data: new StandardBinding<Record<string, any>>({})
  };
  
  methods = {
    setField: (name: string, value: any) => {
      this.bindings.data.set({
        ...this.bindings.data.current,
        [name]: value
      });
    },
    
    submit: async () => {
      this.bindings.state.set('submitting');
      try {
        await submitData(this.bindings.data.current);
        this.bindings.state.set('success');
      } catch (error) {
        this.bindings.state.set('error');
      }
    }
  };
}
```

### Type Guards for Event Data

```typescript
interface SuccessEvent {
  type: 'success';
  data: any;
}

interface ErrorEvent {
  type: 'error';
  error: Error;
}

type FormEvent = SuccessEvent | ErrorEvent;

class FormController implements TypedController {
  // ...
  
  events = {
    result: new EventEmitter<FormEvent>()
  };
  
  methods = {
    // ...
    
    submit: async () => {
      try {
        const data = await submitData(this.bindings.data.current);
        this.events.result.emit({ type: 'success', data });
      } catch (error) {
        this.events.result.emit({ type: 'error', error });
      }
    }
  };
}

// Usage with type guards
formController.events.result.subscribe(event => {
  if (event.type === 'success') {
    // TypeScript knows event.data exists
    console.log('Success:', event.data);
  } else {
    // TypeScript knows event.error exists
    console.error('Error:', event.error);
  }
});
```

## Declaration Files

The Uplink Protocol generates TypeScript declaration files (.d.ts) during the build process, which provide type information to your IDE and the TypeScript compiler.

### Project Configuration

```json
// tsconfig.declarations.json
{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "declaration": true,
    "declarationMap": true,
    "emitDeclarationOnly": true,
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src/**/*"],
  "exclude": ["**/__tests__/**/*", "node_modules"]
}
```
