/**
 * Odyssey Uplink Protocol Core Implementation
 * Version: 0.1
 */
import { ControllerAdapter, getAdapterRegistry } from '../services/adapter';
import { Binding } from './interfaces/binding.interface';
import { Controller } from './interfaces/controller.interface';
import { EventEmitter } from './models/event-emitter';
import { StandardBinding } from './models/standard-binding';

/**
 * Connect a controller to the global adapter system and handle lifecycle methods if available
 * @param controller The controller to connect
 * @param element The DOM element to associate with the controller
 * @param adapterName Optional specific adapter name to use
 */
export function connectController(
  controller: Controller, 
  element: HTMLElement, 
  adapterName?: string
): void {
  // Create an adapter for this controller
  const adapter = new ControllerAdapter(controller, adapterName);
  
  // Store the adapter on the controller
  controller.__adapter = adapter;
  
  // Call initialize if it's a lifecycle-aware controller
  if ('initialize' in controller && typeof controller.initialize === 'function') {
    // Handle both synchronous and asynchronous initialize
    Promise.resolve(controller.initialize())
      .then(() => {
        // After initialization, connect the controller
        connectControllerToElement(controller, element, adapter);
      })
      .catch(error => {
        console.error('Error initializing controller:', error);
        // Connect anyway, as controller might work partially
        connectControllerToElement(controller, element, adapter);
      });
  } else {
    // Regular controller, connect immediately
    connectControllerToElement(controller, element, adapter);
  }
}

/**
 * Helper function to connect a controller to an element after initialization
 */
function connectControllerToElement(
  controller: Controller, 
  element: HTMLElement, 
  adapter: ControllerAdapter
): void {
  // Connect the controller to the element
  adapter.connect(element);
  
  // Connect events to the adapter
  if (controller.events) {
    Object.entries(controller.events).forEach(([eventName, emitter]) => {
      if (emitter instanceof EventEmitter) {
        emitter.connectToAdapter(controller, eventName);
      }
    });
  }
  
  // Call connect method for lifecycle-aware controllers
  if ('connect' in controller && typeof controller.connect === 'function') {
    // Create UIContext if controller supports it
    try {
      controller.connect(element);
    } catch (error) {
      console.error('Error in controller.connect():', error);
    }
  }
  
  // Register UI if the controller supports it
  if ('registerUI' in controller && typeof controller.registerUI === 'function') {
    try {
      // For regular controllers that implement registerUI directly
      if (controller.registerUI.length === 1) {
        // If registerUI expects a UIContext, try to get one from connect method
        if ('connect' in controller && typeof controller.connect === 'function') {
          const context = controller.connect(element);
          if (context) {
            controller.registerUI(context);
          }
        }
      } else if (controller.registerUI.length === 2) {
        // For older controllers that expect element as parameter
        (controller.registerUI as any)(element);
      }
    } catch (error) {
      console.error('Error in controller.registerUI():', error);
    }
  }
}

/**
 * Disconnect a controller from its adapter
 * @param controller The controller to disconnect
 */
export function disconnectController(controller: Controller): void {
  if (controller.__adapter) {
    controller.__adapter.disconnect();
    delete controller.__adapter;
  }
}

/**
 * Create a computed binding that depends on other bindings
 */
export function computedFrom<T>(
  bindingNames: string[],
  computeFn: (...values: any[]) => T,
  controller: Controller
): Binding<T> {
  const binding = new StandardBinding<T>(
    computeFn(...bindingNames.map(name => controller.bindings[name].current))
  );

  // Subscribe to dependencies
  const unsubscribes = bindingNames.map(name => 
    controller.bindings[name].subscribe(() => {
      binding.set(
        computeFn(...bindingNames.map(name => controller.bindings[name].current))
      );
    })
  );

  // Add cleanup method
  (binding as any).cleanup = () => {
    unsubscribes.forEach(unsub => unsub());
  };
  
  return binding;
}

/**
 * Batch updates to multiple bindings
 */
export function batch(callback: () => void) {
  // In a more sophisticated implementation, we'd collect all changes and emit them once
  // For now, we just execute the callback which will trigger multiple set() calls
  callback();
}

/**
 * Register a framework adapter with the global registry
 * @param adapterName The name of the adapter
 * @param adapter The adapter instance
 */
export function registerAdapter(adapter: any): void {
  const registry = getAdapterRegistry();
  registry.registerAdapter(adapter);
}

/**
 * Set the default adapter to use
 * @param adapterName The name of the adapter to use as default
 */
export function setDefaultAdapter(adapterName: string): void {
  const registry = getAdapterRegistry();
  registry.setDefaultAdapter(adapterName);
}