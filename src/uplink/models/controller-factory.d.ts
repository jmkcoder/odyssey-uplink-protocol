import { Controller } from '../interfaces/controller.interface';
/**
 * A registry of controller factories for dependency injection
 */
export declare class ControllerFactory {
    private static instance;
    private factories;
    /**
     * Gets the singleton instance of the ControllerFactory
     */
    static getInstance(): ControllerFactory;
    /**
     * Register a factory function for a controller type
     * @param controllerName The name identifier for the controller
     * @param factory A function that creates and returns a controller instance
     */
    register<T extends Controller>(controllerName: string, factory: () => T): void;
    /**
     * Get a controller instance by name
     * @param controllerName The name of the controller to create
     */
    create<T extends Controller>(controllerName: string): T;
    /**
     * Check if a controller factory is registered
     * @param controllerName The name of the controller to check
     */
    has(controllerName: string): boolean;
    /**
     * Remove a controller factory
     * @param controllerName The name of the controller factory to remove
     */
    unregister(controllerName: string): boolean;
}
/**
 * Get the global controller factory instance
 */
export declare function getControllerFactory(): ControllerFactory;
/**
 * Decorator to register a controller class with the factory
 * @param controllerName The name to register the controller under
 */
export declare function UplinkController(controllerName: string): <T extends {
    new (...args: any[]): Controller;
}>(constructor: T) => T;
//# sourceMappingURL=controller-factory.d.ts.map