import { BaseAdapter } from './base-adapter';

/**
 * VueAdapter provides integration for Odyssey controllers with Vue applications.
 * It bridges the gap between Vue's reactivity system and the Odyssey Uplink Protocol.
 */
export class VueAdapter extends BaseAdapter {
  public readonly name = 'vue';
  public readonly version = '1.0.0';
  
  // Store Vue component instances
  private componentInstances: Map<any, any> = new Map();
  
  /**
   * Subscribe to property changes in the controller
   * For Vue, we leverage Vue's reactivity system to watch properties
   */
  public watchProperty(
    controller: any,
    propertyName: string,
    callback: (newValue: any) => void
  ): void {
    // Make sure controller has bindings
    if (controller.bindings && controller.bindings[propertyName]) {
      // Track which properties are being watched by which components
      if (!this.componentInstances.has(controller)) {
        this.componentInstances.set(controller, new Set());
      }
      
      // Use the subscribe method if available (for StandardBinding instances)
      if (typeof controller.bindings[propertyName].subscribe === 'function') {
        controller.bindings[propertyName].subscribe(callback);
      } 
      // For computed properties or other non-standard bindings
      else if (controller.bindings[propertyName] !== null) {
        // Create a reactive property compatible with Vue's reactivity system
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
   * Set up event forwarding to Vue component event handlers
   */
  protected onControllerEvent(controller: any, eventName: string, eventData: any): void {
    const element = this.controllerMap.get(controller);
    if (!element) return;
    
    // Get Vue component instance
    // This assumes the element has a reference to its Vue component instance
    const vueInstance = (element as any).__vueComponent;
    if (!vueInstance) return;
    
    // Vue uses kebab-case for event names
    const kebabCaseEventName = eventName.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
    
    // Call the Vue event handler if it exists
    const emitFunction = vueInstance.$emit || vueInstance.emit;
    if (typeof emitFunction === 'function') {
      emitFunction.call(vueInstance, kebabCaseEventName, eventData);
    }
  }
  
  /**
   * When a controller connects, set up Vue-specific bindings
   */
  protected onControllerConnected(controller: any, element: HTMLElement): void {
    super.onControllerConnected(controller, element);
    
    // Additional Vue-specific setup can go here
    // For example, attaching Vue component instance references
  }
  
  /**
   * Clean up Vue component instances when disconnecting
   */
  protected onControllerDisconnected(controller: any, element: HTMLElement): void {
    super.onControllerDisconnected(controller, element);
    
    // Clean up Vue-specific resources
    this.componentInstances.delete(controller);
  }
}
