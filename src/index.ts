/**
 * Odyssey Uplink Protocol - Main Export
 * 
 * This file exports all the core APIs of the Uplink Protocol
 */

// Core protocol exports
export * from './uplink';
export * from './services';

// Direct exports for most commonly used APIs
import { connectController, disconnectController } from './uplink/uplink-protocol';
import { StandardBinding } from './uplink/models/standard-binding';
import { EventEmitter } from './uplink/models/event-emitter';
import { ControllerAdapter } from './services/adapter/controller-adapter'; 
import { detectFramework, autoInitializeAdapter } from './services/integration/auto-detect';

// Export framework hooks from the hooks module
export { 
  react,
  vue, 
  angular, 
  svelte,
  // Exported with aliases to avoid naming conflicts
  getFrameworkHook as getFrameworkHookFn,
  useController as useControllerFn
} from './hooks';

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