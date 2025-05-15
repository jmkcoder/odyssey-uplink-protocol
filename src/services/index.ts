/**
 * Core services only - Framework adapters are excluded from the core package
 */
export * from './adapter';

// Export auto-detection functionality but not the framework-specific integrations
export { detectFramework, autoInitializeAdapter } from './integration/auto-detect';