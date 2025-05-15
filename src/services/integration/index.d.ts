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
export declare function getFrameworkHook(): (controller: any) => {
    controller: any;
};
export { connectController, disconnectController } from '../../uplink/uplink-protocol';
//# sourceMappingURL=index.d.ts.map