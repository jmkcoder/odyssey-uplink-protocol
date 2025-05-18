import { 
  connectController, 
  disconnectController
} from '../../uplink/uplink-protocol';
import {
  Controller,
  TypedController,
  ControllerState,
  EventEmitter,
  getControllerFactory
} from '../../uplink';
import { autoInitializeAdapter } from './auto-detect';

/**
 * Initializes the vanilla adapter for use in vanilla JavaScript applications
 * This should be called once at the entry point of your application
 */
export function initializeVanillaAdapter(): void {
  // Call the auto-detect initialization function
  autoInitializeAdapter();
}

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
export class UplinkContainer {
  private controller: Controller;
  private element: HTMLElement | null = null;
  private _eventUnsubscribes: Array<() => void> = [];
  
  /**
   * Create a new UplinkContainer
   * @param controller The controller to connect
   */
  constructor(controller: Controller) {
    this.controller = controller;
  }
  
  /**
   * Connect the controller to a DOM element
   * @param element The element to connect to
   * @param eventHandlers Optional event handlers
   */  connect(element: HTMLElement, eventHandlers: Record<string, Function> = {}): () => void {
    this.element = element;
    
    // Add data attribute to mark this as an uplink controller container
    this.element.setAttribute('data-uplink-controller', '');
    
    // Set up event handlers if the controller has events
    if (this.controller.events) {
      for (const [eventName, emitter] of Object.entries(this.controller.events)) {
        // Get the handler function from the provided event handlers
        const handler = eventHandlers[`on${eventName.charAt(0).toUpperCase() + eventName.slice(1)}`];
        
        if (typeof handler === 'function') {
          // Subscribe to the event and call the handler
          const unsubscribe = emitter.subscribe((data: any) => {
            handler(data);
          });
          
          // Store unsubscribe function for cleanup
          this._eventUnsubscribes.push(unsubscribe);
        }
      }
    }
    
    // Connect the controller to the element
    connectController(this.controller, this.element, 'vanilla');
    
    // Return a cleanup function
    return () => this.disconnect();
  }
  
  /**
   * Disconnect the controller from its element
   */  disconnect(): void {
    // Clean up event subscriptions
    this._eventUnsubscribes.forEach(unsub => unsub());
    this._eventUnsubscribes = [];
    
    // Disconnect the controller
    disconnectController(this.controller);
    
    // Clear reference to element
    this.element = null;
  }
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
export function useUplink<T extends TypedController>(
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
  
  // Create current state object from bindings
  const state: Record<string, any> = {};
  
  // Set up binding tracking
  const bindingsToTrack = options.trackBindings === 'all'
    ? Object.keys(controller.bindings || {})
    : (options.trackBindings || []);
  
  // Initialize state with current binding values
  bindingsToTrack.forEach(key => {
    if (controller.bindings && controller.bindings[key]) {
      state[key] = controller.bindings[key].current;
    }
  });
  
  // Store binding subscriptions for cleanup
  const bindingUnsubscribes: Array<() => void> = [];
  
  // Set up binding subscriptions
  bindingsToTrack.forEach(key => {
    if (controller.bindings && controller.bindings[key]) {
      const unsubscribe = controller.bindings[key].subscribe(value => {
        state[key] = value;
      });
      
      bindingUnsubscribes.push(unsubscribe);
    }
  });
  
  // Create container
  const container = new UplinkContainer(controller);
  
  // Connect function that sets up the controller with an element
  const connect = (element: HTMLElement, eventHandlers: Record<string, Function> = {}) => {
    return container.connect(element, eventHandlers);
  };
  
  // Disconnect function
  const disconnect = () => {
    // Clean up binding subscriptions
    bindingUnsubscribes.forEach(unsub => unsub());
    
    // Disconnect container
    container.disconnect();
  };
  
  return {
    controller,
    state: state as ControllerState<T>,
    methods: (controller.methods || {}) as T['methods'] extends Record<string, (...args: any[]) => any> ? T['methods'] : Record<string, never>,
    events: (controller.events || {}) as T['events'] extends Record<string, EventEmitter<any>> ? T['events'] : Record<string, never>,
    connect,
    disconnect
  };
}

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
export function defineControllerElement<T extends Controller>(
  tagName: string, 
  controllerInput: T | (() => T) | string,
  options: {
    template?: string;
    shadow?: boolean;
    onConnected?: (element: HTMLElement, controller: T) => void;
    onDisconnected?: (element: HTMLElement, controller: T) => void;
    onEvent?: Record<string, (data: any, element: HTMLElement) => void>;
  } = {}
): void {
  // Ensure custom elements are supported
  if (typeof customElements === 'undefined') {
    console.error('Custom Elements are not supported in this browser');
    return;
  }
  
  // Define the custom element
  customElements.define(tagName, class extends HTMLElement {
    private controller: T;
    private cleanup: (() => void) | null = null;
    private eventHandlers: Record<string, Function> = {};
    
    constructor() {
      super();
      
      // Create the controller
      if (typeof controllerInput === 'string') {
        this.controller = getControllerFactory().create<T>(controllerInput);
      } else if (typeof controllerInput === 'function') {
        this.controller = (controllerInput as () => T)();
      } else {
        this.controller = controllerInput;
      }
      
      // Set up event handlers
      if (options.onEvent && this.controller.events) {
        for (const [eventName, handler] of Object.entries(options.onEvent)) {
          if (this.controller.events[eventName]) {
            this.eventHandlers[`on${eventName.charAt(0).toUpperCase() + eventName.slice(1)}`] = 
              (data: any) => handler(data, this);
          }
        }
      }
      
      // Set up shadow DOM if requested
      if (options.shadow) {
        this.attachShadow({ mode: 'open' });
      }
    }
    
    connectedCallback() {
      // Add template content
      if (options.template) {
        if (this.shadowRoot) {
          this.shadowRoot.innerHTML = options.template;
        } else {
          this.innerHTML = options.template;
        }
      }      // Create container and connect
      const container = new UplinkContainer(this.controller);
      this.cleanup = container.connect(
        this.shadowRoot ? this.shadowRoot as unknown as HTMLElement : this, 
        this.eventHandlers
      );
      
      // Call onConnected callback
      if (options.onConnected) {
        options.onConnected(this.shadowRoot ? this.shadowRoot as unknown as HTMLElement : this, this.controller);
      }
    }
      disconnectedCallback() {
      // Call user-provided disconnect handler
      if (options.onDisconnected) {
        options.onDisconnected(this.shadowRoot ? this.shadowRoot as unknown as HTMLElement : this, this.controller);
      }
      
      // Clean up controller connection
      if (this.cleanup) {
        this.cleanup();
        this.cleanup = null;
      }
    }
  });
}