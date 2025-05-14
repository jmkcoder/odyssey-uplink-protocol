import { type Writable } from 'svelte/store';
import { Controller } from '../../uplink/interfaces/controller.interface';
import { TypedController, ControllerState } from '../../uplink/interfaces/framework-controller.interface';
import './auto-detect';
/**
 * Props for the container component
 */
export interface UplinkContainerProps {
    controller: Controller;
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
    state: ControllerState<T>;
    methods: T['methods'] extends Record<string, (...args: any[]) => any> ? T['methods'] : Record<string, never>;
}
/**
 * Connect an element to a controller and handle cleanup
 */
export declare function connectElement(node: HTMLElement, controller: Controller): {
    destroy: () => void;
};
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
export declare function getController<T extends TypedController>(controllerInput: T | (() => T) | string, options?: UseUplinkOptions): UseUplinkResult<T>;
export {};
//# sourceMappingURL=svelte.d.ts.map