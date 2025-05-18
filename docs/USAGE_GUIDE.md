# Uplink Protocol Usage Guide

This guide provides practical examples and patterns for using the Uplink Protocol in your applications.

## Getting Started

### Installation

```bash
# Install the core package
npm install @uplink-protocol/core

# Install framework-specific package (if needed)
npm install @uplink-protocol/react
# or
npm install @uplink-protocol/vue
# or
npm install @uplink-protocol/angular
# or
npm install @uplink-protocol/svelte
```

### Initialization

Initialize the appropriate adapter for your framework at your application's entry point:

```javascript
// For vanilla JavaScript
import { initializeVanillaAdapter } from '@uplink-protocol/core';
initializeVanillaAdapter();

// For React
import { initializeReactAdapter } from '@uplink-protocol/react';
initializeReactAdapter();

// Similar for other frameworks
```

## Creating Controllers

Controllers in the Uplink Protocol consist of bindings, methods, and events:

```javascript
import { StandardBinding, EventEmitter } from '@uplink-protocol/core';

class CounterController {
  constructor() {
    // Bindings hold reactive state
    this.bindings = {
      count: new StandardBinding(0),
      isEven: new StandardBinding(true)
    };
    
    // Methods define controller behavior
    this.methods = {
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
    
    // Events for notifying external systems
    this.events = {
      increment: new EventEmitter(),
      decrement: new EventEmitter()
    };
  }
}
```

## Using Controllers with Different Frameworks

### Vanilla JavaScript

```javascript
import { initializeVanillaAdapter, useUplink } from '@uplink-protocol/core';
import { CounterController } from './counter.controller';

// Initialize the adapter
initializeVanillaAdapter();

// Create controller instance
const counterController = new CounterController();

// Use the hook-like API
const { state, methods, connect, disconnect } = useUplink(counterController, {
  trackBindings: 'all'  // Track all bindings for reactive updates
});

// Create UI elements
const container = document.createElement('div');
const countDisplay = document.createElement('div');
const incrementButton = document.createElement('button');
const decrementButton = document.createElement('button');
const resetButton = document.createElement('button');

// Set up UI
incrementButton.textContent = '+';
decrementButton.textContent = '-';
resetButton.textContent = 'Reset';

// Add event listeners
incrementButton.addEventListener('click', methods.increment);
decrementButton.addEventListener('click', methods.decrement);
resetButton.addEventListener('click', methods.reset);

// Set initial value
countDisplay.textContent = `Count: ${state.count}`;

// Assemble UI
container.appendChild(countDisplay);
container.appendChild(incrementButton);
container.appendChild(decrementButton);
container.appendChild(resetButton);
document.body.appendChild(container);

// Connect controller to element with event handlers
const cleanup = connect(container, {
  onIncrement: (val) => {
    console.log(`Counter incremented to: ${val}`);
    countDisplay.textContent = `Count: ${val}`;
  },
  onDecrement: (val) => {
    console.log(`Counter decremented to: ${val}`);
    countDisplay.textContent = `Count: ${val}`;
  }
});

// When done, disconnect and clean up
// cleanup();
```

### React Integration

```jsx
import React from 'react';
import { initializeReactAdapter, useUplink } from '@uplink-protocol/react';
import { CounterController } from './counter.controller';

// Initialize the adapter
initializeReactAdapter();

function Counter() {
  // useUplink hook integrates the controller with React
  const { state, methods, Container } = useUplink(new CounterController());
  
  return (
    <Container 
      onIncrement={(value) => console.log(`Incremented to: ${value}`)}
      onDecrement={(value) => console.log(`Decremented to: ${value}`)}
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

## Advanced Usage Patterns

### Reusing Controllers

Controllers can be shared across multiple components:

```javascript
// Create a singleton controller
const sharedCounterController = new CounterController();

// Use in multiple components
function CounterDisplay() {
  const { state } = useUplink(sharedCounterController);
  return <div>Count: {state.count}</div>;
}

function CounterButtons() {
  const { methods } = useUplink(sharedCounterController);
  return (
    <div>
      <button onClick={methods.increment}>+</button>
      <button onClick={methods.decrement}>-</button>
    </div>
  );
}
```

### Controller Factory

For more complex applications, use a controller factory:

```javascript
import { getControllerFactory } from '@uplink-protocol/core';

// Register a controller with the factory
getControllerFactory().register('counter', () => {
  return new CounterController();
});

