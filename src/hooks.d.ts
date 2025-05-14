/**
 * Odyssey Uplink Protocol - Framework Hooks
 *
 * This file provides convenient access to framework-specific hooks and utilities
 * for integrating controllers with different UI frameworks.
 */
import { useUplink as reactUseUplink } from './services/integration/react';
import { useUplink as vueUseUplink } from './services/integration/vue';
import { useController as angularUseController, ControllerService } from './services/integration/angular';
import { getController as svelteGetController, connectElement } from './services/integration/svelte';
export declare const react: {
    useUplink: typeof reactUseUplink;
};
export declare const vue: {
    useUplink: typeof vueUseUplink;
};
export declare const angular: {
    useController: typeof angularUseController;
    ControllerService: typeof ControllerService;
};
export declare const svelte: {
    getController: typeof svelteGetController;
    connectElement: typeof connectElement;
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
export declare function getFrameworkHook(): typeof reactUseUplink | typeof vueUseUplink | typeof angularUseController | typeof svelteGetController;
/**
 * Framework-agnostic controller hook
 *
 * This is an alias to getFrameworkHook() that provides a consistent name
 * that can be used across different frameworks.
 */
export declare const useController: typeof reactUseUplink | typeof vueUseUplink | typeof angularUseController | typeof svelteGetController;
//# sourceMappingURL=hooks.d.ts.map