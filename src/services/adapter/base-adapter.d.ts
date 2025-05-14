import { AdapterInterface } from './adapter.interface';
/**
 * Abstract base class that implements common functionality for all adapters.
 * Framework-specific adapters will extend this class.
 */
export declare abstract class BaseAdapter implements AdapterInterface {
    /**
     * Name of the adapter
     */
    abstract readonly name: string;
    /**
     * Version of the adapter
     */
    abstract readonly version: string;
    /**
     * Map of controllers to their associated elements
     */
    protected controllerMap: Map<any, HTMLElement>;
    /**
     * Initialize the adapter with optional configuration
     */
    initialize(_config?: any): void;
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
    abstract watchProperty(controller: any, propertyName: string, callback: (newValue: any) => void): void;
    /**
     * Update a property value
     * @param controller The controller whose property to update
     * @param propertyName The name of the property to update
     * @param value The new value
     */
    abstract updateProperty(controller: any, propertyName: string, value: any): void;
    /**
     * Call a method on the controller
     * @param controller The controller whose method to call
     * @param methodName The name of the method to call
     * @param args The arguments to pass to the method
     */
    abstract callMethod(controller: any, methodName: string, args?: any[]): any;
    /**
     * Helper method to dispatch DOM events
     * @param element The element to dispatch the event from
     * @param eventName The name of the event
     * @param detail The event detail
     */
    protected dispatchDOMEvent(element: HTMLElement, eventName: string, detail: any): void;
    /**
     * Hook for additional logic when a controller is connected
     * @param _controller The controller being connected
     * @param _element The element associated with the controller
     */
    protected onControllerConnected(_controller: any, _element: HTMLElement): void;
    /**
     * Hook for additional logic when a controller is disconnected
     * @param _controller The controller being disconnected
     * @param _element The element associated with the controller
     */
    protected onControllerDisconnected(_controller: any, _element: HTMLElement): void;
    /**
     * Hook for additional logic when a controller emits an event
     * @param _controller The controller that emitted the event
     * @param _eventName The name of the event
     * @param _eventData The data associated with the event
     */
    protected onControllerEvent(_controller: any, _eventName: string, _eventData: any): void;
}
//# sourceMappingURL=base-adapter.d.ts.map