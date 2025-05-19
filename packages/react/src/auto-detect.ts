import { getAdapterRegistry, registerAdapter, setDefaultAdapter } from '@uplink-protocol/core';
import { ReactAdapter } from './adapter/react-adapter';

// Add type declaration for global uplink protocol core
declare global {
  interface Window {
    __uplinkProtocolCore?: {
      autoInitializeAdapter: () => void;
    };
  }
}

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
    // For non-browser environments or when React is not available
    console.log('React not detected, initializing with default adapter');
    
    // Instead of dynamic import, use the VanillaAdapter directly
    // This eliminates code splitting while ensuring we have an adapter
    try {
      // Import directly from core package
      const CorePackage = require('@uplink-protocol/core');
      if (CorePackage && CorePackage.VanillaAdapter) {
        const vanillaAdapter = new CorePackage.VanillaAdapter();
        registerAdapter(vanillaAdapter);
        setDefaultAdapter(vanillaAdapter.name);
      } else {
        console.warn('Failed to load VanillaAdapter from core package');
      }
    } catch (error) {
      console.error('Error initializing adapter:', error);
    }
  }
}

// Auto-initialize on script load if in browser environment
if (typeof window !== 'undefined') {
  // Use setTimeout to ensure this runs after React is initialized
  setTimeout(() => {
    autoInitializeAdapter();
  }, 0);
}
