/**
 * Odyssey Uplink Protocol - One-line initialization
 * 
 * This file provides a simple one-line initialization for the Uplink Protocol.
 * Import this file at your application's entry point to automatically set up
 * the appropriate adapter for your framework.
 * 
 * Usage:
 * ```
 * import 'odyssey/uplink-auto-init';
 * ```
 */

import { autoInitializeAdapter } from './services/integration/auto-detect';

// Auto-initialize the adapter based on detected framework
if (typeof window !== 'undefined') {
  // Wait until window is available (for SSR compatibility)
  if (document.readyState === 'loading') {
    // If the document is still loading, wait for it to complete
    document.addEventListener('DOMContentLoaded', autoInitializeAdapter);
  } else {
    // If the document is already loaded, initialize immediately
    autoInitializeAdapter();
  }
}
