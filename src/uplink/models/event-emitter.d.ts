import { Controller } from "../interfaces/controller.interface";
import { Unsubscribe } from "../types/unsubscribe.type";
/**
 * Event emitter for the pub/sub pattern
 */
export declare class EventEmitter<T> {
    private listeners;
    private adapter?;
    private eventName?;
    constructor(eventName?: string);
    /**
     * Connect this event emitter to a controller and its adapter
     */
    connectToAdapter(controller: Controller, eventName: string): void;
    emit(value: T): void;
    subscribe(callback: (value: T) => void): Unsubscribe;
}
//# sourceMappingURL=event-emitter.d.ts.map