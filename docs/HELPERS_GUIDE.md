# Helper Functions for Uplink Protocol

The Uplink Protocol provides several helper functions that simplify common controller creation tasks. These functions help reduce boilerplate code and make your controllers more concise and readable.

## Creating Bindings

The `createBindings` function allows you to create multiple `StandardBinding` instances at once:

```typescript
import { createBindings } from '@uplink-protocol/core';

// Create multiple bindings with initial values
const bindings = createBindings({
  count: 0,
  name: 'User',
  isActive: true,
  items: []
});

// Access and update bindings as usual
console.log(bindings.count.current); // 0
bindings.count.set(5);
console.log(bindings.count.current); // 5

// Subscribe to changes
bindings.name.subscribe(newValue => {
  console.log(`Name changed to: ${newValue}`);
});
```

## Creating Event Emitters

The `createEventEmitters` function allows you to create multiple `EventEmitter` instances at once:

```typescript
import { createEventEmitters } from '@uplink-protocol/core';

// From array of names
const events = createEventEmitters(['change', 'submit', 'cancel']);

// Emit events
events.change.emit('value changed');
events.submit.emit(formData);

// Subscribe to events
events.cancel.subscribe(() => {
  console.log('Operation cancelled');
});
```

You can also create event emitters with type information:

```typescript
// Create typed event emitters
const typedEvents = createEventEmitters({
  increment: null,  // No specific type
  submit: {} as FormData,
  select: '' as string,
  valueChange: 0 as number
});

// TypeScript will enforce correct event data types
typedEvents.select.emit('option-1');
typedEvents.valueChange.emit(42);
```

## Using Helper Functions in Controllers

Using helper functions significantly reduces boilerplate code when creating controllers:

### Before:
```typescript
class CounterController implements TypedController {
  bindings = {
    count: new StandardBinding(0),
    isEven: new StandardBinding(true)
  };
  
  events = {
    increment: new EventEmitter<number>(),
    decrement: new EventEmitter<number>(),
    reset: new EventEmitter<number>()
  };
  
  methods = {
    // ...methods implementation...
  };
}
```

### After:
```typescript
class CounterController implements TypedController {
  bindings = createBindings({
    count: 0,
    isEven: true
  });
  
  events = createEventEmitters(['increment', 'decrement', 'reset']);
  
  methods = {
    // ...methods implementation...
  };
}
```

## Typed Controllers with Helper Functions

The helper functions work seamlessly with TypeScript and the `TypedController` interface:

```typescript
interface FormData {
  name: string;
  email: string;
  message: string;
}

class FormController implements TypedController {
  bindings = createBindings({
    name: '',
    email: '',
    message: '',
    isValid: false
  });
  
  events = createEventEmitters({
    submit: {} as FormData,
    validate: false as boolean,
    change: '' as string
  });
  
  methods = {
    setField: (field: string, value: string) => {
      if (field in this.bindings) {
        this.bindings[field].set(value);
        this.events.change.emit(field);
      }
    },
    
    submitForm: () => {
      const formData: FormData = {
        name: this.bindings.name.current,
        email: this.bindings.email.current,
        message: this.bindings.message.current
      };
      
      this.events.submit.emit(formData);
    }
  };
}
```
