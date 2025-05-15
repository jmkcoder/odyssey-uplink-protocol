/**
 * Odyssey Uplink Protocol Core - Main Export
 *
 * This file exports the core APIs of the Uplink Protocol without framework-specific integrations.
 * Framework integrations are available in separate packages.
 */
export * from './uplink';
export * from './services/adapter';
import { connectController, disconnectController } from './uplink/uplink-protocol';
import { StandardBinding } from './uplink/models/standard-binding';
import { EventEmitter } from './uplink/models/event-emitter';
import { ControllerAdapter } from './services/adapter/controller-adapter';
import { detectFramework, autoInitializeAdapter } from './services/integration/auto-detect';
import './uplink-auto-init';
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