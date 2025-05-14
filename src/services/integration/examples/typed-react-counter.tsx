// Example React component using the typed controller with zero-configuration

import React, { useState } from 'react';
import { useUplink } from '../react';
import { TypedCounterController } from './typed-counter.controller';

/**
 * React component demonstrating typed controller usage
 * This shows how the zero-configuration approach works with TypeScript
 */
export const TypedReactCounter = () => {
  // Create controller instance
  const controller = new TypedCounterController();
  
  // Use the zero-configuration hook with the typed controller
  // TypeScript will provide full type safety for state, methods, and event handlers
  const { state, methods, Container } = useUplink(controller, {
    trackBindings: 'all'
  });
  
  // Add state for tracking custom increment amount
  const [incrementAmount, setIncrementAmount] = useState<number>(5);
  
  // Event handlers
  const handleIncrement = (value: number) => {
    console.log(`Count increased to: ${value}`);
  };
  
  const handleReset = () => {
    console.log('Counter was reset');
  };
  
  return (
    <Container 
      className="counter-component"
      onIncrement={handleIncrement}
      onReset={handleReset}
    >
      <div className="counter-display">
        <h2>Count: {state.count}</h2>
        <p>This number is {state.isEven ? 'even' : 'odd'}</p>
        <p>Double value: {state.doubleCount}</p>
      </div>
      
      <div className="counter-controls">
        <button onClick={methods.increment} className="increment">+</button>
        <button onClick={methods.decrement} className="decrement">-</button>
        <button onClick={methods.reset} className="reset">Reset</button>
      </div>
      
      <div className="custom-increment">
        <div className="input-group">
          <label htmlFor="increment-amount">Custom increment:</label>
          <input 
            id="increment-amount"
            type="number" 
            value={incrementAmount}
            onChange={(e) => setIncrementAmount(parseInt(e.target.value, 10) || 0)}
          />
        </div>
        <button 
          onClick={() => methods.incrementBy(incrementAmount)}
          className="increment-custom"
        >
          Add
        </button>
      </div>
      
      <div className="increment-by">
        <button onClick={() => methods.incrementBy(5)}>+5</button>
        <button onClick={() => methods.incrementBy(10)}>+10</button>
      </div>
    </Container>
  );
};
