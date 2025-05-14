import { BaseAdapter } from './base-adapter';
/**
 * AngularAdapter provides integration for Odyssey controllers with Angular applications.
 * It bridges the gap between Angular's change detection system and the Odyssey Uplink Protocol.
 */
export declare class AngularAdapter extends BaseAdapter {
    readonly name = "angular";
    readonly version = "1.0.0";
    private componentRefs;
    /**
     * Subscribe to property changes in the controller
     * For Angular, we need to trigger change detection when properties change
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
     * Set up event forwarding to Angular component event handlers
     */
    protected onControllerEvent(controller: any, eventName: string, eventData: any): void;
    /**
     * When a controller connects, set up Angular-specific bindings
     */
    protected onControllerConnected(controller: any, element: HTMLElement): void;
    /**
     * Clean up Angular references when disconnecting
     */
    protected onControllerDisconnected(controller: any, element: HTMLElement): void;
    /**
     * Helper method to trigger Angular change detection
     */
    private triggerChangeDetection;
}
//# sourceMappingURL=angular-adapter.d.ts.map