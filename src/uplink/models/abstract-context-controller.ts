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
export abstract class AbstractContextController<T = any> extends LifecycleAwareController {

  /**
   * Connect controller to a specific UI element
   * This backwards-compatible method creates a standard HTML element context
   * @deprecated Use connectWithContext instead
   * @param element The root UI element
   */
  connect(element: HTMLElement): UIContext<T> {
    // Create framework context from HTML element
    const frameworkContext: IFrameworkContext = {
      id: element.id || `element-${Date.now()}`,
      element,
      getElement: () => element
    };
    
    return this.connectWithContext(frameworkContext);
  }
  
  /**
   * Connect controller to any UI framework using its context object
   * Returns a UIContext for this connection
   * @param frameworkContext The framework context object
   */
  connectWithContext(frameworkContext: IFrameworkContext): UIContext<T> {
    // Create UI-specific state with the initialUIState method
    const uiState = this.createInitialUIState();
    
    // Create UI context
    const context = new UIContext<T>(uiState as T, frameworkContext);
    
    // Store context
    this._uiContexts.set(frameworkContext.id, context);
    
    // Set this as active context
    this._activeContext = context;
    
    // Register the UI to set up data binding
    this.registerUI(context);

    this.setupBindingSyncToActiveContext();
    
    // Sync active context state to shared bindings
    this.syncStateFromContext(context);
    
    return context;
  }

  /**
   * Set up binding synchronization to active context
   * This ensures any binding changes are automatically reflected in the active context
   */
  protected setupBindingSyncToActiveContext(): void {
    const bindingToStateMapping = Object.keys(this.bindings).reduce((map, key) => {
      if (key in this.createInitialUIState()) {
      map[key] = key as keyof T;
      }
      return map;
    }, {} as Record<string, keyof T>);

    // Set up subscribers for each binding that should update the active context
    Object.entries(bindingToStateMapping).forEach(([bindingName, stateProp]) => {
      const binding = this.bindings[bindingName as keyof typeof this.bindings];
      if (binding && typeof binding.subscribe === 'function') {
        this._globalSubscriptions.push(
          binding.subscribe((newValue: any) => {
            const activeContext = this.getActiveContext();
            if (activeContext && !this._isSyncingState) {
              // Create an update using the state property
              const update = { [stateProp]: newValue } as Partial<T>;
              activeContext.setState(update);
            }
          })
        );
      }
    });
  }

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
  protected updateActiveContext(stateChanges: Partial<T>): void {
    const context = this.getActiveContext() as UIContext<T>;
    context.setState(stateChanges);
    
    // Re-sync state from the updated context
    this.syncStateFromContext(context);
  }

  /**
   * Batch update active context state and sync to bindings
   * This method prevents unnecessary renders by updating multiple properties at once
   * 
   * @param stateChanges The partial state object with properties to update
   */
  protected batchUpdateActiveContext(stateChanges: Partial<T>): void {
    // Set syncing flag to prevent recursive state updates
    this._isSyncingState = true;
    try {
      // Get active context and update state
      const context = this.getActiveContext() as UIContext<T>;
      context.setState(stateChanges);
      
      // Sync to shared bindings using batch updates
      this.batchUpdates(() => {
        this.syncStateFromContext(context);
      });
    } finally {
      // Clear syncing flag
      this._isSyncingState = false;
    }
  }
}