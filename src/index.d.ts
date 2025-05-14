/**
 * Odyssey Uplink Protocol - Main Export
 *
 * This file exports all the core APIs of the Uplink Protocol
 */
export * from './uplink';
export * from './services';
import { connectController, disconnectController } from './uplink/uplink-protocol';
import { StandardBinding } from './uplink/models/standard-binding';
import { EventEmitter } from './uplink/models/event-emitter';
import { ControllerAdapter } from './services/adapter/controller-adapter';
import { detectFramework, autoInitializeAdapter } from './services/integration/auto-detect';
export { react, vue, angular, svelte, getFrameworkHook as getFrameworkHookFn, useController as useControllerFn } from './hooks';
declare const _default: {
    connectController: typeof connectController;
    disconnectController: typeof disconnectController;
    StandardBinding: typeof StandardBinding;
    EventEmitter: typeof EventEmitter;
    ControllerAdapter: typeof ControllerAdapter;
    detectFramework: typeof detectFramework;
    autoInitializeAdapter: typeof autoInitializeAdapter;
};
export default _default;
//# sourceMappingURL=index.d.ts.map