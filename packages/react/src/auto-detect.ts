import { getAdapterRegistry, registerAdapter, setDefaultAdapter } from '@uplink-protocol/core';
import { ReactAdapter } from './adapter/react-adapter';

/**
 * Detects if React is available in the current environment
 * 
 * @returns true if React is detected, false otherwise
 */
function isReactAvailable(): boolean {
  // Check for React global object
  if (typeof window !== 'undefined' && (window as any).React) {
    return true;
  }

  // Check for React DevTools
  if (typeof window !== 'undefined' && (window as any).__REACT_DEVTOOLS_GLOBAL_HOOK__) {
    return true;
  }

  return false;
}

/**
 * Detects the current framework environment
 * For the React package, this returns 'react' if React is detected
 */
export function detectFramework(): 'react' | 'vue' | 'angular' | 'svelte' | 'vanilla' {
  return isReactAvailable() ? 'react' : 'vanilla';
}

/**
 * Initializes the React adapter if React is detected
 */
export function autoInitializeAdapter(): void {
  const registry = getAdapterRegistry();
  
  // Skip if adapters are already registered
  if (registry.getAllAdapters().length > 0) {
    console.log('Uplink Protocol adapters are already registered');
    return;
  }

  // Only initialize React adapter if React is detected
  if (isReactAvailable()) {
    const adapter = new ReactAdapter();
    registerAdapter(adapter);
    setDefaultAdapter(adapter.name);
    console.log(`Uplink Protocol initialized with ${adapter.name} adapter`);
  } else {
    // If React isn't available, fall back to core package initialization
    import('../../../src/services/integration/auto-detect').then((coreModule) => {
      coreModule.autoInitializeAdapter();
    }).catch(error => {
      console.error('Error falling back to core initialization:', error);
    });
  }
}

// Auto-initialize on script load if in browser environment
if (typeof window !== 'undefined') {
  // Use setTimeout to ensure this runs after React is initialized
  setTimeout(() => {
    autoInitializeAdapter();
  }, 0);
}
