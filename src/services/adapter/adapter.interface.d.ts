/**
 * The AdapterInterface defines the contract that all framework adapters must implement
 * to work with the Odyssey Uplink Protocol.
 */
export interface AdapterInterface {
    /**
     * Name of the adapter (e.g., 'react', 'angular', 'vue', etc.)
     */
    readonly name: string;
    /**
     * Version of the adapter
     */
    readonly version: string;
    /**
     * Initialize the adapter with optional configuration
     */
    initialize(config?: any): void;
    /**
     * Connect a controller to the adapter
     * @param controller The controller to connect
     * @param element The DOM element associated with the controller
     */
    connectController(controller: any, element: HTMLElement): void;
    /**
     * Disconnect a controller from the adapter
     * @param controller The controller to disconnect
     */
    disconnectController(controller: any): void;
    /**
     * Handle an event from a controller
     * @param controller The controller that emitted the event
     * @param eventName The name of the event
     * @param eventData The data associated with the event
     */
    handleEvent(controller: any, eventName: string, eventData: any): void;
    /**
     * Subscribe to property changes
     * @param controller The controller whose property we're watching
     * @param propertyName The name of the property to watch
     * @param callback The function to call when the property changes
     */
    watchProperty(controller: any, propertyName: string, callback: (newValue: any) => void): void;
    /**
     * Update a property value
     * @param controller The controller whose property to update
     * @param propertyName The name of the property to update
     * @param value The new value
     */
    updateProperty(controller: any, propertyName: string, value: any): void;
    /**
     * Call a method on the controller
     * @param controller The controller whose method to call
     * @param methodName The name of the method to call
     * @param args The arguments to pass to the method
     */
    callMethod(controller: any, methodName: string, args?: any[]): any;
}
//# sourceMappingURL=adapter.interface.d.ts.map