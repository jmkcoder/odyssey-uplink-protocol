import { BaseAdapter } from './base-adapter';

/**
 * SvelteAdapter provides integration for Odyssey controllers with Svelte applications.
 * It bridges the gap between Svelte's reactive store system and the Odyssey Uplink Protocol.
 */
export class SvelteAdapter extends BaseAdapter {
  public readonly name = 'svelte';
  public readonly version = '1.0.0';
  
  // Store Svelte component instances and their stores
  private componentStores: Map<any, Map<string, any>> = new Map();
  
  /**
   * Subscribe to property changes in the controller
   * For Svelte, we create stores that can be subscribed to
   */
  public watchProperty(
    controller: any,
    propertyName: string,
    callback: (newValue: any) => void
  ): void {
    // Make sure controller has bindings
    if (controller.bindings && controller.bindings[propertyName]) {
      // Initialize store tracking for this controller
      if (!this.componentStores.has(controller)) {
        this.componentStores.set(controller, new Map());
      }
      
      // Use the subscribe method if available (for StandardBinding instances)
      if (typeof controller.bindings[propertyName].subscribe === 'function') {
        controller.bindings[propertyName].subscribe(callback);
      } 
      // For computed properties or other non-standard bindings
      else if (controller.bindings[propertyName] !== null) {
        // Create a Svelte-compatible store-like reactive property
        const originalValue = controller.bindings[propertyName].current;
        let currentValue = originalValue;
        
        // Create storage for subscribers
        const subscribers = new Set<(value: any) => void>();
        
        // Store the Svelte store interface for this property
        const store = {
          subscribe: (sub: (value: any) => void) => {
            subscribers.add(sub);
            sub(currentValue);
            // Return unsubscribe function
            return () => {
              subscribers.delete(sub);
            };
          },
          set: (value: any) => {
            if (currentValue !== value) {
              currentValue = value;
              subscribers.forEach(sub => sub(value));
            }
          },
          update: (fn: (value: any) => any) => {
            const value = fn(currentValue);
            store.set(value);
          }
        };
        
        // Save the store reference
        this.componentStores.get(controller)!.set(propertyName, store);
        
        // Add property getter/setter
        Object.defineProperty(controller.bindings, propertyName, {
          get: () => currentValue,
          set: (newValue) => {
            const oldValue = currentValue;
            currentValue = newValue;
            if (oldValue !== newValue) {
              callback(newValue);
              subscribers.forEach(sub => sub(newValue));
            }
          },
          enumerable: true,
          configurable: true
        });
      }
    }
  }

  /**
   * Update a property value in the controller
   */
  public updateProperty(
    controller: any,
    propertyName: string,
    value: any
  ): void {
    // Make sure controller has bindings
    if (controller.bindings && controller.bindings[propertyName]) {
      // Use the set method if available (for StandardBinding instances)
      if (typeof controller.bindings[propertyName].set === 'function') {
        controller.bindings[propertyName].set(value);
      } 
      // For non-standard bindings, check if we have a Svelte store for this
      else if (this.componentStores.has(controller) && this.componentStores.get(controller)!.has(propertyName)) {
        const store = this.componentStores.get(controller)!.get(propertyName);
        store.set(value);
      }
      // Fall back to direct property assignment
      else if (controller.bindings[propertyName] !== null) {
        controller.bindings[propertyName] = value;
      }
    }
  }

  /**
   * Call a method on the controller
   */
  public callMethod(
    controller: any,
    methodName: string,
    args: any[] = []
  ): any {
    // Check if the controller has methods object with the method
    if (controller.methods && typeof controller.methods[methodName] === 'function') {
      return controller.methods[methodName](...args);
    }
    
    // Fall back to direct method call if available
    if (typeof controller[methodName] === 'function') {
      return controller[methodName](...args);
    }
    
    // Method not found
    throw new Error(`Method '${methodName}' not found on controller`);
  }

  /**
   * Set up event forwarding to Svelte component event handlers
   */
  protected onControllerEvent(controller: any, eventName: string, eventData: any): void {
    const element = this.controllerMap.get(controller);
    if (!element) return;
    
    // Get Svelte component instance
    // This assumes the element has a reference to its Svelte component instance
    const svelteInstance = (element as any).__svelteInstance;
    if (!svelteInstance) return;
    
    // Svelte uses dispatch to emit events
    if (svelteInstance.dispatchEvent) {
      // Use DOM CustomEvent API for event dispatch
      const event = new CustomEvent(eventName, {
        detail: eventData,
        bubbles: true
      });
      element.dispatchEvent(event);
    }
  }
  
  /**
   * Get a Svelte store for a controller property
   * This method can be exposed to Svelte components to bind to controller properties
   */
  public getStore(controller: any, propertyName: string): any {
    if (!this.componentStores.has(controller) || !this.componentStores.get(controller)!.has(propertyName)) {
      // Create the store on demand if it doesn't exist
      let value: any = null;
      
      if (controller.bindings && controller.bindings[propertyName]) {
        if (typeof controller.bindings[propertyName].current !== 'undefined') {
          value = controller.bindings[propertyName].current;
        } else {
          value = controller.bindings[propertyName];
        }
      }
      
      const subscribers = new Set<(value: any) => void>();
      const store = {
        subscribe: (sub: (value: any) => void) => {
          subscribers.add(sub);
          sub(value);
          return () => {
            subscribers.delete(sub);
          };
        },
        set: (newValue: any) => {
          if (value !== newValue) {
            value = newValue;
            this.updateProperty(controller, propertyName, newValue);
            subscribers.forEach(sub => sub(newValue));
          }
        },
        update: (fn: (value: any) => any) => {
          const newValue = fn(value);
          store.set(newValue);
        }
      };
      
      if (!this.componentStores.has(controller)) {
        this.componentStores.set(controller, new Map());
      }
      this.componentStores.get(controller)!.set(propertyName, store);
    }
    
    return this.componentStores.get(controller)!.get(propertyName);
  }
  
  /**
   * When a controller connects, set up Svelte-specific bindings
   */
  protected onControllerConnected(controller: any, element: HTMLElement): void {
    super.onControllerConnected(controller, element);
    
    // Initialize controller store tracking
    if (!this.componentStores.has(controller)) {
      this.componentStores.set(controller, new Map());
    }
  }
  
  /**
   * Clean up Svelte store subscriptions when disconnecting
   */
  protected onControllerDisconnected(controller: any, element: HTMLElement): void {
    super.onControllerDisconnected(controller, element);
    
    // Clean up Svelte-specific resources
    this.componentStores.delete(controller);
  }
}
