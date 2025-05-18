import { Controller, TypedController, ControllerState, EventEmitter } from '../../uplink';
import '../../uplink-auto-init';
/**
 * Options for the useUplink function
 */
interface UseUplinkOptions {
    trackBindings?: string[] | 'all';
    autoConnect?: boolean;
}
/**
 * Type for hook return value with generic support
 */
interface UseUplinkResult<T extends TypedController> {
    controller: T;
    state: ControllerState<T>;
    methods: T['methods'] extends Record<string, (...args: any[]) => any> ? T['methods'] : Record<string, never>;
    events: T['events'] extends Record<string, EventEmitter<any>> ? T['events'] : Record<string, never>;
    connect: (element: HTMLElement, eventHandlers?: Record<string, Function>) => () => void;
    disconnect: () => void;
}
/**
 * Class that creates an uplink container element for vanilla JS
 */
export declare class UplinkContainer {
    private controller;
    private element;
    private _eventUnsubscribes;
    /**
     * Create a new UplinkContainer
     * @param controller The controller to connect
     */
    constructor(controller: Controller);
    /**
     * Connect the controller to a DOM element
     * @param element The element to connect to
     * @param eventHandlers Optional event handlers
     */ connect(element: HTMLElement, eventHandlers?: Record<string, Function>): () => void;
    /**
     * Disconnect the controller from its element
     */ disconnect(): void;
}
/**
 * Function for using Uplink controllers in vanilla JavaScript
 *
 * @example
 * const counterController = new CounterController();
 * const { state, methods, connect, disconnect } = useUplink(counterController);
 *
 * // Create UI elements
 * const container = document.createElement('div');
 * const countDisplay = document.createElement('div');
 * const incrementButton = document.createElement('button');
 *
 * // Set up UI
 * incrementButton.textContent = '+';
 * incrementButton.addEventListener('click', methods.increment);
 * container.appendChild(countDisplay);
 * container.appendChild(incrementButton);
 * document.body.appendChild(container);
 *
 * // Connect controller to element with event handlers
 * const cleanup = connect(container, {
 *   onIncrement: (val) => {
 *     console.log(`Counter incremented to: ${val}`);
 *     countDisplay.textContent = `Count: ${val}`;
 *   }
 * });
 *
 * // When done, disconnect and clean up
 * // cleanup();
 */
export declare function useUplink<T extends TypedController>(controllerInput: T | (() => T) | string, options?: UseUplinkOptions): UseUplinkResult<T>;
/**
 * Creates a custom element that automatically connects to a controller
 *
 * @example
 * // Create a custom element
 * defineControllerElement('counter-component', new CounterController(), {
 *   template: `
 *     <div>Count: <span data-uplink="count"></span></div>
 *     <button id="increment">+</button>
 *   `,
 *   onConnected: (element, controller) => {
 *     // Set up additional event handlers
 *     element.querySelector('#increment').addEventListener('click', controller.methods.increment);
 *   },
 *   onEvent: {
 *     increment: (value, element) => {
 *       console.log(`Counter incremented to: ${value}`);
 *     }
 *   }
 * });
 *
 * // Use it in HTML
 * // <counter-component></counter-component>
 */
export declare function defineControllerElement<T extends Controller>(tagName: string, controllerInput: T | (() => T) | string, options?: {
    template?: string;
    shadow?: boolean;
    onConnected?: (element: HTMLElement, controller: T) => void;
    onDisconnected?: (element: HTMLElement, controller: T) => void;
    onEvent?: Record<string, (data: any, element: HTMLElement) => void>;
}): void;
export {};
//# sourceMappingURL=vanilla-integration.d.ts.map