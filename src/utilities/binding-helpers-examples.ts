/**
 * Example usage of the binding helpers
 * This demonstrates how to create controllers with the new helper functions
 */

import { TypedController } from "../uplink/interfaces/framework-controller.interface";
import { createBindings, createEventEmitters } from "./binding-helpers";

// Example 1: Basic counter controller
export class CounterController implements TypedController {
  // Create bindings with initial values
  bindings = createBindings({
    count: 0,
    isEven: true
  });
  
  // Create event emitters for this controller
  events = createEventEmitters(['increment', 'decrement', 'reset']);
  
  // Define controller methods
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
      this.events.reset.emit(0);
    }
  };
}

// Example 2: Form controller with typed event emitters
interface FormData {
  name: string;
  email: string;
  message: string;
}

export class FormController implements TypedController {
  // Create bindings with initial values
  bindings = createBindings({
    name: '',
    email: '',
    message: '',
    isValid: false,
    isSubmitting: false
  });
  
  // Create typed event emitters
  events = createEventEmitters({
    submit: {} as FormData,
    validate: false as boolean,
    change: '' as string
  });
    // Define controller methods
  methods = {
    setField: (field: string, value: string) => {
      if (field in this.bindings) {
        (this.bindings as any)[field].set(value);
        this.events.change.emit(field);
        this.methods.validateForm();
      }
    },
    
    validateForm: () => {
      const isValid = 
        !!this.bindings.name.current && 
        !!this.bindings.email.current && 
        this.bindings.email.current.includes('@');
      
      this.bindings.isValid.set(isValid);
      this.events.validate.emit(isValid);
      return isValid;
    },
    
    submitForm: async () => {
      if (!this.methods.validateForm()) {
        return;
      }
      
      this.bindings.isSubmitting.set(true);
      
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Get form data from bindings
        const formData: FormData = {
          name: this.bindings.name.current,
          email: this.bindings.email.current,
          message: this.bindings.message.current
        };
        
        // Emit submit event with form data
        this.events.submit.emit(formData);
        
        // Reset form
        this.bindings.name.set('');
        this.bindings.email.set('');
        this.bindings.message.set('');
      } finally {
        this.bindings.isSubmitting.set(false);
      }
    }
  };
}
