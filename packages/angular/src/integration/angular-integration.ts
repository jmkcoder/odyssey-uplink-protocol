import { connectController, disconnectController } from '@uplink-protocol/core';
import { angularAdapter } from '../adapter/angular-adapter';

/**
 * Configuration options for the UplinkModule
 */
export interface UplinkModuleConfig {
  /**
   * Whether to auto-initialize the adapter
   * @default true
   */
  autoInit?: boolean;
}

/**
 * Mock implementation of Angular module
 * This would be a proper NgModule in a real Angular application
 */
export const UplinkModule = {
  /**
   * Initialize the module with configuration options
   */
  forRoot(config: UplinkModuleConfig = {}) {
    // Auto-initialize the adapter if configured
    if (config.autoInit !== false) {
      autoInitializeAdapter();
    }
    
    return {
      ngModule: 'UplinkModule',
      providers: ['ControllerService']
    };
  }
};

/**
 * Directive to connect a controller to an Angular element
 * 
 * @example
 * <div [uplinkController]="myController"></div>
 */
export class UplinkControllerDirective {
  controller!: Controller;
  private el: { nativeElement: HTMLElement };
  
  constructor(el: { nativeElement: HTMLElement }) {
    this.el = el;
  }
  
  ngOnInit(): void {
    // Store Angular component reference for event handling
    (this.el.nativeElement as any).__ngComponent = this;
    
    // Connect the controller
    connectController(this.controller, this.el.nativeElement, 'angular');
  }
  
  ngOnDestroy(): void {
    disconnectController(this.controller);
  }
}

/**
 * Service that manages controllers in Angular applications
 */
export class ControllerService {
  // Store event unsubscribe functions
  private eventUnsubscribes = new Map<Controller, Array<() => void>>();

  /**
   * Get a controller instance by name or create one from the provided class
   */
  getController<T extends TypedController>(controllerInput: string | (() => T) | T): T {
    if (typeof controllerInput === 'string') {
      // Get controller from factory if string name is provided
      return getControllerFactory().create<T>(controllerInput);
    } else if (typeof controllerInput === 'function') {
      // Call the factory function
      return (controllerInput as () => T)();
    } else {
      // Use the provided controller instance
      return controllerInput;
    }
  }
  
  /**
   * Connect a controller to an element
   */
  connect(controller: Controller, element: HTMLElement): void {
    // Store Angular component reference for event handling
    (element as any).__ngComponent = {};
    
    // Connect the controller
    connectController(controller, element, 'angular');
  }
  
  /**
   * Disconnect a controller
   */
  disconnect(controller: Controller): void {
    // Clean up event subscriptions
    if (this.eventUnsubscribes.has(controller)) {
      const unsubscribes = this.eventUnsubscribes.get(controller) || [];
      unsubscribes.forEach(unsub => unsub());
      this.eventUnsubscribes.delete(controller);
    }
    
    disconnectController(controller);
  }

  /**
   * Connect controller events to component outputs
   * @param controller The controller with events
   * @param component The Angular component with EventEmitter outputs
   */
  connectEvents<T extends TypedController>(
    controller: T, 
    component: any
  ): void {
    if (!controller.events) return;
    
    const unsubscribes: Array<() => void> = [];
    
    Object.entries(controller.events).forEach(([eventName, emitter]) => {
      // Check if component has an EventEmitter for this event
      if (component[eventName] && typeof component[eventName].emit === 'function') {
        // Subscribe to controller event and emit through Angular EventEmitter
        const unsubscribe = emitter.subscribe((data: any) => {
          component[eventName].emit(data);
        });
        
        unsubscribes.push(unsubscribe);
      }
    });
    
    // Store unsubscribe functions for cleanup
    this.eventUnsubscribes.set(controller, unsubscribes);
  }
}

/**
 * Options for the useController function
 */
export interface UseControllerOptions {
  trackBindings?: string[] | 'all';
  autoConnectEvents?: boolean;
}

/**
 * Function to create a property-bound controller
 * This creates a controller instance and binds its state to component properties
 * 
 * @example
 * @Component({
 *   selector: 'app-counter',
 *   template: `
 *     <div>Count: {{ count }}</div>
 *     <button (click)="increment()">+</button>
 *   `,
 *   outputs: ['change'] // Event corresponding to controller's 'change' event
 * })
 * export class CounterComponent implements OnInit, OnDestroy {
 *   count = 0;
 *   change = new EventEmitter<number>();
 *   
 *   private controller: CounterController;
 *   private subscription?: () => void;
 *   
 *   constructor(private controllerService: ControllerService) {
 *     this.controller = useController(new CounterController(), this);
 *   }
 *   
 *   increment(): void {
 *     this.controller.methods.increment();
 *   }
 *   
 *   ngOnDestroy(): void {
 *     this.controllerService.disconnect(this.controller);
 *   }
 * }
 */
export function useController<T extends TypedController>(
  controllerInput: T | (() => T) | string,
  component: any,
  options: UseControllerOptions = {}
): T {
  // Get the controller service
  const controllerService = new ControllerService();
  
  // Create or use the provided controller
  const controller = controllerService.getController(controllerInput);
  
  // Set up binding tracking
  const bindingsToTrack = options.trackBindings === 'all'
    ? Object.keys(controller.bindings || {})
    : (options.trackBindings || []);
  
  // Initialize component properties with current binding values
  bindingsToTrack.forEach(key => {
    if (controller.bindings && controller.bindings[key]) {
      component[key] = controller.bindings[key].current;
    }
  });
  
  // Set up subscriptions to update component properties
  bindingsToTrack.forEach(key => {
    if (controller.bindings && controller.bindings[key]) {
      controller.bindings[key].subscribe((value: any) => {
        component[key] = value;
        
        // Trigger change detection if the component has a ChangeDetectorRef
        if (component.changeDetectorRef && typeof component.changeDetectorRef.detectChanges === 'function') {
          component.changeDetectorRef.detectChanges();
        }
      });
    }
  });
  
  // Connect events to component outputs if auto-connect is enabled (default: true)
  if (options.autoConnectEvents !== false) {
    controllerService.connectEvents(controller, component);
  }
  
  return controller;
}

