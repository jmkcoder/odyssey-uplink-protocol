import { IFrameworkContext } from "../interfaces/framework-context.interface";
/**
 * UI Context provides per-UI state and context when a controller
 * is connected to multiple UIs
 */
export declare class UIContext<T = any> {
    private _state;
    private _frameworkContext;
    private _subscriptions;
    constructor(initialState: T, frameworkContext: IFrameworkContext);
    /**
     * Get the framework context
     */
    get frameworkContext(): IFrameworkContext;
    /**
     * Get a reference to the UI element (if available)
     * @deprecated Use frameworkContext instead
     */
    get element(): HTMLElement;
    /**
     * Get the current UI state
     */
    get state(): T;
    /**
     * Update the UI state
     */
    setState(newState: Partial<T>): void;
    /**
     * Add a subscription to be cleaned up when this UI is disconnected
     */
    addSubscription(unsubscribe: () => void): void;
    /**
     * Clean up all subscriptions for this UI
     */
    cleanup(): void;
}
//# sourceMappingURL=ui-context.d.ts.map