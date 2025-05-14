# Odyssey Uplink Protocol Specification (v0.3)

A universal frontend protocol for decoupling UI and logic.

---

## Table of Contents

1. [Core Principles](#1-core-principles)
2. [Protocol Components](#2-protocol-components)
   - [Controller](#21-controller)
   - [Binding](#22-binding)
   - [EventEmitter](#23-eventemitter)
   - [Computed Binding](#24-computed-binding)
   - [TypedController Interface](#25-typedcontroller-interface)
3. [Lifecycle Management](#3-lifecycle-management)
   - [Basic Lifecycle](#31-basic-lifecycle)
   - [Controller Instantiation Patterns](#32-controller-instantiation-patterns)
   - [UIContext System](#33-uicontext-system)
4. [Rendering Integration](#4-rendering-integration)
   - [Web Components Integration](#41-web-components-integration)
   - [Framework Integration](#42-framework-integration)
5. [Adapters](#5-adapters)
   - [Framework Adapters](#51-framework-adapters)
   - [Controller Adapter](#52-controller-adapter)
   - [Vanilla JS Usage](#53-vanilla-js-usage)
   - [Two-Way Binding](#54-two-way-binding)
6. [Zero-Configuration Framework Integration](#6-zero-configuration-framework-integration)
   - [Automatic Framework Detection](#61-automatic-framework-detection)
   - [Framework-Specific APIs](#62-framework-specific-apis)
   - [Controller Factory](#63-controller-factory-for-dependency-management)
   - [TypeScript Integration](#64-typescript-integration)
7. [Testing Controllers](#7-testing-controllers)
8. [Example Implementation](#8-example-implementation)
9. [Roadmap](#9-roadmap)
10. [Conclusion](#10-conclusion)

---

## 1. Core Principles

- **Decoupled Logic & UI**: Controllers manage state, UI handles rendering.
- **Universal Reactivity**: Framework-agnostic state updates.
- **Logic Portability**: Write once, render anywhere approach.
- **Uplink Interface**: Clear API contract between controllers and UI components.
- **Style-Free by Default**: Presentation concerns managed by the UI layer.
- **Testing-First**: Designed for testability from the ground up.

---

## 2. Protocol Components

### 2.1 Controller

Controllers are the core logic containers in the Uplink Protocol. They manage state, expose methods, and emit events - all while remaining completely detached from any UI implementation.

```ts
interface Controller {
  bindings: Record<string, Binding<any>>;
  methods?: Record<string, (...args: any[]) => any>;
  events?: Record<string, EventEmitter<any>>;
  meta?: ControllerMetadata;
  __adapter?: ControllerAdapter; // Reference to the controller's adapter
}
```

**Implementation Example:**

```ts
class DatePickerController implements Controller {
  bindings = {
    selectedDate: new Binding<Date>(new Date()),
    isCalendarOpen: new Binding<boolean>(false),
    calendarView: new Binding<'month' | 'year'>('month')
  };
  
  methods = {
    toggleCalendar: () => {
      this.bindings.isCalendarOpen.set(!this.bindings.isCalendarOpen.current);
    },
    
    setDate: (date: Date) => {
      this.bindings.selectedDate.set(date);
      this.events.dateSelected.emit(date);
    },
    
    nextMonth: () => {
      const current = this.bindings.selectedDate.current;
      const next = new Date(current);
      next.setMonth(current.getMonth() + 1);
      this.bindings.selectedDate.set(next);
    },
    
    previousMonth: () => {
      const current = this.bindings.selectedDate.current;
      const prev = new Date(current);
      prev.setMonth(current.getMonth() - 1);
      this.bindings.selectedDate.set(prev);
    },

    setCustomRenderer: (renderer: CalendarRenderer) => {
      this.customRenderer = renderer;
    },

    clearCustomRenderer: () => {
      this.customRenderer = undefined;
    }
  };
  
  events = {
    dateSelected: new EventEmitter<Date>()
  };

  private customRenderer?: CalendarRenderer;

  private renderDaysTemplate(calendarDays: Array<any>): string {
    if (this.customRenderer?.daysRenderer) {
      return this.customRenderer.daysRenderer(calendarDays, this);
    }
    // Default rendering logic
    return calendarDays.map(day => `<div>${day.date.getDate()}</div>`).join('');
  }
}
```

### 2.2 Binding

Bindings are reactive state containers with subscription capabilities. They serve as the communication channel from controllers to UI components.

```ts
interface Binding<T> {
  current: T;
  set(value: T): void;
  subscribe(callback: (value: T) => void): Unsubscribe;
}
```

**Implementation Example:**

```ts
class Binding<T> {
  private _value: T;
  private subscribers: Array<(value: T) => void> = [];
  
  constructor(initialValue: T) {
    this._value = initialValue;
  }
  
  get current(): T {
    return this._value;
  }
  
  set(value: T): void {
    if (this._value === value) return; // Simple equality check
    this._value = value;
    this.notifySubscribers();
  }
  
  subscribe(callback: (value: T) => void): () => void {
    this.subscribers.push(callback);
    // Return unsubscribe function
    return () => {
      this.subscribers = this.subscribers.filter(sub => sub !== callback);
    };
  }
  
  private notifySubscribers(): void {
    for (const subscriber of this.subscribers) {
      subscriber(this._value);
    }
  }
}
```

### 2.3 EventEmitter

EventEmitters provide a way for controllers to notify about state changes, operations completion, or other important events.

```ts
class EventEmitter<T> {
  emit(value: T): void;
  subscribe(callback: (value: T) => void): Unsubscribe;
  connectToAdapter?(controller: Controller, eventName: string): void;
}
```

**Implementation Example:**

```ts
class EventEmitter<T> {
  private listeners: Array<(value: T) => void> = [];
  private adapter?: ControllerAdapter;
  private eventName?: string;
  
  emit(value: T): void {
    // Notify all direct listeners
    this.listeners.forEach(listener => listener(value));
    
    // If connected to an adapter, notify it as well
    if (this.adapter && this.eventName) {
      this.adapter.emitEvent(this.eventName, value);
    }
  }
  
  subscribe(callback: (value: T) => void): () => void {
    this.listeners.push(callback);
    // Return unsubscribe function
    return () => {
      this.listeners = this.listeners.filter(sub => sub !== callback);
    };
  }
  
  // Alias for subscribe to match earlier documentation
  on(callback: (value: T) => void): () => void {
    return this.subscribe(callback);
  }
  
  // Connect this event emitter to a controller and its adapter
  connectToAdapter(controller: Controller, eventName: string): void {
    this.eventName = eventName;
    this.adapter = controller.__adapter;
  }
  
  // Optional: Emit event once and then remove subscriber
  once(callback: (value: T) => void): () => void {
    const wrappedCallback = (value: T) => {
      callback(value);
      unsub();
    };
    const unsub = this.on(wrappedCallback);
    return unsub;
  }
}
```

### 2.4 Computed Binding

Computed bindings derive their values from other bindings, automatically updating when dependencies change.

```ts
function computed<T>(deriveFn: () => T): Binding<T>;
```

**Implementation Example:**

```ts
// Simple implementation of computed binding
function computed<T>(deriveFn: () => T): Binding<T> {
  const binding = new Binding<T>(deriveFn());
  
  // In a real implementation, this would track and subscribe
  // to dependencies automatically
  
  return binding;
}
```

### 2.5 TypedController Interface

The TypedController interface extends the base Controller interface to provide strong typing for bindings, methods, and events. This interface is particularly useful when working with TypeScript to ensure type safety throughout your application.

```ts
interface TypedController<
  TBindings extends Record<string, Binding<any>> = Record<string, Binding<any>>,
  TMethods extends Record<string, (...args: any[]) => any> = Record<string, (...args: any[]) => any>,
  TEvents extends Record<string, EventEmitter<any>> = Record<string, EventEmitter<any>>
> extends Controller {
  bindings: TBindings;
  methods?: TMethods;
  events?: TEvents;
}
```

The TypedController interface includes several helper types to improve the development experience:

```ts
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

**Implementation Example:**

```ts
// Define specific types for a counter controller
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
    // Other methods...
  };
  
  events = {
    increment: new EventEmitter<number>(),
    decrement: new EventEmitter<number>()
  };
}

// Usage in framework integration
function useTypedController<T extends TypedController>(controller: T) {
  // state is fully typed based on controller's bindings
  const state: ControllerState<T>;
  
  // methods are fully typed based on controller's methods
  const methods: T['methods'];
  
  // Can generate event handler props like onIncrement
  const eventHandlers: ControllerEventHandlers<T>;
  
  return { state, methods, eventHandlers };
}
```

Using TypedController provides several benefits:
- Compiler-enforced type safety
- Improved IDE autocomplete and intellisense
- Better refactoring support
- Runtime type safety when integrating with frameworks

---

## 3. Lifecycle Management

Controllers in the Uplink Protocol follow specific lifecycle patterns to ensure proper resource management and state handling:

### 3.1 Basic Lifecycle

```ts
interface LifecycleAwareController extends Controller {
  initialize?(): void | Promise<void>;  // Called when controller is created
  connect?(element: HTMLElement): UIContext;  // Called when UI connects (legacy)
  connectWithContext?(frameworkContext: IFrameworkContext): UIContext;  // Called when UI connects
  disconnect?(context: UIContext): void;      // Called when UI disconnects
  dispose?(): void | Promise<void>;     // Called when controller is destroyed
  registerUI?(context: UIContext): () => void;  // Register UI elements with the controller
}
```

**Implementation Example:**

```ts
class DataController implements LifecycleAwareController {
  bindings = {
    data: new Binding<any[]>([]),
    isLoading: new Binding<boolean>(false)
  };
  
  private subscriptions: Array<() => void> = [];
  
  async initialize(): Promise<void> {
    // Initialize the controller state
    console.log('Controller initialized');
  }
  
  async connect(): Promise<void> {
    // Connection established with UI
    this.bindings.isLoading.set(true);
    try {
      const data = await this.fetchData();
      this.bindings.data.set(data);
    } finally {
      this.bindings.isLoading.set(false);
    }
  }
  
  disconnect(): void {
    // UI disconnected but controller persists
    console.log('UI disconnected');
  }
  
  dispose(): void {
    // Clean up all resources when controller is destroyed
    this.subscriptions.forEach(unsub => unsub());
    this.subscriptions = [];
    console.log('Controller disposed');
  }
  
  private async fetchData(): Promise<any[]> {
    // Simulating API call
    return new Promise(resolve => {
      setTimeout(() => {
        resolve([1, 2, 3, 4, 5]);
      }, 500);
    });
  }
}
```

### 3.2 Controller Instantiation Patterns

- **Direct Instantiation**: Create controller instance directly in a component
- **Factory Pattern**: Use a factory to create controllers with dependencies
- **Singleton**: Share a controller instance across multiple components

```ts
// Direct instantiation
const datePickerController = new DatePickerController();

// Factory pattern
class ControllerFactory {
  createDatePicker(options) {
    return new DatePickerController(options);
  }
}

// Singleton
class ControllerRegistry {
  private static instances = new Map<string, Controller>();
  
  static get<T extends Controller>(id: string): T {
    if (!this.instances.has(id)) {
      throw new Error(`Controller ${id} not registered`);
    }
    return this.instances.get(id) as T;
  }
  
  static register(id: string, controller: Controller): void {
    if (this.instances.has(id)) {
      throw new Error(`Controller ${id} already registered`);
    }
    this.instances.set(id, controller);
  }
}
```

### 3.3 UIContext System

The Uplink Protocol includes a robust UIContext system to manage the relationship between controllers and their connected UI elements. This system allows controllers to be connected to multiple UI components simultaneously, while maintaining clear separation and state synchronization.

```ts
class UIContext {
  id: string | number;
  element?: HTMLElement;
  framework?: string;
  state: Record<string, any>;
  subscriptions: Array<() => void>;
  
  // Get element from context, if available
  getElement(): HTMLElement | null;
  
  // Update context state
  updateState(key: string, value: any): void;
  
  // Add subscription to be cleaned up on disconnect
  addSubscription(unsubscribe: () => void): void;
  
  // Clean up all subscriptions
  dispose(): void;
}
```

**Implementation Example:**

```ts
class FormController implements LifecycleAwareController {
  bindings = {
    formData: new Binding<Record<string, any>>({}),
    isValid: new Binding<boolean>(false),
    isDirty: new Binding<boolean>(false)
  };
  
  // Context management
  protected _uiContexts: Map<string | number, UIContext> = new Map();
  protected _activeContext: UIContext | null = null;
  
  // Connect to a UI element and create a context
  connect(element: HTMLElement): UIContext {
    return this.connectWithContext({
      id: element.id || `element-${Date.now()}`,
      element,
      getElement: () => element
    });
  }
  
  // Connect with a framework context
  connectWithContext(frameworkContext: IFrameworkContext): UIContext {
    const context = new UIContext(frameworkContext);
    this._uiContexts.set(context.id, context);
    this._activeContext = context;
    
    // Initialize context with current binding values
    Object.entries(this.bindings).forEach(([key, binding]) => {
      context.updateState(key, binding.current);
    });
    
    return context;
  }
  
  // Disconnect a specific UI context
  disconnect(context: UIContext): void {
    if (this._uiContexts.has(context.id)) {
      context.dispose();
      this._uiContexts.delete(context.id);
      
      // Update active context if needed
      if (this._activeContext === context) {
        this._activeContext = this._uiContexts.size > 0 
          ? this._uiContexts.values().next().value 
          : null;
      }
    }
  }
  
  // Get the active context
  protected getActiveContext(): UIContext {
    if (!this._activeContext) {
      throw new Error('No active UI context');
    }
    return this._activeContext;
  }
  
  // Register UI elements with data attributes
  registerUI(context: UIContext): () => void {
    const element = context.getElement();
    if (!element) return () => {};
    
    const subscriptions: Array<() => void> = [];
    
    // Bind elements with data-uplink attributes
    const boundElements = element.querySelectorAll('[data-uplink]');
    boundElements.forEach(el => {
      // Register binding...
    });
    
    // Return cleanup function
    return () => {
      subscriptions.forEach(unsub => unsub());
    };
  }
}
```

The UIContext system provides several key benefits:

- **Multiple UI connections**: A single controller can connect to multiple UI components
- **Framework abstraction**: Context can represent HTML elements or framework-specific references
- **State synchronization**: Each context maintains its own view of the state
- **Resource management**: Automatic cleanup of subscriptions when contexts are disposed
- **Framework-specific integrations**: Custom context types for different frameworks

---

## 4. Rendering Integration

### 4.1 Web Components Integration

```ts
class DatePickerElement extends HTMLElement {
  private controller = new DatePickerController();
  private subscriptions: Array<() => void> = [];
  
  connectedCallback() {
    // Set up initial HTML structure
    this.innerHTML = `
      <div class="date-picker">
        <input type="text" class="date-input" />
        <button class="calendar-toggle">📅</button>
        <div class="calendar"></div>
      </div>
    `;
    
    // Set up binding subscriptions
    this.subscriptions.push(
      this.controller.bindings.selectedDate.subscribe(date => {
        const input = this.querySelector('.date-input') as HTMLInputElement;
        input.value = this.formatDate(date);
      }),
      
      this.controller.bindings.isCalendarOpen.subscribe(isOpen => {
        const calendar = this.querySelector('.calendar');
        calendar.style.display = isOpen ? 'block' : 'none';
      })
    );
    
    // Set up event listeners
    this.querySelector('.calendar-toggle').addEventListener('click', () => {
      this.controller.methods.toggleCalendar();
    });
    
    // Initialize UI with current binding values
    const input = this.querySelector('.date-input') as HTMLInputElement;
    input.value = this.formatDate(this.controller.bindings.selectedDate.current);
    
    const calendar = this.querySelector('.calendar');
    calendar.style.display = this.controller.bindings.isCalendarOpen.current ? 'block' : 'none';
    
    // If controller has lifecycle methods, call them
    if (this.controller.connect) {
      this.controller.connect();
    }
  }
  
  disconnectedCallback() {
    // Clean up subscriptions
    this.subscriptions.forEach(unsub => unsub());
    
    // If controller has lifecycle methods, call them
    if (this.controller.disconnect) {
      this.controller.disconnect();
    }
  }
  
  private formatDate(date: Date): string {
    return date.toLocaleDateString();
  }
}

customElements.define('date-picker', DatePickerElement);
```

### 4.2 Framework Integration

#### React Integration

```tsx
// React adapter example
function useController<T extends Controller>(controller: T): T {
  const [, forceUpdate] = useState({});
  
  useEffect(() => {
    // Subscribe to all bindings
    const unsubs = Object.values(controller.bindings).map(
      binding => binding.subscribe(() => forceUpdate({}))
    );
    
    // If controller has lifecycle methods, call them
    if (controller.connect) {
      controller.connect();
    }
    
    return () => {
      // Clean up subscriptions
      unsubs.forEach(unsub => unsub());
      
      // If controller has lifecycle methods, call them
      if (controller.disconnect) {
        controller.disconnect();
      }
    };
  }, [controller]);
  
  return controller;
}

// Using in a component
function DatePicker() {
  const controller = useController(new DatePickerController());
  
  return (
    <div className="date-picker">
      <input 
        type="text" 
        value={formatDate(controller.bindings.selectedDate.current)} 
        readOnly 
      />
      <button onClick={controller.methods.toggleCalendar}>
        📅
      </button>
      {controller.bindings.isCalendarOpen.current && (
        <div className="calendar">
          {/* Calendar implementation */}
        </div>
      )}
    </div>
  );
}
```

---

## 5. Adapters

### 5.1 Framework Adapters

Adapters provide framework-specific integrations for controllers, with a comprehensive adapter system for different frameworks. The Odyssey Uplink Protocol includes adapters for all major frontend frameworks.

#### Available Adapters

- **React Adapter** - For React applications
- **Vue Adapter** - For Vue applications
- **Angular Adapter** - For Angular applications
- **Svelte Adapter** - For Svelte applications
- **Vanilla Adapter** - For plain JavaScript applications without a framework

Each adapter is optimized for its respective framework's reactivity system and component lifecycle. Detailed usage examples for each adapter are available in the [Framework Adapters documentation](./docs/FRAMEWORK_ADAPTERS.md).

```ts
interface AdapterInterface {
  // Unique name for this adapter
  readonly name: string;
  
  // Version of the adapter
  readonly version: string;
  
  // Initialize the adapter with optional configuration
  initialize(config?: any): void;
  
  // Connect a controller to an element
  connectController(controller: Controller, element: HTMLElement): void;
  
  // Disconnect a controller
  disconnectController(controller: Controller): void;
  
  // Handle an event from a controller
  handleEvent(controller: Controller, eventName: string, eventData: any): void;
  
  // Watch a property for changes
  watchProperty(
    controller: Controller, 
    propertyName: string, 
    callback: (newValue: any) => void
  ): void;
  
  // Update a property value from UI
  updateProperty(controller: Controller, propertyName: string, value: any): void;
  
  // Call a method on the controller
  callMethod(controller: Controller, methodName: string, args?: any[]): any;
}

// Example of the React Adapter implementation
class ReactAdapter extends BaseAdapter {
  readonly name = 'react';
  readonly version = '1.0.0';
  
  connectController(controller: Controller, element: HTMLElement): void {
    // React-specific connection logic
  }
  
  disconnectController(controller: Controller): void {
    // React-specific cleanup logic
  }
  
  // Additional methods implementation...
  
  canAdapt(): boolean {
    // Detect if we're in a React environment
    return typeof React !== 'undefined' && !!React.createElement;
  }
}

class VanillaAdapter implements AdapterInterface {
  readonly name = 'vanilla';
  readonly priority = 1; // Lowest priority as fallback
  
  // Implementation for vanilla JS environments...
  
  canAdapt(): boolean {
    return true; // Always available as fallback
  }
}
```

### 5.2 Controller Adapter

The ControllerAdapter class provides a unified interface for controllers to interact with the adapter system:

```ts
class ControllerAdapter {
  private registry: AdapterRegistry;
  private adapter: AdapterInterface;
  private controller: any;
  private element: HTMLElement | null = null;
  
  constructor(controller: any, adapterName?: string) {
    this.controller = controller;
    this.registry = AdapterRegistry.getInstance();
    
    // Get the appropriate adapter
    if (adapterName && this.registry.hasAdapter(adapterName)) {
      this.adapter = this.registry.getAdapter(adapterName)!;
    } else {
      // Auto-detect or use default adapter
      const autoAdapter = this.registry.getAppropriateAdapter();
      
      if (autoAdapter) {
        this.adapter = autoAdapter;
      } else {
        // If no adapters are registered yet, create and register a vanilla adapter
        const vanillaAdapter = new VanillaAdapter();
        this.registry.registerAdapter(vanillaAdapter);
        this.adapter = vanillaAdapter;
      }
    }
  }
  
  public connect(element: HTMLElement): void {
    this.element = element;
    this.adapter.connectController(this.controller, element);
  }
  
  public disconnect(): void {
    if (this.element) {
      this.adapter.disconnectController(this.controller);
      this.element = null;
    }
  }
  
  public emitEvent(eventName: string, eventData: any): void {
    this.adapter.handleEvent(this.controller, eventName, eventData);
  }
  
  public watchProperty(propertyName: string, callback: (newValue: any) => void): void {
    this.adapter.watchProperty(this.controller, propertyName, callback);
  }
  
  public updateProperty(propertyName: string, value: any): void {
    this.adapter.updateProperty(this.controller, propertyName, value);
  }
}
```

### 5.3 Vanilla JS Usage

```ts
class UplinkElement {
  private controller: Controller;
  private element: HTMLElement;
  private adapter: ControllerAdapter;
  private subscriptions: Array<() => void> = [];
  
  constructor(controller: Controller, element: HTMLElement) {
    this.controller = controller;
    this.element = element;
    this.adapter = new ControllerAdapter(controller, 'vanilla');
    this.adapter.connect(element);
    this.bindController();
  }
  
  private bindController(): void {
    // Bind elements with data-uplink attributes to controller bindings
    const boundElements = this.element.querySelectorAll('[data-uplink]');
    
    boundElements.forEach(el => {
      const bindingName = el.getAttribute('data-uplink');
      const binding = this.controller.bindings[bindingName];
      
      if (!binding) return;
      
      // Set initial value
      this.updateElement(el, binding.current);
      
      // Use adapter for two-way binding
      this.adapter.watchProperty(bindingName, value => {
        this.updateElement(el, value);
      });
      
      // If input element, set up two-way binding
      if (el instanceof HTMLInputElement) {
        el.addEventListener('input', () => {
          this.adapter.updateProperty(bindingName, el.value);
        });
      }
    });
    
    // Bind methods
    const methodElements = this.element.querySelectorAll('[data-method]');
    methodElements.forEach(el => {
      const methodName = el.getAttribute('data-method');
      const method = this.controller.methods?.[methodName];
      
      if (!method) return;
      
      el.addEventListener('click', () => {
        method();
      });
    });
  }
  
  private updateElement(element: Element, value: any): void {
    if (element instanceof HTMLInputElement) {
      element.value = value?.toString() || '';
    } else {
      element.textContent = value?.toString() || '';
    }
  }
  
  disconnect(): void {
    this.subscriptions.forEach(unsub => unsub());
    this.subscriptions = [];
  }
}

// Usage
const controller = new UserController();
const element = document.getElementById('user-form');
const uplink = new UplinkElement(controller, element);

// Later when done
uplink.disconnect();
```

### 5.4 Two-Way Binding

The Uplink Protocol includes comprehensive support for two-way binding, allowing changes to flow both from controller to UI and from UI back to the controller.

**Controller → UI Binding:**

```ts
// Using the controller adapter
adapter.watchProperty('propertyName', (newValue) => {
  document.getElementById('display').textContent = newValue;
  document.querySelector('input').value = newValue;
});

// Or by subscribing directly to bindings
controller.bindings.propertyName.subscribe(newValue => {
  document.getElementById('display').textContent = newValue;
});
```

**UI → Controller Binding:**

```ts
// Using the controller adapter
document.querySelector('input').addEventListener('input', (event) => {
  adapter.updateProperty('propertyName', event.target.value);
});

// Or by directly updating bindings
document.querySelector('input').addEventListener('input', (event) => {
  controller.bindings.propertyName.set(event.target.value);
});
```

**Combined Two-Way Binding:**

```ts
function setupTwoWayBinding(controller, adapter, inputId, propertyName) {
  const input = document.getElementById(inputId);
  
  // From controller to UI
  adapter.watchProperty(propertyName, (newValue) => {
    input.value = newValue;
  });
  
  // From UI to controller
  input.addEventListener('input', (event) => {
    adapter.updateProperty(propertyName, event.target.value);
  });
  
  // Initialize with current value
  input.value = controller.bindings[propertyName].current;
  
  return () => {
    // Clean up function
    input.removeEventListener('input', handleInput);
  };
}

// Usage
const cleanupFn = setupTwoWayBinding(
  formController, 
  adapter, 
  'username-input', 
  'username'
);
```

Two-way binding is especially useful for form inputs and other interactive controls, providing seamless synchronization between the UI state and controller state.

---

## 6. Zero-Configuration Framework Integration

The Odyssey Uplink Protocol provides a zero-configuration approach to framework integration, allowing controllers to work seamlessly with any supported framework without requiring manual adapter setup or custom integration code.

### 6.1 Automatic Framework Detection

The protocol automatically detects which framework your application is using (React, Vue, Angular, Svelte, or vanilla JS) and sets up the appropriate adapter:

```ts
// Just import this at your app's entry point
import 'odyssey/uplink-auto-init';

// That's it! The protocol will auto-detect your framework and initialize everything
```

The auto-detection mechanism checks for global framework objects and initializes the most appropriate adapter:

- Checks for `React` and `ReactDOM` objects for React detection
- Checks for `Vue` object for Vue.js detection
- Checks for `ng` or `angular` objects for Angular detection
- Checks for `svelte` object for Svelte detection
- Falls back to the vanilla adapter if no framework is detected

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
// state.isEven is typed as boolean
// methods.increment is typed as () => void
// Container accepts onIncrement prop that expects (value: number) => void
```

By providing zero-configuration integration, the Odyssey Uplink Protocol makes it exceptionally easy to write truly framework-agnostic code while still benefiting from the native patterns and developer experience of each supported framework.

---

## 9. Roadmap

The Odyssey Uplink Protocol is under active development, with the following planned milestones:

- **v0.1**: Initial Protocol Specification (completed)
  - Core interfaces and components
  - Basic bindings and event emitters
  - Lifecycle management
  - Simple adapter system

- **v0.2**: Enhanced Bindings + Computed Values (completed)
  - Advanced computed bindings with automatic dependency tracking
  - Binding validators
  - Deep object binding with path notation

- **v0.3**: Framework Adapters + Testing Utilities (current)
  - Comprehensive adapter system for all major frameworks
  - Extended UI context capabilities
  - Complete API documentation

- **v0.4**: Documentation + Generator Tools
  - Complete API documentation

- **v1.0**: Production Ready Release with Full Adapter Support
  - Performance optimizations
  - Tree-shaking support
  - Comprehensive browser compatibility
  - Complete TypeScript support
  - Form bindings with validation

## 10. Conclusion

The Odyssey Uplink Protocol provides a clean separation between UI and logic, enabling truly framework-agnostic component development. By following this protocol, developers can:

- Write business logic once and reuse it across different frameworks
- Test application logic in isolation from UI implementation
- Create more maintainable and portable frontend applications
- Enjoy improved development velocity through cleaner separation of concerns
- Benefit from strong typing with TypeScript integration

As we continue to refine this protocol, we aim to create a comprehensive ecosystem that makes component development more efficient, testable, and portable across the entire frontend landscape.
