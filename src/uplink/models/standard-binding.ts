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
  
  constructor(initialValue: T) {
    this.current = initialValue;
  }

  /**
   * Updates the binding value and notifies all subscribers
   */
  set(value: T): void {
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