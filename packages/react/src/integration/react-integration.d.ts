import { Controller, TypedController, ControllerState, ControllerEventHandlers, EventEmitter } from '@uplink-protocol/core';
import * as React from 'react';
import type { ReactNode } from 'react';
import '../auto-detect';
/**
 * Props for UplinkContainer
 */
export interface UplinkContainerProps {
    controller: Controller;
    children: ReactNode;
    [key: string]: any;
}
/**
 * Component that connects a controller to the React component tree
 */
export declare const UplinkContainer: ({ controller, children, ...props }: UplinkContainerProps) => React.JSX.Element;
/**
 * Type for hook options
 */
interface UseUplinkOptions {
    trackBindings?: string[] | 'all';
    autoConnect?: boolean;
}
/**
 * Type for hook return value with generic support
 */
interface UseUplinkResult<T extends TypedController> {
    controller: T;
    state: ControllerState<T>;
    methods: T['methods'] extends Record<string, (...args: any[]) => any> ? T['methods'] : Record<string, never>;
    events: T['events'] extends Record<string, EventEmitter<any>> ? T['events'] : Record<string, never>;
    Container: React.FC<{
        children: ReactNode;
    } & ControllerEventHandlers<T> & Record<string, any>>;
}
/**
 * Hook for using Uplink controllers in React components
 *
 * @example
 * const Counter = () => {
 *   const { state, methods, Container } = useUplink(new CounterController());
 *
 *   return (
 *     <Container onIncrement={(val) => console.log(`Counter: ${val}`)}>
 *       <div>Count: {state.count}</div>
 *       <button onClick={methods.increment}>+</button>
 *     </Container>
 *   );
 * };
 */
export declare function useUplink<T extends TypedController>(controllerInput: T | (() => T) | string, options?: UseUplinkOptions): UseUplinkResult<T>;
export {};
//# sourceMappingURL=react-integration.d.ts.map