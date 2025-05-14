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

// React integration
import { useUplink, UplinkContainer } from './services/integration/react';

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
  autoInitializeAdapter,
  
  // React integration
  react: {
    useUplink,
    UplinkContainer
  }
};