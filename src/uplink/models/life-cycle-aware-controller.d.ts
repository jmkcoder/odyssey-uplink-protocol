import { ControllerAdapter } from "../../services/adapter";
import { Binding } from "../interfaces/binding.interface";
import { ControllerMetadata } from "../interfaces/metadata/controller-metadata.interface";
import { Controller } from "../interfaces/controller.interface";
import { IFrameworkContext } from "../interfaces/framework-context.interface";
import { EventEmitter } from "./event-emitter";
import { UIContext } from "./ui-context";
/**
 * Lifecycle-aware controller abstract class extending the base Controller
 * Includes standard lifecycle methods to properly manage a controller's lifecycle
 * as specified in the Uplink Protocol section 5
 */
export declare abstract class LifecycleAwareController implements Controller {
    bindings: Record<string, Binding<any>>;
    methods?: Record<string, (...args: any[]) => any>;
    events?: Record<string, EventEmitter<any>>;
    meta?: ControllerMetadata;
    __adapter?: ControllerAdapter;
    protected _uiContexts: Map<string | number, UIContext>;
    protected _activeContext: UIContext | null;
    protected _globalSubscriptions: Array<() => void>;
    protected _isSyncingState: boolean;
    /**
     * Initialize the controller with any default state
     * Called once during creation
     */
    abstract initialize(): Promise<void> | void;
    /**
     * Get the currently active UI context
     */
    protected getActiveContext(): UIContext;
    /**
     * Set the active UI context
     */
    setActiveContext(context: UIContext): void;
    /**
     * Sync shared bindings from UI context state
     * Override this method in derived classes to implement specific sync logic
     */
    protected syncStateFromContext(_context: UIContext): void;
    /**
     * Connect the controller to a UI component
     * This backwards-compatible method creates a standard HTML element context
     * @deprecated Use connectWithContext instead
     * @param element The root UI element
     */
    connect(element: HTMLElement): UIContext;
    /**
     * Connect the controller to any UI framework using a framework context
     * Called when a UI connects to this controller
     * Returns a UIContext that will be passed to other methods
     * @param frameworkContext Object representing the framework context
     */
    connectWithContext(frameworkContext: IFrameworkContext): UIContext;
    /**
     * Disconnect a specific UI from this controller
     * Called when a UI disconnects from this controller
     * Controller should perform cleanup for that specific UI
     * @param context The UI context returned from connect()
     */
    disconnect(context: UIContext): void;
    /**
     * Dispose of the controller and release all resources
     */
    dispose(): void;
    /**
     * Register a UI element with this controller
     * Sets up data binding between UI elements with data-* attributes
     * and controller bindings/methods
     *
     * @param context The UI context from connect()
     * @returns A function to clean up the registrations
     */
    registerUI(context: UIContext): () => void;
    /**
     * Batch multiple binding updates to prevent cascading re-renders
     * This method overrides all binding set methods to collect updates,
     * execute the given function, then apply all updates at once.
     *
     * @param fn Function to execute within the batch context
     */
    batchUpdates(fn: () => void): void;
}
/**
 * Default implementation of the registerUI method that can be used by controllers
 * @param controller The lifecycle-aware controller
 * @param element The DOM element to bind to
 * @returns A function to clean up the registrations
 */
export declare function createDefaultUIRegistrar(controller: LifecycleAwareController, element: HTMLElement): () => void;
//# sourceMappingURL=life-cycle-aware-controller.d.ts.map