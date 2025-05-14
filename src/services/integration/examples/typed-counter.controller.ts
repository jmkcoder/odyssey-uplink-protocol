// Example of a typed counter controller using the TypedController interface

import { TypedController, Binding, EventEmitter, StandardBinding } from "../../../uplink";

// Define the types for bindings, methods, and events
interface CounterBindings {
  count: Binding<number>;
  isEven: Binding<boolean>;
  doubleCount: Binding<number>;
  [key: string]: Binding<any>;
}

interface CounterMethods {
  increment(): void;
  decrement(): void;
  reset(): void;
  incrementBy(value: number): void;
  [key: string]: (...args: any[]) => any;
}

interface CounterEvents {
  increment: EventEmitter<number>;
  decrement: EventEmitter<number>;
  reset: EventEmitter<void>;
  [key: string]: EventEmitter<any>;
}

/**
 * Example of a strongly typed controller implementation
 * This provides full type safety when used with framework integration hooks
 */
export class TypedCounterController implements TypedController<CounterBindings, CounterMethods, CounterEvents> {
  // Bindings are fully typed
  bindings: CounterBindings = {
    count: new StandardBinding<number>(0),
    isEven: new StandardBinding<boolean>(true),
    doubleCount: new StandardBinding<number>(0)
  };
  
  // Methods are fully typed
  methods: CounterMethods = {
    increment: () => {
      const newCount = this.bindings.count.current + 1;
      this.updateState(newCount);
    },
    
    decrement: () => {
      const newCount = this.bindings.count.current - 1;
      this.updateState(newCount);
      this.events.decrement.emit(newCount);
    },
    
    reset: () => {
      this.updateState(0);
      this.events.reset.emit();
    },
    
    incrementBy: (value: number) => {
      const newCount = this.bindings.count.current + value;
      this.updateState(newCount);
    }
  };
  
  // Events are fully typed
  events: CounterEvents = {
    increment: new EventEmitter<number>(),
    decrement: new EventEmitter<number>(),
    reset: new EventEmitter<void>()
  };
  
  // Helper method to update all derived state
  private updateState(count: number): void {
    this.bindings.count.set(count);
    this.bindings.isEven.set(count % 2 === 0);
    this.bindings.doubleCount.set(count * 2);
    
    // Emit event for increment operations
    if (count > this.bindings.count.current) {
      this.events.increment.emit(count);
    }
  }
}
