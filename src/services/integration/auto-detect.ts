import { getAdapterRegistry } from '../adapter';
import { registerAdapter, setDefaultAdapter } from '../../uplink/uplink-protocol';

/**
 * Detects the current framework environment
 */
export function detectFramework(): 'react' | 'vue' | 'angular' | 'svelte' | 'vanilla' {
  if (typeof window === 'undefined') {
    // Server-side rendering environment
    return 'vanilla';
  }
  
  // Check for React
  if ((window as any).React || (window as any).__REACT_DEVTOOLS_GLOBAL_HOOK__) {
    return 'react';
  }
  
  // Check for Vue
  if ((window as any).Vue || document.querySelector('[data-v-app]')) {
    return 'vue';
  }
  
  // Check for Angular
  if ((window as any).ng || (window as any).angular || document.querySelector('[ng-version]')) {
    return 'angular';
  }
  
  // Check for Svelte
  if ((window as any).__SVELTE__ || document.querySelector('.__svelte-hooks__')) {
    return 'svelte';
  }
  
  // Default to vanilla
  return 'vanilla';
}

/**
 * Automatically initializes the appropriate adapter for the detected framework
 * This should be called once during application startup
 */
export function autoInitializeAdapter(): void {
  const registry = getAdapterRegistry();
  
  // Skip if adapters are already registered
  if (registry.getAllAdapters().length > 0) {
    console.log('Uplink Protocol adapters are already registered');
    return;
  }
  
  const framework = detectFramework();
  
  // Import and register the appropriate adapter
  import(`../adapter/${framework}-adapter`).then((module) => {
    const AdapterClass = module[`${framework.charAt(0).toUpperCase() + framework.slice(1)}Adapter`];
    if (AdapterClass) {
      const adapter = new AdapterClass();
      registerAdapter(adapter);
      setDefaultAdapter(adapter.name);
      console.log(`Uplink Protocol initialized with ${adapter.name} adapter`);
    } else {
      // Fallback to vanilla
      import('../adapter/vanilla-adapter').then((vanillaModule) => {
        const VanillaAdapter = vanillaModule.VanillaAdapter;
        const adapter = new VanillaAdapter();
        registerAdapter(adapter);
        setDefaultAdapter(adapter.name);
        console.log(`Uplink Protocol initialized with fallback ${adapter.name} adapter`);
      });
    }
  }).catch(error => {
    console.error(`Error loading adapter for ${framework}:`, error);
    
    // Fallback to vanilla
    import('../adapter/vanilla-adapter').then((vanillaModule) => {
      const VanillaAdapter = vanillaModule.VanillaAdapter;
      const adapter = new VanillaAdapter();
      registerAdapter(adapter);
      setDefaultAdapter(adapter.name);
      console.log(`Uplink Protocol initialized with fallback ${adapter.name} adapter`);
    });
  });
}

// Auto-initialize on script load if in browser environment
if (typeof window !== 'undefined') {
  // Use setTimeout to ensure this runs after all frameworks are initialized
  setTimeout(() => {
    autoInitializeAdapter();
  }, 0);
}
