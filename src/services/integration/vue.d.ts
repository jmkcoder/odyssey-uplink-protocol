import { Component } from 'vue';
import { Controller } from '../../uplink/interfaces/controller.interface';
import { TypedController, ControllerState } from '../../uplink/interfaces/framework-controller.interface';
import './auto-detect';
/**
 * Props for UplinkContainer
 */
export interface UplinkContainerProps {
    controller: Controller;
    [key: string]: any;
}
/**
 * Component that connects a controller to the Vue component tree
 */
export declare const UplinkContainer: import("vue").DefineComponent<{
    [x: string]: /*elided*/ any;
    controller: Controller;
}, () => import("vue").VNode<import("vue").RendererNode, import("vue").RendererElement, {
    [key: string]: any;
}>, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<{
    [x: string]: /*elided*/ any;
    controller: Controller;
}> & Readonly<{}>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
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
export declare function useUplink<T extends TypedController>(controllerInput: T | (() => T) | string, options?: UseUplinkOptions): UseUplinkResult<T>;
export {};
//# sourceMappingURL=vue.d.ts.map