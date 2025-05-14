import { AdapterInterface } from './adapter.interface';

/**
 * AdapterRegistry is a singleton service that manages all framework adapters
 * and provides a central point for controllers to connect to the appropriate adapter.
 */
export class AdapterRegistry {
  private static instance: AdapterRegistry;
  private adapters: Map<string, AdapterInterface> = new Map();
  private defaultAdapter: string | null = null;
  private autoDetectEnabled = true;

  private constructor() {
    // Private constructor to prevent direct instantiation
  }

  /**
   * Get the singleton instance of AdapterRegistry
   */
  public static getInstance(): AdapterRegistry {
    if (!AdapterRegistry.instance) {
      AdapterRegistry.instance = new AdapterRegistry();
    }
    return AdapterRegistry.instance;
  }

  /**
   * Register an adapter with the registry
   * @param adapter The adapter to register
   */
  public registerAdapter(adapter: AdapterInterface): void {
    this.adapters.set(adapter.name, adapter);
    
    // Initialize the adapter
    adapter.initialize();
    
    // Set as default if it's the first one registered
    if (!this.defaultAdapter) {
      this.setDefaultAdapter(adapter.name);
    }
  }

  /**
   * Get an adapter by name
   * @param name The name of the adapter to retrieve
   */
  public getAdapter(name: string): AdapterInterface | undefined {
    return this.adapters.get(name);
  }

  /**
   * Get all registered adapters
   */
  public getAllAdapters(): AdapterInterface[] {
    return Array.from(this.adapters.values());
  }

  /**
   * Check if an adapter is registered
   * @param name The name of the adapter to check
   */
  public hasAdapter(name: string): boolean {
    return this.adapters.has(name);
  }

  /**
   * Remove an adapter from the registry
   * @param name The name of the adapter to remove
   */
  public removeAdapter(name: string): boolean {
    return this.adapters.delete(name);
  }

  /**
   * Set the default adapter to use when no specific adapter is requested
   * @param name The name of the adapter to set as default
   */
  public setDefaultAdapter(name: string): void {
    if (!this.hasAdapter(name)) {
      throw new Error(`Cannot set default adapter: adapter '${name}' is not registered`);
    }
    this.defaultAdapter = name;
  }

  /**
   * Get the default adapter
   */
  public getDefaultAdapter(): AdapterInterface | undefined {
    return this.defaultAdapter ? this.adapters.get(this.defaultAdapter) : undefined;
  }

  /**
   * Enable or disable auto detection of the framework environment
   * @param enabled Whether auto detection should be enabled
   */
  public setAutoDetect(enabled: boolean): void {
    this.autoDetectEnabled = enabled;
  }

  /**
   * Get the most appropriate adapter for the current environment
   * Will use auto-detection if enabled, otherwise returns the default adapter
   */
  public getAppropriateAdapter(): AdapterInterface | undefined {
    if (!this.autoDetectEnabled || !this.adapters.size) {
      return this.getDefaultAdapter();
    }

    // Auto-detect the framework based on global objects
    if (typeof window !== 'undefined') {
      if ((window as any)['React'] && (window as any)['ReactDOM']) {
        return this.getAdapter('react') || this.getDefaultAdapter();
      } else if ((window as any)['Vue']) {
        return this.getAdapter('vue') || this.getDefaultAdapter();
      } else if ((window as any)['ng'] || (window as any)['angular']) {
        return this.getAdapter('angular') || this.getDefaultAdapter();
      }
    }

    // Fall back to default adapter if auto-detection fails
    return this.getDefaultAdapter();
  }
}