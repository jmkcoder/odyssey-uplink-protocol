import { Controller, EventEmitter, StandardBinding } from "../../../uplink";
/**
 * Simple counter controller for examples
 */
export declare class CounterController implements Controller {
    bindings: {
        count: StandardBinding<number>;
        isEven: StandardBinding<boolean>;
    };
    events: {
        increment: EventEmitter<number>;
        decrement: EventEmitter<number>;
        reset: EventEmitter<void>;
    };
    methods: {
        increment: () => void;
        decrement: () => void;
        reset: () => void;
    };
}
//# sourceMappingURL=counter.controller.d.ts.map