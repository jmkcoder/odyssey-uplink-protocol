import { TypedController, Binding, EventEmitter } from "../../../uplink";
interface CounterBindings {
    count: Binding<number>;
    isEven: Binding<boolean>;
    doubleCount: Binding<number>;
    [key: string]: Binding<any>;
}
interface CounterMethods {
    increment(): void;
    decrement(): void;
    reset(): void;
    incrementBy(value: number): void;
    [key: string]: (...args: any[]) => any;
}
interface CounterEvents {
    increment: EventEmitter<number>;
    decrement: EventEmitter<number>;
    reset: EventEmitter<void>;
    [key: string]: EventEmitter<any>;
}
/**
 * Example of a strongly typed controller implementation
 * This provides full type safety when used with framework integration hooks
 */
export declare class TypedCounterController implements TypedController<CounterBindings, CounterMethods, CounterEvents> {
    bindings: CounterBindings;
    methods: CounterMethods;
    events: CounterEvents;
    private updateState;
}
export {};
//# sourceMappingURL=typed-counter.controller.d.ts.map