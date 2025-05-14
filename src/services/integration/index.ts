import { detectFramework } from './auto-detect';

// Export detection utility
export { detectFramework, autoInitializeAdapter } from './auto-detect';

// Export framework-specific integrations with namespace prefixes to avoid conflicts
export * as ReactIntegration from './react';
export * as VueIntegration from './vue';
export * as AngularIntegration from './angular';
export * as SvelteIntegration from './svelte';

// Common exports for framework-agnostic usage
import { useUplink as useReactUplink } from './react';
import { useUplink as useVueUplink } from './vue';
import { useController } from './angular';
import { getController } from './svelte';

// Re-export individual hooks with framework prefixes for direct access
export { useReactUplink as reactUseUplink };
export { useVueUplink as vueUseUplink };
export { useController as angularUseController };
export { getController as svelteGetController };

/**
 * Get the appropriate hook for the current framework
 * @returns A framework-specific hook function
 */
export function getFrameworkHook() {
  const framework = detectFramework();
  switch (framework) {
    case 'react':
      return useReactUplink;
    case 'vue':
      return useVueUplink;
    case 'angular':
      return useController;
    case 'svelte':
      return getController;
    default:
      // Return a simple function that just returns the controller for vanilla
      return (controller: any) => ({ controller });
  }
}

// Always export core functions
export { connectController, disconnectController } from '../../uplink/uplink-protocol';
