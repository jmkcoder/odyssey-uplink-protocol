import { BaseAdapter } from './base-adapter';

/**
 * ReactAdapter provides integration for Odyssey controllers with React applications.
 * It bridges the gap between React's component model and the Odyssey Uplink Protocol.
 */
export class ReactAdapter extends BaseAdapter {
  public readonly name = 'react';
  public readonly version = '1.0.0';
  
  // Store React hooks for components
  private componentHooks: Map<any, Set<string>> = new Map();
  
  /**
   * Subscribe to property changes in the controller
   * For React, we need to track which properties are being watched so we can 
   * trigger re-renders appropriately
   */
  public watchProperty(
    controller: any,
    propertyName: string,
    callback: (newValue: any) => void
  ): void {
    // Make sure controller has bindings
    if (controller.bindings && controller.bindings[propertyName]) {
      // Track which properties are being watched by which components
      if (!this.componentHooks.has(controller)) {
        this.componentHooks.set(controller, new Set());
      }
      this.componentHooks.get(controller)!.add(propertyName);
      
      // Use the subscribe method if available (for StandardBinding instances)
      if (typeof controller.bindings[propertyName].subscribe === 'function') {
        controller.bindings[propertyName].subscribe(callback);
      } 
      // For computed properties or other non-standard bindings
      else if (controller.bindings[propertyName] !== null) {
        // Create a proxy-based reactive property
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
   * Set up event forwarding to React props
   */
  protected onControllerEvent(controller: any, eventName: string, eventData: any): void {
    const element = this.controllerMap.get(controller);
    if (!element) return;
    
    // Get React component instance
    // This assumes the element has a reference to its React component instance
    const reactComponent = (element as any).__reactComponent;
    if (!reactComponent) return;
    
    // Convert event name to React prop name (e.g., "dateSelected" → "onDateSelected")
    const reactPropName = `on${eventName.charAt(0).toUpperCase()}${eventName.slice(1)}`;
    
    // Call the React event handler if it exists
    if (typeof reactComponent.props[reactPropName] === 'function') {
      reactComponent.props[reactPropName](eventData);
    }
  }
  
  /**
   * When a controller connects, set up React-specific bindings
   */
  protected onControllerConnected(controller: any, element: HTMLElement): void {
    super.onControllerConnected(controller, element);
    
    // Additional React-specific setup can go here
    // For example, attaching React context consumers
  }
  
  /**
   * Clean up React hooks when disconnecting
   */
  protected onControllerDisconnected(controller: any, element: HTMLElement): void {
    super.onControllerDisconnected(controller, element);
    
    // Clean up React-specific resources
    this.componentHooks.delete(controller);
  }
}