import { detectFramework } from './auto-detect';

// Export detection utility
export { detectFramework } from './auto-detect';
export { autoInitializeAdapter } from './auto-detect';

// Determine which framework integration to export based on detection
typeof window !== 'undefined' ? detectFramework() : 'vanilla';

// Always export core functions
export { connectController, disconnectController } from '../../uplink/uplink-protocol';
