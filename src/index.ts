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

// Direct exports for most commonly used APIs
import { connectController, disconnectController } from './uplink/uplink-protocol';
import { StandardBinding } from './uplink/models/standard-binding';
import { EventEmitter } from './uplink/models/event-emitter';
import { ControllerAdapter } from './services/adapter/controller-adapter'; 
import { detectFramework, autoInitializeAdapter } from './services/integration/auto-detect';
import './uplink-auto-init';


// Create a default export with commonly used functions for easier access
export default {
  // Core functions
  connectController,
  disconnectController,
  
  // Core classes
  StandardBinding,
  EventEmitter,
  ControllerAdapter,
  
  // Framework detection and auto-initialization
  detectFramework,
  autoInitializeAdapter
};