// Later, get the controller by name
function CounterComponent() {
  const { state, methods } = useUplink('counter');
  // ...
}
```

### Controller Composition

Create complex controllers by composing simpler ones:

```javascript
class CompositeController {
  constructor() {
    // Create sub-controllers
    this.counterController = new CounterController();
    this.timerController = new TimerController();
    
    // Expose combined bindings
    this.bindings = {
      count: this.counterController.bindings.count,
      time: this.timerController.bindings.time,
      isRunning: this.timerController.bindings.isRunning
    };
    
    // Expose combined methods
    this.methods = {
      increment: this.counterController.methods.increment,
      startTimer: this.timerController.methods.start,
      stopTimer: this.timerController.methods.stop
    };
    
    // Expose combined events
    this.events = {
      increment: this.counterController.events.increment,
      timerTick: this.timerController.events.tick
    };
  }
}
```

### Two-Way Binding with Form Inputs

```jsx
import React from 'react';
import { initializeReactAdapter, useUplink } from '@uplink-protocol/react';

class FormController {
  constructor() {
    this.bindings = {
      name: new StandardBinding(''),
      email: new StandardBinding(''),
      message: new StandardBinding('')
    };
    
    this.methods = {
      setField: (field, value) => {
        this.bindings[field].set(value);
      },
      
      submit: () => {
        console.log('Form data:', {
          name: this.bindings.name.current,
          email: this.bindings.email.current,
          message: this.bindings.message.current
        });
      }
    };
  }
}

// Initialize the adapter
initializeReactAdapter();

function ContactForm() {
  const { state, methods } = useUplink(new FormController());
  
  return (
    <form onSubmit={(e) => { e.preventDefault(); methods.submit(); }}>
      <div>
        <label>Name:</label>
        <input
          type="text"
          value={state.name}
          onChange={(e) => methods.setField('name', e.target.value)}
        />
      </div>
      <div>
        <label>Email:</label>
        <input
          type="email"
          value={state.email}
          onChange={(e) => methods.setField('email', e.target.value)}
        />
      </div>
      <div>
        <label>Message:</label>
        <textarea
          value={state.message}
          onChange={(e) => methods.setField('message', e.target.value)}
        />
      </div>
      <button type="submit">Send</button>
    </form>
  );
}
```

## Testing Controllers

Controllers are easy to test in isolation from UI components:

```javascript
import { CounterController } from './counter.controller';

describe('CounterController', () => {
  let controller;
  
  beforeEach(() => {
    controller = new CounterController();
  });
  
  test('should initialize with count 0', () => {
    expect(controller.bindings.count.current).toBe(0);
  });
  
  test('should increment count', () => {
    controller.methods.increment();
    expect(controller.bindings.count.current).toBe(1);
  });
  
  test('should emit event when incremented', () => {
    const mockCallback = jest.fn();
    controller.events.increment.subscribe(mockCallback);
    
    controller.methods.increment();
    
    expect(mockCallback).toHaveBeenCalledWith(1);
  });
  
  test('should update isEven binding correctly', () => {
    // Initially true for 0
    expect(controller.bindings.isEven.current).toBe(true);
    
    // After increment, should be false for 1
    controller.methods.increment();
    expect(controller.bindings.isEven.current).toBe(false);
    
    // After another increment, should be true for 2
    controller.methods.increment();
    expect(controller.bindings.isEven.current).toBe(true);
  });
});
```

## Performance Optimization

### Managing Subscriptions

Always clean up subscriptions to prevent memory leaks:

```javascript
// Store subscription references
const subscriptions = [];

subscriptions.push(
  controller.bindings.count.subscribe(value => {
    console.log('Count changed:', value);
  })
);

// Clean up when done
subscriptions.forEach(unsubscribe => unsubscribe());
```

### Minimizing Binding Updates

Only update bindings when values actually change:

```javascript
// BAD - Updates binding every time even if value is the same
function handleInput(e) {
  controller.bindings.input.set(e.target.value);
}

// GOOD - Only updates if value has changed
function handleInput(e) {
  const newValue = e.target.value;
  if (controller.bindings.input.current !== newValue) {
    controller.bindings.input.set(newValue);
  }
}
```

### Using Computed Bindings Efficiently

For derived values, use computed bindings:

```javascript
import { computed } from '@uplink-protocol/core';

class UserController {
  constructor() {
    this.bindings = {
      firstName: new StandardBinding(''),
      lastName: new StandardBinding(''),
      
      // Computed binding that updates when dependencies change
      fullName: computed(() => {
        return `${this.bindings.firstName.current} ${this.bindings.lastName.current}`.trim();
      }, [this.bindings.firstName, this.bindings.lastName])
    };
  }
}
```
