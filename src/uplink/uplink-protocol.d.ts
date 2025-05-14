import { Binding } from './interfaces/binding.interface';
import { Controller } from './interfaces/controller.interface';
/**
 * Connect a controller to the global adapter system and handle lifecycle methods if available
 * @param controller The controller to connect
 * @param element The DOM element to associate with the controller
 * @param adapterName Optional specific adapter name to use
 */
export declare function connectController(controller: Controller, element: HTMLElement, adapterName?: string): void;
/**
 * Disconnect a controller from its adapter
 * @param controller The controller to disconnect
 */
export declare function disconnectController(controller: Controller): void;
/**
 * Create a computed binding that depends on other bindings
 */
export declare function computedFrom<T>(bindingNames: string[], computeFn: (...values: any[]) => T, controller: Controller): Binding<T>;
/**
 * Batch updates to multiple bindings
 */
export declare function batch(callback: () => void): void;
/**
 * Register a framework adapter with the global registry
 * @param adapterName The name of the adapter
 * @param adapter The adapter instance
 */
export declare function registerAdapter(adapter: any): void;
/**
 * Set the default adapter to use
 * @param adapterName The name of the adapter to use as default
 */
export declare function setDefaultAdapter(adapterName: string): void;
//# sourceMappingURL=uplink-protocol.d.ts.map