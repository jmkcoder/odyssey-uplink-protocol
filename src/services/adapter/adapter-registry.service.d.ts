import { AdapterInterface } from './adapter.interface';
/**
 * AdapterRegistry is a singleton service that manages all framework adapters
 * and provides a central point for controllers to connect to the appropriate adapter.
 */
export declare class AdapterRegistry {
    private static instance;
    private adapters;
    private defaultAdapter;
    private autoDetectEnabled;
    private constructor();
    /**
     * Get the singleton instance of AdapterRegistry
     */
    static getInstance(): AdapterRegistry;
    /**
     * Register an adapter with the registry
     * @param adapter The adapter to register
     */
    registerAdapter(adapter: AdapterInterface): void;
    /**
     * Get an adapter by name
     * @param name The name of the adapter to retrieve
     */
    getAdapter(name: string): AdapterInterface | undefined;
    /**
     * Get all registered adapters
     */
    getAllAdapters(): AdapterInterface[];
    /**
     * Check if an adapter is registered
     * @param name The name of the adapter to check
     */
    hasAdapter(name: string): boolean;
    /**
     * Remove an adapter from the registry
     * @param name The name of the adapter to remove
     */
    removeAdapter(name: string): boolean;
    /**
     * Set the default adapter to use when no specific adapter is requested
     * @param name The name of the adapter to set as default
     */
    setDefaultAdapter(name: string): void;
    /**
     * Get the default adapter
     */
    getDefaultAdapter(): AdapterInterface | undefined;
    /**
     * Enable or disable auto detection of the framework environment
     * @param enabled Whether auto detection should be enabled
     */
    setAutoDetect(enabled: boolean): void;
    /**
     * Get the most appropriate adapter for the current environment
     * Will use auto-detection if enabled, otherwise returns the default adapter
     */ getAppropriateAdapter(): AdapterInterface | undefined;
}
//# sourceMappingURL=adapter-registry.service.d.ts.map