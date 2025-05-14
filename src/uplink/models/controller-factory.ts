import { Controller } from '../interfaces/controller.interface';

/**
 * A registry of controller factories for dependency injection
 */
export class ControllerFactory {
  private static instance: ControllerFactory;
  private factories: Map<string, () => Controller> = new Map();
  
  /**
   * Gets the singleton instance of the ControllerFactory
   */
  public static getInstance(): ControllerFactory {
    if (!ControllerFactory.instance) {
      ControllerFactory.instance = new ControllerFactory();
    }
    return ControllerFactory.instance;
  }
  
  /**
   * Register a factory function for a controller type
   * @param controllerName The name identifier for the controller
   * @param factory A function that creates and returns a controller instance
   */
  public register<T extends Controller>(controllerName: string, factory: () => T): void {
    this.factories.set(controllerName, factory);
  }
  
  /**
   * Get a controller instance by name
   * @param controllerName The name of the controller to create
   */
  public create<T extends Controller>(controllerName: string): T {
    const factory = this.factories.get(controllerName);
    if (!factory) {
      throw new Error(`Controller factory not registered for '${controllerName}'`);
    }
    return factory() as T;
  }
  
  /**
   * Check if a controller factory is registered
   * @param controllerName The name of the controller to check
   */
  public has(controllerName: string): boolean {
    return this.factories.has(controllerName);
  }
  
  /**
   * Remove a controller factory
   * @param controllerName The name of the controller factory to remove
   */
  public unregister(controllerName: string): boolean {
    return this.factories.delete(controllerName);
  }
}

/**
 * Get the global controller factory instance
 */
export function getControllerFactory(): ControllerFactory {
  return ControllerFactory.getInstance();
}

/**
 * Decorator to register a controller class with the factory
 * @param controllerName The name to register the controller under
 */
export function UplinkController(controllerName: string) {
  return function<T extends { new(...args: any[]): Controller }>(constructor: T) {
    const factory = ControllerFactory.getInstance();
    factory.register(controllerName, () => new constructor());
    return constructor;
  };
}
