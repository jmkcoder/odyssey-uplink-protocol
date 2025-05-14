export * from './adapter.interface';
export * from './adapter-registry.service';
export * from './base-adapter';
export * from './vanilla-adapter';
export * from './react-adapter';
import { AdapterRegistry } from './adapter-registry.service';
/**
 * Get the global adapter registry instance
 */
export declare function getAdapterRegistry(): AdapterRegistry;
export { ControllerAdapter } from './controller-adapter';
//# sourceMappingURL=index.d.ts.map