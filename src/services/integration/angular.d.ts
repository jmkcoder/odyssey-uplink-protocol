import { Controller } from '../../uplink/interfaces/controller.interface';
import { TypedController } from '../../uplink/interfaces/framework-controller.interface';
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
export declare const UplinkModule: {
    /**
     * Initialize the module with configuration options
     */
    forRoot(config?: UplinkModuleConfig): {
        ngModule: string;
        providers: string[];
    };
};
/**
 * Directive to connect a controller to an Angular element
 *
 * @example
 * <div [uplinkController]="myController"></div>
 */
export declare class UplinkControllerDirective {
    controller: Controller;
    private el;
    constructor(el: {
        nativeElement: HTMLElement;
    });
    ngOnInit(): void;
    ngOnDestroy(): void;
}
/**
 * Service that manages controllers in Angular applications
 */
export declare class ControllerService {
    private eventUnsubscribes;
    /**
     * Get a controller instance by name or create one from the provided class
     */
    getController<T extends TypedController>(controllerInput: string | (() => T) | T): T;
    /**
     * Connect a controller to an element
     */
    connect(controller: Controller, element: HTMLElement): void;
    /**
     * Disconnect a controller
     */
    disconnect(controller: Controller): void;
    /**
     * Connect controller events to component outputs
     * @param controller The controller with events
     * @param component The Angular component with EventEmitter outputs
     */
    connectEvents<T extends TypedController>(controller: T, component: any): void;
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
export declare function useController<T extends TypedController>(controllerInput: T | (() => T) | string, component: any, options?: UseControllerOptions): T;
//# sourceMappingURL=angular.d.ts.map