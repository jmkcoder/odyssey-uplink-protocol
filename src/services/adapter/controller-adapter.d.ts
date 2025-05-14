import { AdapterInterface } from './adapter.interface';
/**
 * The ControllerAdapter is a utility class that helps controllers connect to
 * the global adapter system. It provides a simplified interface for controllers
 * to use adapters without needing to directly interact with the registry.
 */
export declare class ControllerAdapter {
    private registry;
    private adapter;
    private controller;
    private element;
    /**
     * Create a new ControllerAdapter for a specific controller
     * @param controller The controller to adapt
     * @param adapterName Optional: specific adapter name to use
     */
    constructor(controller: any, adapterName?: string);
    /**
     * Connect the controller to an HTML element
     * @param element The element to connect to
     */
    connect(element: HTMLElement): void;
    /**
     * Disconnect the controller from its HTML element
     */
    disconnect(): void;
    /**
     * Emit an event from the controller
     * @param eventName The name of the event
     * @param eventData The data to include with the event
     */
    emitEvent(eventName: string, eventData: any): void;
    /**
     * Watch a property for changes
     * @param propertyName The name of the property to watch
     * @param callback The function to call when the property changes
     */
    watchProperty(propertyName: string, callback: (newValue: any) => void): void;
    /**
     * Update a property value
     * @param propertyName The name of the property to update
     * @param value The new value
     */
    updateProperty(propertyName: string, value: any): void;
    /**
     * Call a method on the controller
     * @param methodName The name of the method to call
     * @param args The arguments to pass to the method
     */
    callMethod(methodName: string, args?: any[]): any;
    /**
     * Get the adapter being used by this controller adapter
     */
    getAdapter(): AdapterInterface;
    /**
     * Change the adapter for this controller
     * @param adapterName The name of the adapter to use
     */
    setAdapter(adapterName: string): boolean;
}
//# sourceMappingURL=controller-adapter.d.ts.map