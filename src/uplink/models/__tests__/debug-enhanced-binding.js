/**
 * Let's create a more detailed test for the enhanced StandardBinding class
 */
class TestStandardBinding {
  constructor(initialValue) {
    this.current = initialValue;
    this._callbacks = [];
    this._debugId = Math.random().toString(36).substring(2, 9);
    this._debugHistory = [{ value: initialValue, subscriberCount: 0 }];
  }

  set(value) {
    this.current = value;
    
    // Make a local copy to avoid issues if callbacks are modified during iteration
    const callbacksToExecute = [...this._callbacks];
    
    // Track for debugging
    this._debugHistory.push({ 
      value, 
      subscriberCount: callbacksToExecute.length 
    });
    
    // Call each callback with the new value
    callbacksToExecute.forEach(callback => {
      try {
        callback(value);
      } catch (error) {
        console.error(
          `[StandardBinding:${this._debugId}] Error in subscriber callback:`, 
          error
        );
      }
    });
  }

  subscribe(callback) {
    if (typeof callback !== 'function') {
      console.error(
        `[StandardBinding:${this._debugId}] Attempted to subscribe with a non-function:`, 
        callback
      );
      return () => {}; // Return no-op unsubscribe function
    }
    
    this._callbacks.push(callback);
    
    // Return unsubscribe function
    return () => {
      const prevLength = this._callbacks.length;
      this._callbacks = this._callbacks.filter(subscriber => subscriber !== callback);
      
      // Log if subscriber wasn't found
      if (prevLength === this._callbacks.length) {
        console.warn(
          `[StandardBinding:${this._debugId}] Unsubscribe called but subscriber was not found`
        );
      }
    };
  }
  
  debug() {
    return {
      current: this.current,
      subscriberCount: this._callbacks.length,
      id: this._debugId,
      history: [...this._debugHistory]
    };
  }
}

// Create a binding with initial value
const binding = new TestStandardBinding(0);

// Create subscriber tracking
const calls1 = [];
const calls2 = [];
const calls3 = [];

console.log('Initial state:', binding.debug());

// Subscribe multiple callbacks
const unsub1 = binding.subscribe(value => {
  console.log('Subscriber 1 received:', value);
  calls1.push(value);
});

const unsub2 = binding.subscribe(value => {
  console.log('Subscriber 2 received:', value);
  calls2.push(value);
});

const unsub3 = binding.subscribe(value => {
  console.log('Subscriber 3 received:', value);
  calls3.push(value);
});

console.log('\nAfter subscribing:', binding.debug());

// Set new values
console.log('\nSetting value to 1');
binding.set(1);

console.log('\nSetting value to 2');
binding.set(2);

// Unsubscribe one subscriber
console.log('\nUnsubscribing subscriber 2');
unsub2();

console.log('\nAfter unsubscribe:', binding.debug());

// Set more values
console.log('\nSetting value to 3');
binding.set(3);

// Check results
console.log('\nResults:');
console.log('Subscriber 1 calls:', calls1);
console.log('Subscriber 2 calls:', calls2, '(unsubscribed after 2)');
console.log('Subscriber 3 calls:', calls3);

// Check final state
console.log('\nFinal state:', binding.debug());
