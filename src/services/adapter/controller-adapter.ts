import { AdapterRegistry } from './adapter-registry.service';
import { AdapterInterface } from './adapter.interface';
import { VanillaAdapter } from './vanilla-adapter';

/**
 * The ControllerAdapter is a utility class that helps controllers connect to 
 * the global adapter system. It provides a simplified interface for controllers
 * to use adapters without needing to directly interact with the registry.
 */
export class ControllerAdapter {
  private registry: AdapterRegistry;
  private adapter: AdapterInterface;
  private controller: any;
  private element: HTMLElement | null = null;
  
  /**
   * Create a new ControllerAdapter for a specific controller
   * @param controller The controller to adapt
   * @param adapterName Optional: specific adapter name to use
   */
  constructor(controller: any, adapterName?: string) {
    this.controller = controller;
    this.registry = AdapterRegistry.getInstance();
    
    // Get the appropriate adapter
    if (adapterName && this.registry.hasAdapter(adapterName)) {
      this.adapter = this.registry.getAdapter(adapterName)!;
    } else {
      // Auto-detect or use default adapter
      const autoAdapter = this.registry.getAppropriateAdapter();
      
      if (autoAdapter) {
        this.adapter = autoAdapter;
      } else {
        // If no adapters are registered yet, create and register a vanilla adapter
        const vanillaAdapter = new VanillaAdapter();
        this.registry.registerAdapter(vanillaAdapter);
        this.adapter = vanillaAdapter;
      }
    }
  }
  
  /**
   * Connect the controller to an HTML element
   * @param element The element to connect to
   */
  public connect(element: HTMLElement): void {
    this.element = element;
    this.adapter.connectController(this.controller, element);
  }
  
  /**
   * Disconnect the controller from its HTML element
   */
  public disconnect(): void {
    if (this.element) {
      this.adapter.disconnectController(this.controller);
      this.element = null;
    }
  }
  
  /**
   * Emit an event from the controller
   * @param eventName The name of the event
   * @param eventData The data to include with the event
   */
  public emitEvent(eventName: string, eventData: any): void {
    this.adapter.handleEvent(this.controller, eventName, eventData);
  }
  
  /**
   * Watch a property for changes
   * @param propertyName The name of the property to watch
   * @param callback The function to call when the property changes
   */
  public watchProperty(propertyName: string, callback: (newValue: any) => void): void {
    this.adapter.watchProperty(this.controller, propertyName, callback);
  }
  
  /**
   * Update a property value
   * @param propertyName The name of the property to update
   * @param value The new value
   */
  public updateProperty(propertyName: string, value: any): void {
    this.adapter.updateProperty(this.controller, propertyName, value);
  }
  
  /**
   * Call a method on the controller
   * @param methodName The name of the method to call
   * @param args The arguments to pass to the method
   */
  public callMethod(methodName: string, args?: any[]): any {
    return this.adapter.callMethod(this.controller, methodName, args);
  }
  
  /**
   * Get the adapter being used by this controller adapter
   */
  public getAdapter(): AdapterInterface {
    return this.adapter;
  }
  
  /**
   * Change the adapter for this controller
   * @param adapterName The name of the adapter to use
   */
  public setAdapter(adapterName: string): boolean {
    if (this.registry.hasAdapter(adapterName)) {
      const newAdapter = this.registry.getAdapter(adapterName)!;
      
      // Disconnect from the old adapter
      if (this.element) {
        this.adapter.disconnectController(this.controller);
      }
      
      // Switch to the new adapter
      this.adapter = newAdapter;
      
      // Reconnect if we have an element
      if (this.element) {
        this.adapter.connectController(this.controller, this.element);
      }
      
      return true;
    }
    
    return false;
  }
}