import { getAdapterRegistry } from '../adapter';
import { registerAdapter, setDefaultAdapter } from '../../uplink/uplink-protocol';

/**
 * Detects the current framework environment
 * 
 * Note: In the core package, this always returns 'vanilla'.
 * The framework-specific detection logic is implemented in each framework package:
 * - @uplink-protocol/react
 * - @uplink-protocol/vue
 * - @uplink-protocol/angular
 * - @uplink-protocol/svelte
 */
export function detectFramework(): 'react' | 'vue' | 'angular' | 'svelte' | 'vanilla' {
  // In the core package, we only support vanilla
  return 'vanilla';
}

/**
 * Initializes the vanilla adapter in the core package
 * 
 * Note: In the core package, only the vanilla adapter is available.
 * Framework-specific adapters are available in their respective packages:
 * - @uplink-protocol/react
 * - @uplink-protocol/vue
 * - @uplink-protocol/angular
 * - @uplink-protocol/svelte
 */
export function autoInitializeAdapter(): void {
  const registry = getAdapterRegistry();
  
  // Skip if adapters are already registered
  if (registry.getAllAdapters().length > 0) {
    console.log('Uplink Protocol adapters are already registered');
    return;
  }
    // In the core package, we only support the vanilla adapter
  // Framework-specific packages will override this method to support their own adapters
  
  // Import and register the vanilla adapter
  import('../adapter/vanilla-adapter').then((vanillaModule) => {
    const VanillaAdapter = vanillaModule.VanillaAdapter;
    const adapter = new VanillaAdapter();
    registerAdapter(adapter);
    setDefaultAdapter(adapter.name);
    console.log(`Uplink Protocol core initialized with ${adapter.name} adapter`);
  }).catch(error => {
    console.error(`Error loading vanilla adapter:`, error);
  });
}

// Auto-initialize on script load if in browser environment
if (typeof window !== 'undefined') {
  // Use setTimeout to ensure this runs after all frameworks are initialized
  setTimeout(() => {
    autoInitializeAdapter();
  }, 0);
}
