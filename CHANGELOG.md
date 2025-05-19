# Changelog

## @uplink-protocol/core

### 0.0.8 (2025-05-19)

**Improvements**
- Enhanced `StandardBinding` implementation to properly support multiple subscribers
- Added error handling to prevent subscriber errors from affecting other subscribers
- Improved subscriber notification process for more reliable updates
- Fixed issues with callbacks list modification during iteration

### 0.0.7 (2025-05-18)

**Features**
- Added helper utilities for simplified binding and event emitter creation
- Improved TypeScript typing for better developer experience

### 0.0.4 (2025-05-15)

**Bug Fixes**
- Fixed critical issue with webpack configuration that was generating `main.js` instead of `index.js`
- Corrected file exports to ensure `uplink-auto-init.js` is properly exported
- Fixed package exports in package.json to match actual output file names

### 0.0.3 (2025-05-15)

**Features**
- Added core functionality for Uplink Protocol
- Added support for framework detection
- Added support for controller lifecycle management

**Deprecated**
- This version has been deprecated due to a critical issue with the index.js file. Please upgrade to version 0.0.4 or later.

## @uplink-protocol/react

### 0.0.3 (2025-05-15)

**Features**
- Added React integration for Uplink Protocol
- Added useUplink hook for React components
- Added UplinkContainer component for React component tree
- Fixed infinite loop issues in useEffect dependency arrays

**Bug Fixes**
- Fixed Maximum update depth exceeded warning
- Optimized state updates to prevent unnecessary re-renders

### 0.0.2 (2025-05-15)

**Bug Fixes**
- Fixed prop reference updating which caused infinite loops
- Improved event subscription management
- Optimized state updates

### 0.0.1 (2025-05-15)

**Features**
- Initial release of React integration for Uplink Protocol
