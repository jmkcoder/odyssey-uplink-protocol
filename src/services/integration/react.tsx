import { useEffect, useRef, useState, ReactNode } from 'react';
import { Controller } from '../../uplink/interfaces/controller.interface';
import { TypedController, ControllerState, ControllerEventHandlers } from '../../uplink/interfaces/framework-controller.interface';
import { connectController, disconnectController } from '../../uplink/uplink-protocol';
import { getControllerFactory } from '../../uplink/models/controller-factory';
import './auto-detect'; // Ensure adapter is initialized
import React from 'react';
import { EventEmitter } from '../../uplink';

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

  // Connect controller to element
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
  
  // Update props reference when props change
  useEffect(() => {
    if (containerRef.current) {
      (containerRef.current as any).__reactComponent.props = props;
    }
  }, [props]);
  
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
    
    const unsubscribes = bindingsToTrack.map(key => {
      if (controller.bindings && controller.bindings[key]) {
        return controller.bindings[key].subscribe(value => {
          setState(prev => ({ ...prev, [key]: value }));
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
    // Set up direct event subscriptions if controller has events
    useEffect(() => {
      if (controller.events) {
        const unsubscribes = Object.entries(controller.events).map(([eventName, emitter]) => {
          // Convert event name to React prop name format (e.g., "increment" -> "onIncrement")
          const propName = `on${eventName.charAt(0).toUpperCase() + eventName.slice(1)}`;
          
          // If the prop for this event exists and is a function, subscribe to the event
          if (typeof props[propName] === 'function') {
            return emitter.subscribe((data) => {
              props[propName](data);
            });
          }
          return () => {};
        });
        
        return () => {
          unsubscribes.forEach(unsub => unsub());
        };
      }
    }, [props]);

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
