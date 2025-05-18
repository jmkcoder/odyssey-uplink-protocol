import { 
  connectController, 
  disconnectController,
  Controller,
  TypedController,
  ControllerState,
  ControllerEventHandlers,
  EventEmitter,
  getControllerFactory
} from '@uplink-protocol/core';
import * as React from 'react';
import { useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { autoInitializeAdapter } from '../auto-detect';  // Ensure auto-detect is initialized

/**
 * Initializes the React adapter for use in React applications
 * This should be called once at the entry point of your application
 */
export function initializeReactAdapter(): void {
  // Call the auto-detect initialization function
  autoInitializeAdapter();
}

/**
 * Props for UplinkContainer
 */
export interface UplinkContainerProps {
  controller: Controller;
  children: ReactNode;
  [key: string]: any; // Allow any other props for event handlers
}

/**
 * Component that connects a controller to the React component tree
 */
export const UplinkContainer = ({ controller, children, ...props }: UplinkContainerProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  // Connect controller to element and manage props reference
  useEffect(() => {
    if (containerRef.current) {
      // Store props reference for event handling
      (containerRef.current as any).__reactComponent = { props };
      
      // Connect the controller
      connectController(controller, containerRef.current, 'react');
      
      return () => {
        disconnectController(controller);
      };
    }
  }, [controller]);
  
  // Store props in a ref instead of updating on every change
  const propsRef = useRef(props);
  propsRef.current = props;
  
  return <div ref={containerRef} data-uplink-controller>{children}</div>;
};

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
  Container: React.FC<{ children: ReactNode } & ControllerEventHandlers<T> & Record<string, any>>;
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
export function useUplink<T extends TypedController>(
  controllerInput: T | (() => T) | string,
  options: UseUplinkOptions = {}
): UseUplinkResult<T> {
  // Create or use the provided controller
  const [controller] = useState<T>(() => {
    if (typeof controllerInput === 'string') {
      // Get controller from factory if string name is provided
      return getControllerFactory().create<T>(controllerInput);
    } else if (typeof controllerInput === 'function') {
      // Call the factory function
      return (controllerInput as () => T)();
    } else {
      // Use the provided controller instance
      return controllerInput;
    }
  });

  // Set up state from bindings
  const [state, setState] = useState<Record<string, any>>(() => {
    const initialState: Record<string, any> = {};
    
    const bindingsToTrack = options.trackBindings === 'all'
      ? Object.keys(controller.bindings || {})
      : (options.trackBindings || []);
    
    bindingsToTrack.forEach(key => {
      if (controller.bindings && controller.bindings[key]) {
        initialState[key] = controller.bindings[key].current;
      }
    });
    
    return initialState;
  });
  // Set up binding subscriptions
  useEffect(() => {
    const bindingsToTrack = options.trackBindings === 'all'
      ? Object.keys(controller.bindings || {})
      : (options.trackBindings || []);
    
    // Store current values to avoid unnecessary updates
    const currentValues = new Map();
    
    const unsubscribes = bindingsToTrack.map(key => {
      if (controller.bindings && controller.bindings[key]) {
        // Initialize current value
        currentValues.set(key, controller.bindings[key].current);
        
        return controller.bindings[key].subscribe(value => {
          // Only update state if value has changed
          if (currentValues.get(key) !== value) {
            currentValues.set(key, value);
            setState(prev => ({ ...prev, [key]: value }));
          }
        });
      }
      return () => {};
    });
    
    return () => {
      unsubscribes.forEach(unsub => unsub());
    };
  }, [controller, options.trackBindings]);
  // Create Container component bound to this controller
  const Container: React.FC<{ children: ReactNode; [key: string]: any }> = ({ children, ...props }) => {
    // Use a ref to store the current props for event handlers to prevent rerenders
    const propsFunctionsRef = useRef<Record<string, Function>>({});
    
    // Update the ref when props change, only tracking function props
    useEffect(() => {
      if (controller.events) {
        const eventHandlers: Record<string, Function> = {};
        Object.keys(controller.events).forEach(eventName => {
          const propName = `on${eventName.charAt(0).toUpperCase() + eventName.slice(1)}`;
          if (typeof props[propName] === 'function') {
            eventHandlers[propName] = props[propName];
          }
        });
        propsFunctionsRef.current = eventHandlers;
      }
    }, [props, controller.events]);
    
    // Set up direct event subscriptions if controller has events
    useEffect(() => {
      if (controller.events) {
        const unsubscribes = Object.entries(controller.events).map(([eventName, emitter]) => {
          // Convert event name to React prop name format (e.g., "increment" -> "onIncrement")
          const propName = `on${eventName.charAt(0).toUpperCase() + eventName.slice(1)}`;
          
          // Subscribe using the ref to get latest handler function
          return emitter.subscribe((data) => {
            if (typeof propsFunctionsRef.current[propName] === 'function') {
              propsFunctionsRef.current[propName](data);
            }
          });
        });
        
        return () => {
          unsubscribes.forEach(unsub => unsub());
        };
      }
    }, [controller.events]);

    return <UplinkContainer controller={controller} {...props}>{children}</UplinkContainer>;
  };

  return {
    controller,
    state: state as ControllerState<T>,
    methods: (controller.methods || {}) as T['methods'] extends Record<string, (...args: any[]) => any> ? T['methods'] : Record<string, never>,
    events: (controller.events || {}) as T['events'] extends Record<string, EventEmitter<any>> ? T['events'] : Record<string, never>,
    Container
  };
}