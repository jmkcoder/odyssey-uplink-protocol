import { onMount, onDestroy } from 'svelte';
import { writable, type Writable } from 'svelte/store';
import { Controller } from '../../uplink/interfaces/controller.interface';
import { TypedController, ControllerState } from '../../uplink/interfaces/framework-controller.interface';
import { connectController, disconnectController } from '../../uplink/uplink-protocol';
import { getControllerFactory } from '../../uplink/models/controller-factory';
import { getAdapterRegistry } from '../adapter';
import './auto-detect'; // Ensure adapter is initialized

/**
 * Get the Svelte adapter if available
 */
function getSvelteAdapter() {
  const registry = getAdapterRegistry();
  return registry.getAdapter('svelte');
}

/**
 * Props for the container component
 */
export interface UplinkContainerProps {
  controller: Controller;
  // Allow any other props for event handlers
  [key: string]: any;
}

/**
 * Type for hook options
 */
interface UseUplinkOptions {
  trackBindings?: string[] | 'all';
  autoConnect?: boolean;
}

/**
 * Type for store mapping
 */
interface StoreMap {
  [key: string]: Writable<any>;
}

/**
 * Type for hook return value with generic support
 */
interface UseUplinkResult<T extends TypedController> {
  controller: T;
  stores: StoreMap;
  state: ControllerState<T>; // Adding state mapping that matches the controller's current state
  methods: T['methods'] extends Record<string, (...args: any[]) => any> ? T['methods'] : Record<string, never>;
}

/**
 * Connect an element to a controller and handle cleanup
 */
export function connectElement(node: HTMLElement, controller: Controller): { destroy: () => void } {
  // Store Svelte component reference for event handling
  (node as any).__svelteInstance = { node };
  
  // Connect the controller
  connectController(controller, node, 'svelte');

  return {
    destroy() {
      disconnectController(controller);
    }
  };
}

/**
 * Hook for using Uplink controllers in Svelte components
 *  * @example
 * <script>
 *   import { getController } from 'odyssey/uplink/svelte';
 *   import CounterController from './controllers/counter-controller';
 *   
 *   const { stores, methods, state } = getController(new CounterController());
 *   const count = stores.count;
 *   
 *   // You can access the initial state values directly
 *   console.log("Initial count:", state.count);
 * </script>
 * 
 * <div use:connectElement={controller}>
 *   <div>Count: {$count}</div>
 *   <button on:click={methods.increment}>+</button>
 * </div>
 */
export function getController<T extends TypedController>(
  controllerInput: T | (() => T) | string,
  options: UseUplinkOptions = {}
): UseUplinkResult<T> {
  // Create or use the provided controller
  let controller: T;
  
  if (typeof controllerInput === 'string') {
    // Get controller from factory if string name is provided
    controller = getControllerFactory().create<T>(controllerInput);
  } else if (typeof controllerInput === 'function') {
    // Call the factory function
    controller = (controllerInput as () => T)();
  } else {
    // Use the provided controller instance
    controller = controllerInput;
  }
    // Create stores for each binding
  const stores: StoreMap = {};
  const svelteAdapter = getSvelteAdapter();
  
  // Determine which bindings to track
  const bindingsToTrack = options.trackBindings === 'all'
    ? Object.keys(controller.bindings || {})
    : (options.trackBindings || []);
  
  // Create stores for bindings
  bindingsToTrack.forEach(key => {
    if (controller.bindings && controller.bindings[key]) {
      // If using the Svelte adapter, get store from it
      if (svelteAdapter && typeof (svelteAdapter as any).getStore === 'function') {
        stores[key] = (svelteAdapter as any).getStore(controller, key);
      } 
      // Otherwise create a writable store
      else {
        const initialValue = controller.bindings[key].current;
        const store = writable(initialValue);
        
        // Set up subscription to update the store
        onMount(() => {
          const unsubscribe = controller.bindings[key].subscribe(value => {
            store.set(value);
          });
          
          return unsubscribe;
        });
        
        // Set up subscription to update the controller
        store.subscribe(value => {
          if (controller.bindings[key].current !== value) {
            controller.bindings[key].set(value);
          }
        });
        
        stores[key] = store;
      }
    }
  });
  // Create state object from current binding values
  const state: Partial<ControllerState<T>> = {};
  Object.entries(controller.bindings).forEach(([key, binding]) => {
    (state as any)[key] = binding.current;
  });

  // Setup cleanup on component destroy
  onDestroy(() => {
    if (options.autoConnect !== false) {
      disconnectController(controller);
    }
  });
  
  return {
    controller,
    stores,
    state: state as ControllerState<T>,
    methods: (controller.methods || {}) as T['methods'] extends Record<string, (...args: any[]) => any> ? T['methods'] : Record<string, never>
  };
}
