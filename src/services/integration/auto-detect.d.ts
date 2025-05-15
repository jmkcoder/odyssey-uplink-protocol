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
export declare function detectFramework(): 'react' | 'vue' | 'angular' | 'svelte' | 'vanilla';
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
export declare function autoInitializeAdapter(): void;
//# sourceMappingURL=auto-detect.d.ts.map