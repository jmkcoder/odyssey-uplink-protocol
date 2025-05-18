/**
 * Auto-detect framework and initialize appropriate adapter
 * This module is used by the core package to auto-detect the framework and register the appropriate adapter
 */
import { getAdapterRegistry } from '../adapter';
import { VanillaAdapter } from '../adapter/vanilla-adapter';

/**
 * Detects if a particular framework is available in the current environment
 * For the core package, this only supports vanilla JS
 */
export function detectFramework(): 'react' | 'vue' | 'angular' | 'svelte' | 'vanilla' {
  return 'vanilla';
}

/**
 * Initializes the vanilla adapter
 * This is the same as the initializeVanillaAdapter function from vanilla-integration.ts
 */
export function autoInitializeAdapter(): void {
  const registry = getAdapterRegistry();
  
  // Skip if adapters are already registered
  if (registry.getAllAdapters().length > 0) {
    console.log('Uplink Protocol adapters are already registered');
    return;
  }
  
  // Initialize vanilla adapter
  const vanillaAdapter = new VanillaAdapter();
  registry.registerAdapter(vanillaAdapter);
  registry.setDefaultAdapter('vanilla');
  console.log('Uplink Protocol initialized with vanilla adapter');
}

// Auto-initialize on script load if in browser environment
if (typeof window !== 'undefined') {
  // Use setTimeout to ensure this runs at the end of the current execution cycle
  setTimeout(() => {
    autoInitializeAdapter();
  }, 0);
}
