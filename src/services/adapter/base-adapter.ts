import { AdapterInterface } from './adapter.interface';

/**
 * Abstract base class that implements common functionality for all adapters.
 * Framework-specific adapters will extend this class.
 */
export abstract class BaseAdapter implements AdapterInterface {
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
  protected controllerMap: Map<any, HTMLElement> = new Map();

  /**
   * Initialize the adapter with optional configuration
   */
  public initialize(_config?: any): void {
    // Default implementation does nothing
    console.log(`${this.name} adapter initialized (v${this.version})`);
  }

  /**
   * Connect a controller to the adapter
   * @param controller The controller to connect
   * @param element The DOM element associated with the controller
   */
  public connectController(controller: any, element: HTMLElement): void {
    this.controllerMap.set(controller, element);
    this.onControllerConnected(controller, element);
  }

  /**
   * Disconnect a controller from the adapter
   * @param controller The controller to disconnect
   */
  public disconnectController(controller: any): void {
    if (this.controllerMap.has(controller)) {
      const element = this.controllerMap.get(controller)!;
      this.onControllerDisconnected(controller, element);
      this.controllerMap.delete(controller);
    }
  }

  /**
   * Handle an event from a controller
   * @param controller The controller that emitted the event
   * @param eventName The name of the event
   * @param eventData The data associated with the event
   */
  public handleEvent(controller: any, eventName: string, eventData: any): void {
    const element = this.controllerMap.get(controller);
    if (element) {
      this.dispatchDOMEvent(element, eventName, eventData);
    }
    this.onControllerEvent(controller, eventName, eventData);
  }

  /**
   * Subscribe to property changes
   * @param controller The controller whose property we're watching
   * @param propertyName The name of the property to watch
   * @param callback The function to call when the property changes
   */
  public abstract watchProperty(
    controller: any, 
    propertyName: string, 
    callback: (newValue: any) => void
  ): void;

  /**
   * Update a property value
   * @param controller The controller whose property to update
   * @param propertyName The name of the property to update
   * @param value The new value
   */
  public abstract updateProperty(
    controller: any, 
    propertyName: string, 
    value: any
  ): void;

  /**
   * Call a method on the controller
   * @param controller The controller whose method to call
   * @param methodName The name of the method to call
   * @param args The arguments to pass to the method
   */
  public abstract callMethod(
    controller: any, 
    methodName: string, 
    args?: any[]
  ): any;

  /**
   * Helper method to dispatch DOM events
   * @param element The element to dispatch the event from
   * @param eventName The name of the event
   * @param detail The event detail
   */
  protected dispatchDOMEvent(element: HTMLElement, eventName: string, detail: any): void {
    const event = new CustomEvent(eventName, {
      bubbles: true,
      cancelable: true,
      detail
    });
    element.dispatchEvent(event);
  }

  /**
   * Hook for additional logic when a controller is connected
   * @param _controller The controller being connected
   * @param _element The element associated with the controller
   */
  protected onControllerConnected(_controller: any, _element: HTMLElement): void {
    // To be overridden by subclasses if needed
  }

  /**
   * Hook for additional logic when a controller is disconnected
   * @param _controller The controller being disconnected
   * @param _element The element associated with the controller
   */
  protected onControllerDisconnected(_controller: any, _element: HTMLElement): void {
    // To be overridden by subclasses if needed
  }

  /**
   * Hook for additional logic when a controller emits an event
   * @param _controller The controller that emitted the event
   * @param _eventName The name of the event
   * @param _eventData The data associated with the event
   */
  protected onControllerEvent(_controller: any, _eventName: string, _eventData: any): void {
    // To be overridden by subclasses if needed
  }
}