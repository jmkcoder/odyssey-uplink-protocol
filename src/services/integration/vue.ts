import { ref, reactive, onMounted, onBeforeUnmount, Component, h, defineComponent } from 'vue';
import { Controller } from '../../uplink/interfaces/controller.interface';
import { TypedController, ControllerState } from '../../uplink/interfaces/framework-controller.interface';
import { connectController, disconnectController } from '../../uplink/uplink-protocol';
import { getControllerFactory } from '../../uplink/models/controller-factory';
import './auto-detect'; // Ensure adapter is initialized

/**
 * Props for UplinkContainer
 */
export interface UplinkContainerProps {
  controller: Controller;
  [key: string]: any; // Allow any other props for event handlers
}

/**
 * Component that connects a controller to the Vue component tree
 */
export const UplinkContainer = defineComponent({
  name: 'UplinkContainer',
  props: {
    controller: {
      type: Object,
      required: true
    }
  },
  setup(props: UplinkContainerProps, { slots, attrs }) {
    const containerRef = ref<HTMLElement | null>(null);
    
    onMounted(() => {
      if (containerRef.value) {
        // Store Vue component reference for event handling
        (containerRef.value as any).__vueComponent = {
          emit: attrs.onEvent
        };
        
        // Connect the controller
        connectController(props.controller, containerRef.value, 'vue');
      }
    });
    
    onBeforeUnmount(() => {
      disconnectController(props.controller);
    });
    
    return () => h('div', {
      ref: containerRef,
      'data-uplink-controller': true,
      ...attrs
    }, slots.default ? slots.default() : []);
  }
});

/**
 * Type for composable options
 */
interface UseUplinkOptions {
  trackBindings?: string[] | 'all';
  autoConnect?: boolean;
}

/**
 * Type for composable return value with generic support
 */
interface UseUplinkResult<T extends TypedController> {
  controller: T;
  state: ControllerState<T>;
  methods: T['methods'] extends Record<string, (...args: any[]) => any> ? T['methods'] : Record<string, never>;
  Container: Component;
}

/**
 * Vue composable for using Uplink controllers in Vue components
 * 
 * @example
 * <template>
 *   <Container>
 *     <div>Count: {{ state.count }}</div>
 *     <button @click="methods.increment">+</button>
 *   </Container>
 * </template>
 * 
 * <script>
 * import { useUplink } from 'odyssey/uplink/vue';
 * import CounterController from './controllers/counter-controller';
 * 
 * export default {
 *   setup() {
 *     const { state, methods, Container } = useUplink(new CounterController());
 *     return { state, methods, Container };
 *   }
 * }
 * </script>
 */
export function useUplink<T extends TypedController>(
  controllerInput: T | (() => T) | string,
  options: UseUplinkOptions = {}
): UseUplinkResult<T> {
  // Create or use the provided controller
  let controller: T;
  
  if (typeof controllerInput === 'string') {
    // Get controller from factory if string name is provided
    controller = getControllerFactory().create<T>(controllerInput);
  } else if (typeof controllerInput === 'function') {
    // Call the factory function
    controller = (controllerInput as () => T)();
  } else {
    // Use the provided controller instance
    controller = controllerInput;
  }
  
  // Set up reactive state from bindings
  const state = reactive({} as Record<string, any>);
  
  // Initialize state with current binding values
  const bindingsToTrack = options.trackBindings === 'all'
    ? Object.keys(controller.bindings || {})
    : (options.trackBindings || []);
    
  bindingsToTrack.forEach(key => {
    if (controller.bindings && controller.bindings[key]) {
      state[key] = controller.bindings[key].current;
    }
  });
  
  // Create subscriptions when component is mounted
  onMounted(() => {
    bindingsToTrack.forEach(key => {
      if (controller.bindings && controller.bindings[key]) {
        controller.bindings[key].subscribe((value: any) => {
          state[key] = value;
        });
      }
    });
  });
  
  // Clean up subscriptions when component is unmounted
  onBeforeUnmount(() => {
    // Disconnecting the controller will clean up subscriptions
    if (options.autoConnect !== false) {
      disconnectController(controller);
    }
  });
  
  // Create wrapper component bound to this controller
  const Container = {
    name: 'UplinkControllerContainer',
    setup(props: any, { slots }: { slots: any }) {
      return () => h(UplinkContainer, {
        controller,
        ...props
      }, slots);
    }
  };
  
  return {
    controller,
    state: state as ControllerState<T>,
    methods: (controller.methods || {}) as T['methods'] extends Record<string, (...args: any[]) => any> ? T['methods'] : Record<string, never>,
    Container
  };
}
