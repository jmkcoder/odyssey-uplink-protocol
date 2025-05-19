import { Binding } from "../interfaces/binding.interface";
import { Unsubscribe } from "../types/unsubscribe.type";

/**
 * Standard binding implementation
 * 
 * Provides a binding service pattern with public access to callbacks
 */
export class StandardBinding<T> implements Binding<T> {
  current: T;
  _callbacks: ((value: T) => void)[] = [];
  
  // Custom implementation functions
  private _customSet?: (value: T) => void;
  private _customSubscribe?: (callback: (value: T) => void) => Unsubscribe;
  
  constructor(
    initialValue: T, 
    options?: {
      customSet?: (value: T) => void;
      customSubscribe?: (callback: (value: T) => void) => Unsubscribe;
    }
  ) {
    this.current = initialValue;
    this._customSet = options?.customSet;
    this._customSubscribe = options?.customSubscribe;
  }

  /**
   * Updates the binding value and notifies all subscribers
   */
  set(value: T): void {
    // If a custom set function was provided, use it
    if (this._customSet) {
      this._customSet(value);
      return;
    }
    
    // Default implementation
    // Update the current value
    this.current = value;
    
    // Important: make a copy of the callbacks array before iterating
    // This prevents issues if callbacks are added/removed during notification
    const callbacksToNotify = this._callbacks.slice();
    
    // Notify all subscribers
    for (let i = 0; i < callbacksToNotify.length; i++) {
      try {
        callbacksToNotify[i](value);
      } catch (error) {
        console.error('Error in binding subscriber:', error);
        // Continue with other subscribers even if one fails
      }
    }
  }

  /**
   * Adds a subscriber to this binding
   * @returns A function to unsubscribe
   */
  subscribe(callback: (value: T) => void): Unsubscribe {
    // If a custom subscribe function was provided, use it
    if (this._customSubscribe) {
      return this._customSubscribe(callback);
    }
    
    // Default implementation
    // Validate the callback is a function
    if (typeof callback !== 'function') {
      console.error('Attempted to subscribe with non-function:', callback);
      return () => {}; // No-op unsubscribe function
    }
    
    // Add to subscribers
    this._callbacks.push(callback);
    
    // Call immediately with current value (optional, uncomment if needed)
    // try { callback(this.current); } catch (e) { console.error('Error in initial subscriber call:', e); }
    
    // Return unsubscribe function
    let isUnsubscribed = false;
    return () => {
      // Prevent multiple unsubscribe calls
      if (isUnsubscribed) return;
      isUnsubscribed = true;
      
      // Remove from subscribers array
      this._callbacks = this._callbacks.filter(cb => cb !== callback);
    };
  }
}