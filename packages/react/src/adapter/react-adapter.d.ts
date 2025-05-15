import { BaseAdapter } from '@uplink-protocol/core';
/**
 * ReactAdapter provides integration for Odyssey controllers with React applications.
 * It bridges the gap between React's component model and the Odyssey Uplink Protocol.
 */
export declare class ReactAdapter extends BaseAdapter {
    readonly name = "react";
    readonly version = "1.0.0";
    private componentHooks;
    /**
     * Subscribe to property changes in the controller
     * For React, we need to track which properties are being watched so we can
     * trigger re-renders appropriately
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
     * Set up event forwarding to React props
     */
    protected onControllerEvent(controller: any, eventName: string, eventData: any): void;
    /**
     * When a controller connects, set up React-specific bindings
     */
    protected onControllerConnected(controller: any, element: HTMLElement): void;
    /**
     * Clean up React hooks when disconnecting
     */
    protected onControllerDisconnected(controller: any, element: HTMLElement): void;
}
//# sourceMappingURL=react-adapter.d.ts.map