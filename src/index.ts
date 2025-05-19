/**
 * Odyssey Uplink Protocol Core - Main Export
 * 
 * This file exports the core APIs of the Uplink Protocol without framework-specific integrations.
 * Framework integrations are available in separate packages.
 */

// Core protocol exports
export * from './uplink';

// Export core services while excluding framework-specific integrations
export * from './services/adapter';

// Export vanilla integration
export { 
  useUplink, 
  UplinkContainer, 
  defineControllerElement, 
  initializeVanillaAdapter 
} from './services/integration/vanilla-integration';

// Export auto-detection functionality
export { 
  autoInitializeAdapter, 
  detectFramework 
} from './services/integration/auto-detect';

// Direct exports for most commonly used APIs
import { connectController, disconnectController } from './uplink/uplink-protocol';
import { StandardBinding } from './uplink/models/standard-binding';
import { EventEmitter } from './uplink/models/event-emitter';
import { ControllerAdapter } from './services/adapter/controller-adapter';
import { createBindings, createEventEmitters } from './utilities/binding-helpers';

// Export utility functions
export { createBindings, createEventEmitters };

// Create a default export with commonly used functions for easier access
export default {
  // Core functions
  connectController,
  disconnectController,
  
  // Helper functions
  createBindings,
  createEventEmitters,
  
  // Core classes
  StandardBinding,
  EventEmitter,
  ControllerAdapter
};