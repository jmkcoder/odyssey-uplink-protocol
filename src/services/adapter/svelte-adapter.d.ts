import { BaseAdapter } from './base-adapter';
/**
 * SvelteAdapter provides integration for Odyssey controllers with Svelte applications.
 * It bridges the gap between Svelte's reactive store system and the Odyssey Uplink Protocol.
 */
export declare class SvelteAdapter extends BaseAdapter {
    readonly name = "svelte";
    readonly version = "1.0.0";
    private componentStores;
    /**
     * Subscribe to property changes in the controller
     * For Svelte, we create stores that can be subscribed to
     */
    watchProperty(controller: any, propertyName: string, callback: (newValue: any) => void): void;
    /**
     * Update a property value in the controller
     */
    updateProperty(controller: any, propertyName: string, value: any): void;
    /**
     * Call a method on the controller
     */
    callMethod(controller: any, methodName: string, args?: any[]): any;
    /**
     * Set up event forwarding to Svelte component event handlers
     */
    protected onControllerEvent(controller: any, eventName: string, eventData: any): void;
    /**
     * Get a Svelte store for a controller property
     * This method can be exposed to Svelte components to bind to controller properties
     */
    getStore(controller: any, propertyName: string): any;
    /**
     * When a controller connects, set up Svelte-specific bindings
     */
    protected onControllerConnected(controller: any, element: HTMLElement): void;
    /**
     * Clean up Svelte store subscriptions when disconnecting
     */
    protected onControllerDisconnected(controller: any, element: HTMLElement): void;
}
//# sourceMappingURL=svelte-adapter.d.ts.map