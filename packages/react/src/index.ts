/**
 * React Integration for the Odyssey Uplink Protocol
 * 
 * This package provides React-specific hooks, components and auto-detection
 * for integrating with the Uplink Protocol system.
 */

// Export React auto-detection functionality
export { detectFramework, autoInitializeAdapter } from './auto-detect';

// Export the React-specific adapter
import { ReactAdapter } from './adapter/react-adapter';
export { ReactAdapter };

// Export React hooks and components
import { 
  useUplink, 
  UplinkContainer
} from './integration/react-integration';

export { 
  useUplink, 
  UplinkContainer
};

// Create default export with commonly used APIs
export default {
  // React-specific exports
  useUplink,
  UplinkContainer,
  ReactAdapter,
};