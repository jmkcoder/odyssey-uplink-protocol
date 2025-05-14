/**
 * EventBatching utility
 *
 * A utility for batching multiple state changes and dispatching a single event.
 * This helps improve performance and avoid redundant event dispatching.
 */
/**
 * Callback for handling batched events
 */
export type BatchedEventHandler<T = any> = (eventTypes: Set<string>, metadata?: T) => void;
/**
 * Configuration options for the EventBatcher
 */
export interface EventBatcherOptions {
    /**
     * Debounce time in milliseconds
     */
    debounceTime?: number;
}
/**
 * EventBatcher class for batching multiple events into a single callback
 */
export declare class EventBatcher<T = any> {
    private pendingEvent;
    private eventBatch;
    private eventBatchTimer;
    private debounceTime;
    private metadata?;
    private handler;
    /**
     * Create a new EventBatcher
     *
     * @param handler Function that will be called with all batched event types
     * @param options Configuration options
     */
    constructor(handler: BatchedEventHandler<T>, options?: EventBatcherOptions);
    /**
     * Add an event type to the current batch
     *
     * @param eventType Type/name of the event to add to the batch
     * @param immediate If true, process the batch immediately instead of waiting for the debounce
     */
    addEvent(eventType: string, immediate?: boolean): void;
    /**
     * Set metadata to be included with the batch
     * This can be used to pass additional information to the handler
     *
     * @param data Any data to associate with this batch
     */
    setMetadata(data: T): void;
    /**
     * Process the current batch of events
     */
    processBatch(): void;
    /**
     * Check if the batch contains a specific event type
     *
     * @param eventType Type/name of the event to check for
     * @returns True if the batch contains the event type
     */
    has(eventType: string): boolean;
    /**
     * Clear all pending events without processing them
     */
    clear(): void;
}
/**
 * Create a simple batched event dispatcher that dispatches CustomEvents
 *
 * @param element The HTML element to dispatch events on
 * @param eventName The name of the custom event to dispatch
 * @param options Configuration options
 * @returns An EventBatcher instance
 *
 * @example
 * // Create a batched event dispatcher
 * const batchedDispatcher = createBatchedEventDispatcher(myElement, 'state-change');
 *
 * // Add events to the batch
 * batchedDispatcher.addEvent('value-change');
 * batchedDispatcher.addEvent('selection-change');
 *
 * // The handler will be called once with both event types after the debounce time
 */
export declare function createBatchedEventDispatcher<T = any>(element: HTMLElement, eventName: string, options?: EventBatcherOptions): EventBatcher<T>;
//# sourceMappingURL=event-batching.d.ts.map