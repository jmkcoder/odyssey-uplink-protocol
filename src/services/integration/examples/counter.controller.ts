// Example Counter Controller for demonstrating the zero-configuration approach

import { Controller, EventEmitter, StandardBinding } from "../../../uplink";

/**
 * Simple counter controller for examples
 */
export class CounterController implements Controller {
  bindings = {
    count: new StandardBinding<number>(0),
    isEven: new StandardBinding<boolean>(true)
  };
  
  events = {
    increment: new EventEmitter<number>(),
    decrement: new EventEmitter<number>(),
    reset: new EventEmitter<void>()
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
      this.events.reset.emit();
    }
  };
}
