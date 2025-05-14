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
export abstract class LifecycleAwareController implements Controller {
  bindings: Record<string, Binding<any>> = {};
  methods?: Record<string, (...args: any[]) => any>;
  events?: Record<string, EventEmitter<any>>;
  meta?: ControllerMetadata;
  __adapter?: ControllerAdapter; // Reference to the controller's adapter
  
  // Context management
  protected _uiContexts: Map<string | number, UIContext> = new Map();
  protected _activeContext: UIContext | null = null;
  protected _globalSubscriptions: Array<() => void> = [];
  protected _isSyncingState = false;
  
  /**
   * Initialize the controller with any default state
   * Called once during creation
   */
  abstract initialize(): Promise<void> | void;
  
  /**
   * Get the currently active UI context
   */
  protected getActiveContext(): UIContext {
    if (!this._activeContext && this._uiContexts.size > 0) {
      this._activeContext = this._uiContexts.values().next().value!;
    }
    
    if (!this._activeContext) {
      throw new Error('No active UI context - Controller must be connected to a UI before using methods');
    }
    
    return this._activeContext;
  }
  
  /**
   * Set the active UI context
   */
  public setActiveContext(context: UIContext): void {
    if (!this._uiContexts.has(context.frameworkContext.id)) {
      return;
    }
    
    if (this._activeContext === context) {
      return; // Already active
    }
    
    this._activeContext = context;
    this.syncStateFromContext(context);
  }
  
  /**
   * Sync shared bindings from UI context state
   * Override this method in derived classes to implement specific sync logic
   */
  protected syncStateFromContext(_context: UIContext): void {
    if (this._isSyncingState) {
      console.warn('Preventing recursive syncStateFromContext call');
      return;
    }
    
    this._isSyncingState = true;
    try {
      // The actual sync logic should be implemented by derived classes
    } finally {
      this._isSyncingState = false;
    }
  }
  
  /**
   * Connect the controller to a UI component
   * This backwards-compatible method creates a standard HTML element context
   * @deprecated Use connectWithContext instead
   * @param element The root UI element
   */
  connect(element: HTMLElement): UIContext {
    return this.connectWithContext({
      id: element.id || `element-${Date.now()}`,
      element,
      getElement: () => element
    });
  }

  /**
   * Connect the controller to any UI framework using a framework context
   * Called when a UI connects to this controller
   * Returns a UIContext that will be passed to other methods
   * @param frameworkContext Object representing the framework context
   */
  connectWithContext(frameworkContext: IFrameworkContext): UIContext {
    // Create a basic UI context
    const context = new UIContext({}, frameworkContext);
    
    // Store the context using the context ID as the key
    this._uiContexts.set(frameworkContext.id, context);
    
    // Set as active context
    this._activeContext = context;
    
    // Sync state from context (no-op in base class)
    this.syncStateFromContext(context);
    
    return context;
  }
  
  /**
   * Disconnect a specific UI from this controller
   * Called when a UI disconnects from this controller
   * Controller should perform cleanup for that specific UI
   * @param context The UI context returned from connect()
   */
  disconnect(context: UIContext): void {
    // Clean up the context
    context.cleanup();
    
    // Remove from contexts map
    this._uiContexts.delete(context.frameworkContext.id);
    
    // If this was the active context, clear it
    if (this._activeContext === context) {
      this._activeContext = null;
      
      // If there are other contexts, set the first one as active
      if (this._uiContexts.size > 0) {
        this._activeContext = this._uiContexts.values().next().value!;
        this.syncStateFromContext(this._activeContext);
      }
    }
  }
  
  /**
   * Dispose of the controller and release all resources
   */
  dispose(): void {
    // Disconnect all UIs
    for (const context of this._uiContexts.values()) {
      context.cleanup();
    }
    this._uiContexts.clear();
    
    // Clean up global subscriptions
    this._globalSubscriptions.forEach(unsub => unsub());
    this._globalSubscriptions = [];
  }
  
