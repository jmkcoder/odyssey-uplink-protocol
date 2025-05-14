import { IFrameworkContext } from "../interfaces/framework-context.interface";
import { LifecycleAwareController } from "./life-cycle-aware-controller";
import { UIContext } from "./ui-context";
/**
 * Abstract Context Controller class that provides standardized context management
 * capabilities for controllers with UI contexts. This class extends LifecycleAwareController
 * and adds additional context management functionality.
 *
 * T represents the UI state type for the specific controller implementation
 */
export declare abstract class AbstractContextController<T = any> extends LifecycleAwareController {
    /**
     * Connect controller to a specific UI element
     * This backwards-compatible method creates a standard HTML element context
     * @deprecated Use connectWithContext instead
     * @param element The root UI element
     */
    connect(element: HTMLElement): UIContext<T>;
    /**
     * Connect controller to any UI framework using its context object
     * Returns a UIContext for this connection
     * @param frameworkContext The framework context object
     */
    connectWithContext(frameworkContext: IFrameworkContext): UIContext<T>;
    /**
     * Set up binding synchronization to active context
     * This ensures any binding changes are automatically reflected in the active context
     */
    protected setupBindingSyncToActiveContext(): void;
    /**
     * Create the initial UI state for a new context
     * Must be implemented by derived classes
     */
    protected abstract createInitialUIState(): object;
    /**
     * Sync shared bindings from UI context state
     * Must be implemented by derived classes to define how context state
     * is synchronized to the shared bindings
     */
    protected abstract syncStateFromContext(context: UIContext<T>): void;
    /**
     * Update state in the active context and sync to bindings
     */
    protected updateActiveContext(stateChanges: Partial<T>): void;
    /**
     * Batch update active context state and sync to bindings
     * This method prevents unnecessary renders by updating multiple properties at once
     *
     * @param stateChanges The partial state object with properties to update
     */
    protected batchUpdateActiveContext(stateChanges: Partial<T>): void;
}
//# sourceMappingURL=abstract-context-controller.d.ts.map