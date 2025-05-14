import { IFrameworkContext } from "../interfaces/framework-context.interface";

/**
 * UI Context provides per-UI state and context when a controller
 * is connected to multiple UIs
 */
export class UIContext<T = any> {
  private _state: T;
  private _frameworkContext: IFrameworkContext;
  private _subscriptions: Array<() => void> = [];
  
  constructor(initialState: T, frameworkContext: IFrameworkContext) {
    this._state = initialState;
    this._frameworkContext = frameworkContext;
  }
  
  /**
   * Get the framework context
   */
  get frameworkContext(): IFrameworkContext {
    return this._frameworkContext;
  }

  /**
   * Get a reference to the UI element (if available)
   * @deprecated Use frameworkContext instead
   */
  get element(): HTMLElement {
    return this._frameworkContext.element || 
           (this._frameworkContext.getElement && this._frameworkContext.getElement()) || 
           document.createElement('div'); // Fallback empty element
  }
  
  /**
   * Get the current UI state
   */
  get state(): T {
    return this._state;
  }
  
  /**
   * Update the UI state
   */
  setState(newState: Partial<T>): void {
    this._state = { ...this._state, ...newState };
    
    // If the framework context provides a render method, call it
    if (this._frameworkContext.render) {
      this._frameworkContext.render();
    }
  }
  
  /**
   * Add a subscription to be cleaned up when this UI is disconnected
   */
  addSubscription(unsubscribe: () => void): void {
    this._subscriptions.push(unsubscribe);
  }
  
  /**
   * Clean up all subscriptions for this UI
   */
  cleanup(): void {
    // Clean up framework-specific resources
    if (this._frameworkContext.cleanup) {
      this._frameworkContext.cleanup();
    }
    
    // Clean up subscriptions
    this._subscriptions.forEach(unsub => unsub());
    this._subscriptions = [];
  }
}