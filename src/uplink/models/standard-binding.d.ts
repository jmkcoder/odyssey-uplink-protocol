import { Binding } from "../interfaces/binding.interface";
import { Unsubscribe } from "../types/unsubscribe.type";
/**
 * Standard binding implementation
 */
export declare class StandardBinding<T> implements Binding<T> {
    private _value;
    private subscribers;
    constructor(initialValue: T);
    get current(): T;
    set(value: T): void;
    subscribe(callback: (value: T) => void): Unsubscribe;
}
//# sourceMappingURL=standard-binding.d.ts.map