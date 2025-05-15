/**
 * React Integration for the Odyssey Uplink Protocol
 *
 * This package provides React-specific hooks, components and auto-detection
 * for integrating with the Uplink Protocol system.
 */
export { detectFramework, autoInitializeAdapter } from './auto-detect';
import { ReactAdapter } from './adapter/react-adapter';
export { ReactAdapter };
import { useUplink, UplinkContainer } from './integration/react-integration';
export { useUplink, UplinkContainer };
import { Controller, ControllerState, ControllerEventHandlers, TypedController } from '@uplink-protocol/core';
export type { Controller, ControllerState, ControllerEventHandlers, TypedController };
import { connectController, disconnectController, StandardBinding, EventEmitter, ControllerAdapter, getControllerFactory } from '@uplink-protocol/core';
export { connectController, disconnectController, StandardBinding, EventEmitter, ControllerAdapter, getControllerFactory };
declare const _default: {
    useUplink: typeof useUplink;
    UplinkContainer: ({ controller, children, ...props }: import("./integration/react-integration").UplinkContainerProps) => import("react").JSX.Element;
    ReactAdapter: typeof ReactAdapter;
    connectController: typeof connectController;
    disconnectController: typeof disconnectController;
    StandardBinding: typeof StandardBinding;
    EventEmitter: typeof EventEmitter;
    ControllerAdapter: typeof ControllerAdapter;
    getControllerFactory: typeof getControllerFactory;
};
export default _default;
//# sourceMappingURL=index.d.ts.map