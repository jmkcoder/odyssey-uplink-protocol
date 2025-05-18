# Uplink Protocol Feature Guide

This guide provides an overview of the main features of the Uplink Protocol and how to use them in your applications.

## Core Features

### Controllers

Controllers are the central component of the Uplink Protocol. They encapsulate business logic and state management, independent of any UI framework.

```typescript
class CounterController {
  bindings = {
    count: new StandardBinding(0)
  };
  
  methods = {
    increment: () => {
      this.bindings.count.set(this.bindings.count.current + 1);
    },
    
    decrement: () => {
      this.bindings.count.set(this.bindings.count.current - 1);
    },
    
    reset: () => {
      this.bindings.count.set(0);
    }
  };
}
```

### Bindings

Bindings are reactive state containers with subscription capabilities. They provide a way to track and update state values.

```typescript
// Create a binding with an initial value
const countBinding = new StandardBinding(0);

// Get the current value
const currentCount = countBinding.current;

// Update the value
countBinding.set(5);

// Subscribe to changes
const unsubscribe = countBinding.subscribe(newValue => {
  console.log(`Count changed to: ${newValue}`);
});

// Later, unsubscribe to prevent memory leaks
unsubscribe();
```

### Event Emitters

Event emitters provide a way for controllers to notify about state changes, operations completion, or other important events.

```typescript
class FormController {
  bindings = {
    formData: new StandardBinding({})
  };
  
  events = {
    submit: new EventEmitter<any>(),
    validate: new EventEmitter<boolean>()
  };
  
  methods = {
    submitForm: () => {
      const data = this.bindings.formData.current;
      this.events.submit.emit(data);
    }
  };
}

// Subscribe to events
formController.events.submit.subscribe(formData => {
  console.log('Form submitted:', formData);
});
```

## Framework Integration

The Uplink Protocol provides integration with various frameworks:

### Vanilla JavaScript

```javascript
import { initializeVanillaAdapter, useUplink } from '@uplink-protocol/core';

// Initialize the adapter
initializeVanillaAdapter();

// Use the controller with vanilla JS
const { state, methods, connect } = useUplink(new CounterController());

// Connect to a DOM element
const element = document.getElementById('counter');
connect(element, {
  onIncrement: (value) => {
    console.log(`Counter incremented to: ${value}`);
  }
});
```

### React Integration

```jsx
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

## Advanced Features

### Two-Way Binding

Two-way binding allows changes to flow both from controller to UI and from UI back to the controller:

```javascript
// In vanilla JS
const formElement = document.getElementById('form');
const nameInput = document.getElementById('name');

// From controller to UI
controller.bindings.name.subscribe(value => {
  nameInput.value = value;
});

// From UI to controller
nameInput.addEventListener('input', event => {
  controller.bindings.name.set(event.target.value);
});
```

### Custom Elements Integration

```javascript
import { defineControllerElement } from '@uplink-protocol/core';
import { CounterController } from './counter.controller';

// Define a custom element
defineControllerElement('counter-component', new CounterController(), {
  template: `
    <div class="counter">
      <span>Count: <span class="count">0</span></span>
      <button id="increment-btn">+</button>
      <button id="reset-btn">Reset</button>
    </div>
  `,
  onConnected: (element, controller) => {
    // Set up event handlers
    element.querySelector('#increment-btn').addEventListener('click', controller.methods.increment);
    element.querySelector('#reset-btn').addEventListener('click', controller.methods.reset);
    
    // Update UI when binding changes
    controller.bindings.count.subscribe(value => {
      element.querySelector('.count').textContent = value;
    });
  }
});

// Usage in HTML:
// <counter-component></counter-component>
```

## Best Practices

1. **Keep controllers focused**: Each controller should handle one specific part of your application logic.
2. **Use TypedController interface**: For better type safety and development experience.
3. **Clean up subscriptions**: Always store and clean up subscription references to prevent memory leaks.
4. **Initialize adapters early**: Call the initialization functions at your application's entry point.
5. **Use framework-specific hooks**: When working with a specific framework, use the dedicated hooks for better integration.
