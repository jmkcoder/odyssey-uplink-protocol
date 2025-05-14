import { BaseAdapter } from './base-adapter';
/**
 * VueAdapter provides integration for Odyssey controllers with Vue applications.
 * It bridges the gap between Vue's reactivity system and the Odyssey Uplink Protocol.
 */
export declare class VueAdapter extends BaseAdapter {
    readonly name = "vue";
    readonly version = "1.0.0";
    private componentInstances;
    /**
     * Subscribe to property changes in the controller
     * For Vue, we leverage Vue's reactivity system to watch properties
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
     * Set up event forwarding to Vue component event handlers
     */
    protected onControllerEvent(controller: any, eventName: string, eventData: any): void;
    /**
     * When a controller connects, set up Vue-specific bindings
     */
    protected onControllerConnected(controller: any, element: HTMLElement): void;
    /**
     * Clean up Vue component instances when disconnecting
     */
    protected onControllerDisconnected(controller: any, element: HTMLElement): void;
}
//# sourceMappingURL=vue-adapter.d.ts.map