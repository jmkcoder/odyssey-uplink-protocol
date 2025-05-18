// Export vanilla JS integration
export { useUplink, UplinkContainer, defineControllerElement, initializeVanillaAdapter } from './vanilla-integration';

// Export auto-detection functionality
export { autoInitializeAdapter, detectFramework } from './auto-detect';

// Always export core functions
export { connectController, disconnectController } from '../../uplink/uplink-protocol';
