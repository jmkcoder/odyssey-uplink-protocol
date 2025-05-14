import { BaseAdapter } from './base-adapter';

/**
 * VanillaAdapter provides integration for Odyssey controllers with vanilla JavaScript
 * and standard Web Components without requiring any framework.
 */
export class VanillaAdapter extends BaseAdapter {
  public readonly name = 'vanilla';
  public readonly version = '1.0.0';

  /**
   * Subscribe to property changes in the controller
   * In vanilla JS, we use the controller's own binding mechanism
   */
  public watchProperty(
    controller: any,
    propertyName: string,
    callback: (newValue: any) => void
  ): void {
    // Make sure controller has bindings
    if (controller.bindings && controller.bindings[propertyName]) {
      // Use the subscribe method if available (for StandardBinding instances)
      if (typeof controller.bindings[propertyName].subscribe === 'function') {
        controller.bindings[propertyName].subscribe(callback);
      } 
      // For computed properties or other non-standard bindings
      else if (controller.bindings[propertyName] !== null) {
        // Create a getter/setter if the property doesn't have one already
        const originalValue = controller.bindings[propertyName].current;
        let currentValue = originalValue;
        
        Object.defineProperty(controller.bindings, propertyName, {
          get: () => currentValue,
          set: (newValue) => {
            const oldValue = currentValue;
            currentValue = newValue;
            if (oldValue !== newValue) {
              callback(newValue);
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
      // For computed properties or other non-standard bindings
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
   * Set up standard event listeners for DOM events
   */
  protected onControllerConnected(controller: any, element: HTMLElement): void {
    // If the controller has registered events, set up listeners to forward DOM events
    if (controller.meta && controller.meta.events) {
      Object.keys(controller.meta.events).forEach(eventName => {        
        // Set up listener for DOM events that should trigger the controller event
        element.addEventListener(eventName, (event: Event) => {
          // Call the event handler on the controller if it exists
          if (controller.events && controller.events[eventName]) {
            const detail = (event as CustomEvent).detail;
            // Emit the event using the controller's event emitter
            controller.events[eventName].emit(detail);
          }
        });
      });
    }
  }
}