  /**
   * Register a UI element with this controller
   * Sets up data binding between UI elements with data-* attributes
   * and controller bindings/methods
   * 
   * @param context The UI context from connect()
   * @returns A function to clean up the registrations
   */
  registerUI(context: UIContext): () => void {
    // Set as active context temporarily during registration
    const prevActiveContext = this._activeContext;
    this._activeContext = context;
    
    try {
      // If we have a DOM element, use the default UI registrar
      if (context.frameworkContext.element) {
        const cleanup = createDefaultUIRegistrar(this, context.frameworkContext.element);
        
        // Add the cleanup function to context subscriptions
        context.addSubscription(cleanup);
        
        // Return the cleanup function
        return cleanup;
      }
      
      // For non-DOM frameworks, just return a no-op cleanup function
      return () => {};
    } finally {
      // Restore the previous active context
      this._activeContext = prevActiveContext;
    }
  }
  
  /**
   * Batch multiple binding updates to prevent cascading re-renders
   * This method overrides all binding set methods to collect updates,
   * execute the given function, then apply all updates at once.
   * 
   * @param fn Function to execute within the batch context
   */
  batchUpdates(fn: () => void): void {
    // Save original set methods
    const originalSetMethods = new Map<string, (value: any) => void>();
    
    // Store all updates to apply them later
    const pendingUpdates = new Map<string, any>();
    
    // Override set methods to collect updates instead of applying them immediately
    Object.keys(this.bindings).forEach(key => {
      const binding = this.bindings[key];
      originalSetMethods.set(key, binding.set.bind(binding));
      
      // Replace with a version that collects updates
      binding.set = (value: any) => {
        pendingUpdates.set(key, value);
      };
    });
    
    try {
      // Execute the function within the batch context
      fn();
      
      // Apply all collected updates at once
      pendingUpdates.forEach((value, key) => {
        originalSetMethods.get(key)?.(value);
      });
    } finally {
      // Restore original set methods
      Object.keys(this.bindings).forEach(key => {
        const binding = this.bindings[key];
        const originalSet = originalSetMethods.get(key);
        if (originalSet) {
          binding.set = originalSet;
        }
      });
    }
  }
}

/**
 * Default implementation of the registerUI method that can be used by controllers
 * @param controller The lifecycle-aware controller
 * @param element The DOM element to bind to
 * @returns A function to clean up the registrations
 */
export function createDefaultUIRegistrar(controller: LifecycleAwareController, element: HTMLElement): () => void {
  const subscriptions: Array<() => void> = [];
  
  // Find and bind all elements with data-uplink attributes
  const uplinkElements = element.querySelectorAll('[data-uplink]');
  
  uplinkElements.forEach(el => {
    const bindingName = el.getAttribute('data-uplink');
    if (!bindingName || !controller.bindings[bindingName]) return;
    
    const binding = controller.bindings[bindingName];
    
    // Handle different element types
    if (el instanceof HTMLInputElement) {
      // Set initial value
      if (binding.current instanceof Date && controller.methods?.formatDate) {
        // Handle date formatting if the controller has a formatDate method
        const formatDate = controller.methods.formatDate as (date: Date, format: string) => string;
        const format = controller.bindings['format']?.current || 'yyyy-MM-dd';
        el.value = formatDate(binding.current, format);
      } else {
        el.value = binding.current?.toString() || '';
      }
      
      // Create two-way binding
      el.addEventListener('input', () => {
        // For dates, attempt to parse the input value
        if (bindingName === 'selectedDate' && controller.methods?.setDate) {
          try {
            const date = new Date(el.value);
            if (!isNaN(date.getTime())) {
              const setDate = controller.methods.setDate as (date: Date) => void;
              setDate(date);
            }
          } catch (e) {
            console.error('Invalid date input:', e);
          }
        } else {
          binding.set(el.value);
        }
      });
      
      // Subscribe to binding changes
      subscriptions.push(
        binding.subscribe(value => {
          if (value instanceof Date && controller.methods?.formatDate) {
            // Handle date formatting
            const formatDate = controller.methods.formatDate as (date: Date, format: string) => string;
            const format = controller.bindings['format']?.current || 'yyyy-MM-dd';
            el.value = formatDate(value, format);
          } else {
            el.value = value?.toString() || '';
          }
        })
      );
    } else {
      // For non-input elements, update text content
      el.textContent = binding.current?.toString() || '';
      
      subscriptions.push(
        binding.subscribe(value => {
          el.textContent = value?.toString() || '';
        })
      );
    }
  });
  
  // NOTE: We don't handle data-method attributes here anymore. 
  // This is now handled by AbstractContextController.processMethodAttributes
  
  // Return a cleanup function
  return () => {
    subscriptions.forEach(unsub => unsub());
  };
}