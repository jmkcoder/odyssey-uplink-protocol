export { detectFramework, autoInitializeAdapter } from './auto-detect';
export * as ReactIntegration from './react';
export * as VueIntegration from './vue';
export * as AngularIntegration from './angular';
export * as SvelteIntegration from './svelte';
import { useUplink as useReactUplink } from './react';
import { useUplink as useVueUplink } from './vue';
import { useController } from './angular';
import { getController } from './svelte';
export { useReactUplink as reactUseUplink };
export { useVueUplink as vueUseUplink };
export { useController as angularUseController };
export { getController as svelteGetController };
/**
 * Get the appropriate hook for the current framework
 * @returns A framework-specific hook function
 */
export declare function getFrameworkHook(): typeof useReactUplink | typeof useVueUplink | typeof useController | typeof getController | ((controller: any) => {
    controller: any;
});
export { connectController, disconnectController } from '../../uplink/uplink-protocol';
//# sourceMappingURL=index.d.ts.map