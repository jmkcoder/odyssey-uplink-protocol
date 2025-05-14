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
    events: T['events'] extends Record<string, any> ? T['events'] : Record<string, never>;
    eventHandlers: Record<string, (event: CustomEvent) => void>;
}
/**
 * Connect an element to a controller and handle cleanup
 */
export declare function connectElement(node: HTMLElement, controller: Controller): {
    destroy: () => void;
    update?: (params: {
        controller: Controller;
    }) => void;
};
/**
 * Hook for using Uplink controllers in Svelte components
 *  * @example
 * <script>
 *   import { getController, connectElement } from 'odyssey/uplink/svelte';
 *   import CounterController from './controllers/counter-controller';
 *    *   const { stores, methods, state, events, eventHandlers } = getController(new CounterController());
 *   const count = stores.count;
 *
 *   // You can access the initial state values directly
 *   console.log("Initial count:", state.count);
 *
 *   // You can also subscribe to events directly
 *   onMount(() => {
 *     events.increment.subscribe((val) => {
 *       console.log(`Counter incremented to: ${val}`);
 *     });
 *   });
 * </script>
 *
 * <div use:connectElement={controller} on:increment={eventHandlers.increment}
 *   <div>Count: {$count}</div>
 *   <button on:click={methods.increment}>+</button>
 * </div>
 */
export declare function getController<T extends TypedController>(controllerInput: T | (() => T) | string, options?: UseUplinkOptions): UseUplinkResult<T>;
export {};
//# sourceMappingURL=svelte.d.ts.map