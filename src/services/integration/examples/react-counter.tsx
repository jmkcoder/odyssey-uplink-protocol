// Example React component using the zero-configuration Uplink Protocol
import React from 'react';
import { useUplink } from '../react';
import { CounterController } from './counter.controller';

export const ReactCounter = () => {
  // Use the zero-configuration hook
  const { state, methods, Container } = useUplink(new CounterController(), {
    trackBindings: 'all'
  });

  return (
    <Container 
      onIncrement={(val) => console.log(`Count increased to ${val}`)}
      onDecrement={(val) => console.log(`Count decreased to ${val}`)}
      onReset={() => console.log('Counter reset')}
    >
      <div className="counter">
        <h2>Count: {state.count}</h2>
        <p>The count is {state.isEven ? 'even' : 'odd'}</p>
        <div className="controls">
          <button onClick={methods.increment}>+</button>
          <button onClick={methods.decrement}>-</button>
          <button onClick={methods.reset}>Reset</button>
        </div>
      </div>
    </Container>
  );
};
