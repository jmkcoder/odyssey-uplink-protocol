// Export adapters
export * from './adapter.interface';
export * from './adapter-registry.service';
export * from './base-adapter';
export * from './vanilla-adapter';
export * from './react-adapter';

// Export factory function to get the adapter registry singleton
import { AdapterRegistry } from './adapter-registry.service';

/**
 * Get the global adapter registry instance
 */
export function getAdapterRegistry(): AdapterRegistry {
  return AdapterRegistry.getInstance();
}

export { ControllerAdapter } from './controller-adapter';