// Export detection utility only
export { detectFramework, autoInitializeAdapter } from './auto-detect';

/**
 * NOTE: Framework-specific integrations have been moved to their own packages:
 * - @uplink-protocol/react
 * - @uplink-protocol/vue
 * - @uplink-protocol/angular
 * - @uplink-protocol/svelte
 * 
 * This core package only provides the vanilla functionality.
 */

/**
 * Simplified hook for vanilla JavaScript usage
 * In the core package, this function simply returns the controller
 * Framework-specific implementations are available in their respective packages
 */
export function getFrameworkHook() {
  // In the core package, just return the controller wrapped in a simple object
  return (controller: any) => ({ controller });
}

// Always export core functions
export { connectController, disconnectController } from '../../uplink/uplink-protocol';
