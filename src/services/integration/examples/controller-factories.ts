// Example of using the controller factory with typed controllers

import { TypedCounterController } from './typed-counter.controller';
import { ControllerFactory } from '../../../uplink/models/controller-factory';
import { Controller } from '../../../uplink';

/**
 * This example shows how to register and use controller factories with TypeScript support
 */
export function setupControllerFactories() {
  const factory = ControllerFactory.getInstance();
  
  // Register the counter controller factory
  factory.register<TypedCounterController>('counter', () => {
    return new TypedCounterController();
  });
  
  // You can add additional initialization logic here
  
  return {
    // Method to create a counter controller with proper typing
    createCounter: () => factory.create<TypedCounterController>('counter'),
    
    // Generic method to create any registered controller
    createController: <T extends Controller>(name: string) => factory.create<T>(name)
  };
}

/**
 * Usage example with React:
 * 
 * ```tsx
 * import { useUplink } from '../../react';
 * import { setupControllerFactories } from './controller-factories';
 * 
 * const factories = setupControllerFactories();
 * 
 * export const CounterComponent = () => {
 *   // Create the controller via the factory
 *   const controller = factories.createCounter();
 *   
 *   // Use with zero-configuration
 *   const { state, methods, Container } = useUplink(controller);
 *   
 *   return (
 *     <Container>
 *       <div>Count: {state.count}</div>
 *       <button onClick={methods.increment}>+</button>
 *     </Container>
 *   );
 * }
 * ```
 * 
 * Benefits:
 * 1. Separation of controller creation and component logic
 * 2. Full type safety through all layers
 * 3. Easy dependency injection
 * 4. Consistent controller instances across components
 */
