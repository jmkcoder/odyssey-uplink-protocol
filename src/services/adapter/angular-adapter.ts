import { BaseAdapter } from './base-adapter';

/**
 * AngularAdapter provides integration for Odyssey controllers with Angular applications.
 * It bridges the gap between Angular's change detection system and the Odyssey Uplink Protocol.
 */
export class AngularAdapter extends BaseAdapter {
  public readonly name = 'angular';
  public readonly version = '1.0.0';
  
  // Store Angular component references
  private componentRefs: Map<any, any> = new Map();
  
  /**
   * Subscribe to property changes in the controller
   * For Angular, we need to trigger change detection when properties change
   */
  public watchProperty(
    controller: any,
    propertyName: string,
    callback: (newValue: any) => void
  ): void {
    // Make sure controller has bindings
    if (controller.bindings && controller.bindings[propertyName]) {
      // Track which properties are being watched by which components
      if (!this.componentRefs.has(controller)) {
        this.componentRefs.set(controller, new Set());
      }
      
      // Use the subscribe method if available (for StandardBinding instances)
      if (typeof controller.bindings[propertyName].subscribe === 'function') {
        controller.bindings[propertyName].subscribe((newValue: any) => {
          callback(newValue);
          
          // Trigger Angular change detection
          this.triggerChangeDetection(controller);
        });
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
              
              // Trigger Angular change detection
              this.triggerChangeDetection(controller);
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
      
      // Trigger Angular change detection
      this.triggerChangeDetection(controller);
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
      const result = controller.methods[methodName](...args);
      
      // Trigger Angular change detection after method call
      this.triggerChangeDetection(controller);
      
      return result;
    }
    
    // Fall back to direct method call if available
    if (typeof controller[methodName] === 'function') {
      const result = controller[methodName](...args);
      
      // Trigger Angular change detection after method call
      this.triggerChangeDetection(controller);
      
      return result;
    }
    
    // Method not found
    throw new Error(`Method '${methodName}' not found on controller`);
  }

  /**
   * Set up event forwarding to Angular component event handlers
   */
  protected onControllerEvent(controller: any, eventName: string, eventData: any): void {
    const element = this.controllerMap.get(controller);
    if (!element) return;
    
    // Get Angular component instance
    // This assumes the element has a reference to its Angular component instance
    const angularInstance = (element as any).__ngComponent;
    if (!angularInstance) return;
    
    // Convert event name to Angular Output property name (e.g., "dateSelected" → "dateSelected")
    // Angular typically uses the same name for events, not prefixed with "on"
    const outputName = eventName;
    
    // Call the Angular event emitter if it exists
    if (angularInstance[outputName] && typeof angularInstance[outputName].emit === 'function') {
      angularInstance[outputName].emit(eventData);
    }
  }
  
  /**
   * When a controller connects, set up Angular-specific bindings
   */
  protected onControllerConnected(controller: any, element: HTMLElement): void {
    super.onControllerConnected(controller, element);
    
    // Additional Angular-specific setup can go here
    // For example, connecting to Angular's change detection system
  }
  
  /**
   * Clean up Angular references when disconnecting
   */
  protected onControllerDisconnected(controller: any, element: HTMLElement): void {
    super.onControllerDisconnected(controller, element);
    
    // Clean up Angular-specific resources
    this.componentRefs.delete(controller);
  }
  
  /**
   * Helper method to trigger Angular change detection
   */
  private triggerChangeDetection(controller: any): void {
    const element = this.controllerMap.get(controller);
    if (!element) return;
    
    // Get Angular component instance
    const angularInstance = (element as any).__ngComponent;
    if (!angularInstance) return;
    
    // If the component has a ChangeDetectorRef, use it to trigger change detection
    if (angularInstance.__ngContext && angularInstance.__ngContext.changeDetectorRef) {
      angularInstance.__ngContext.changeDetectorRef.detectChanges();
    }
    // Alternative: use ApplicationRef.tick() if component has access to it
    else if (angularInstance.__ngContext && angularInstance.__ngContext.applicationRef) {
      angularInstance.__ngContext.applicationRef.tick();
    }
  }
}
