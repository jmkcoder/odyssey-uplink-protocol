import { BaseAdapter } from './base-adapter';
/**
 * VanillaAdapter provides integration for Odyssey controllers with vanilla JavaScript
 * and standard Web Components without requiring any framework.
 */
export declare class VanillaAdapter extends BaseAdapter {
    readonly name = "vanilla";
    readonly version = "1.0.0";
    /**
     * Subscribe to property changes in the controller
     * In vanilla JS, we use the controller's own binding mechanism
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
     * Set up standard event listeners for DOM events
     */
    protected onControllerConnected(controller: any, element: HTMLElement): void;
}
//# sourceMappingURL=vanilla-adapter.d.ts.map