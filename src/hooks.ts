/**
 * Odyssey Uplink Protocol - Framework Hooks
 * 
 * This file provides convenient access to framework-specific hooks and utilities
 * for integrating controllers with different UI frameworks.
 */

// Import and re-export framework-specific hooks
import { useUplink as reactUseUplink } from './services/integration/react';
import { useUplink as vueUseUplink } from './services/integration/vue';
import { useController as angularUseController, ControllerService } from './services/integration/angular';
import { getController as svelteGetController, connectElement } from './services/integration/svelte';
import { detectFramework } from './services/integration/auto-detect';

// React integration
export const react = {
  useUplink: reactUseUplink
};

// Vue integration
export const vue = {
  useUplink: vueUseUplink
};

// Angular integration
export const angular = {
  useController: angularUseController,
  ControllerService
};

// Svelte integration
export const svelte = {
  getController: svelteGetController,
  connectElement
};

/**
 * Get the appropriate hook for the current framework
 * 
 * This is a utility function that returns the appropriate hook for the current
 * framework based on auto-detection. This is useful for framework-agnostic code
 * that needs to work with the current framework's hook pattern.
 * 
 * @returns The framework-specific hook (useUplink, useController, or getController)
 */
export function getFrameworkHook() {
  const framework = detectFramework();
  
  // Return the appropriate hook based on framework detection
  switch (framework) {
    case 'react': 
      return reactUseUplink;
    case 'vue':
      return vueUseUplink;
    case 'angular':
      return angularUseController;
    case 'svelte':
      return svelteGetController;
    default:
      // Default to the React hook as a fallback
      return reactUseUplink;
  }
}

/**
 * Framework-agnostic controller hook
 * 
 * This is an alias to getFrameworkHook() that provides a consistent name
 * that can be used across different frameworks.
 */
export const useController = getFrameworkHook();
