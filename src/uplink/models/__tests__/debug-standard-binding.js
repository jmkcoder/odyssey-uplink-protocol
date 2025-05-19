/**
 * Let's create a simple manual test for the StandardBinding class
 */
class TestStandardBinding {
  constructor(initialValue) {
    this.current = initialValue;
    this._callbacks = [];
  }

  set(value) {
    this.current = value;
    this._callbacks.forEach(callback => callback(value));
  }

  subscribe(callback) {
    this._callbacks.push(callback);
    return () => {
      this._callbacks = this._callbacks.filter(subscriber => subscriber !== callback);
    };
  }
}

// Create a binding with initial value
const binding = new TestStandardBinding(0);

// Create subscriber tracking
const calls1 = [];
const calls2 = [];
const calls3 = [];

// Subscribe multiple callbacks
binding.subscribe(value => {
  console.log('Subscriber 1 received:', value);
  calls1.push(value);
});

binding.subscribe(value => {
  console.log('Subscriber 2 received:', value);
  calls2.push(value);
});

binding.subscribe(value => {
  console.log('Subscriber 3 received:', value);
  calls3.push(value);
});

// Set new values
console.log('Setting value to 1');
binding.set(1);

console.log('Setting value to 2');
binding.set(2);

console.log('Setting value to 3');
binding.set(3);

// Check results
console.log('\nResults:');
console.log('Subscriber 1 calls:', calls1);
console.log('Subscriber 2 calls:', calls2);
console.log('Subscriber 3 calls:', calls3);

// Verify that all subscribers received all updates
const allReceived = 
  calls1.length === 3 && calls1[0] === 1 && calls1[1] === 2 && calls1[2] === 3 &&
  calls2.length === 3 && calls2[0] === 1 && calls2[1] === 2 && calls2[2] === 3 &&
  calls3.length === 3 && calls3[0] === 1 && calls3[1] === 2 && calls3[2] === 3;

console.log('\nAll subscribers received all updates:', allReceived ? 'YES ✅' : 'NO ❌');

// Check the binding state
console.log('\nCurrent binding value:', binding.current);
console.log('Number of callbacks in _callbacks:', binding._callbacks.length);
