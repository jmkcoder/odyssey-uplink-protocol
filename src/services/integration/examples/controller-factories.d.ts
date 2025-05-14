import { TypedCounterController } from './typed-counter.controller';
import { Controller } from '../../../uplink';
/**
 * This example shows how to register and use controller factories with TypeScript support
 */
export declare function setupControllerFactories(): {
    createCounter: () => TypedCounterController;
    createController: <T extends Controller>(name: string) => T;
};
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
//# sourceMappingURL=controller-factories.d.ts.map