# Uplink Protocol Technical Guide

This technical guide provides in-depth information about the architecture, components, and implementation details of the Uplink Protocol.

## Protocol Architecture

The Uplink Protocol follows a layered architecture:

1. **Core Protocol Layer**: Defines the fundamental interfaces and models
2. **Adapter Layer**: Bridges the protocol with specific frameworks
3. **Integration Layer**: Provides framework-specific APIs and hooks

### Core Protocol Components

```
/src
  /uplink
    /interfaces       - Core protocol interfaces
    /models           - Implementation classes
    /types            - TypeScript type definitions
    uplink-protocol.ts - Protocol core functions
  /services
    /adapter          - Framework adapter system
    /integration      - Framework integration utilities
```

## Adapter System

The adapter system allows the Uplink Protocol to work with different UI frameworks seamlessly. Each adapter translates between the protocol's operations and the framework's specific patterns.

### Adapter Interface

```typescript
interface AdapterInterface {
  // Unique name for this adapter
  readonly name: string;
  
  // Version of the adapter
  readonly version: string;
  
  // Initialize the adapter with optional configuration
  initialize(config?: any): void;
  
  // Connect a controller to an element
  connectController(controller: Controller, element: HTMLElement): void;
  
  // Disconnect a controller
  disconnectController(controller: Controller): void;
  
  // Handle an event from a controller
  handleEvent(controller: Controller, eventName: string, eventData: any): void;
  
  // Watch a property for changes
  watchProperty(
    controller: Controller, 
    propertyName: string, 
    callback: (newValue: any) => void
  ): void;
  
  // Update a property value from UI
  updateProperty(controller: Controller, propertyName: string, value: any): void;
  
  // Call a method on the controller
  callMethod(controller: Controller, methodName: string, args?: any[]): any;
}
```

### Adapter Registry

The AdapterRegistry is a singleton service that manages all framework adapters and provides a central point for controllers to connect to the appropriate adapter.

```typescript
class AdapterRegistry {
  private static instance: AdapterRegistry;
  private adapters: Map<string, AdapterInterface> = new Map();
  private defaultAdapter: string | null = null;

  // Get the singleton instance
  public static getInstance(): AdapterRegistry {
    if (!AdapterRegistry.instance) {
      AdapterRegistry.instance = new AdapterRegistry();
    }
    return AdapterRegistry.instance;
  }
  
  // Register an adapter
  public registerAdapter(adapter: AdapterInterface): void {
    this.adapters.set(adapter.name, adapter);
    
    // Set as default if no default or this is the first adapter
    if (!this.defaultAdapter) {
      this.defaultAdapter = adapter.name;
    }
  }
  
  // Get an adapter by name
  public getAdapter(name: string): AdapterInterface | undefined {
    return this.adapters.get(name);
  }
  
  // Check if an adapter exists
  public hasAdapter(name: string): boolean {
    return this.adapters.has(name);
  }
  
  // Get all registered adapters
  public getAllAdapters(): AdapterInterface[] {
    return Array.from(this.adapters.values());
  }
  
  // Set the default adapter
  public setDefaultAdapter(name: string): boolean {
    if (this.adapters.has(name)) {
      this.defaultAdapter = name;
      return true;
    }
    return false;
  }
  
  // Get the default adapter
  public getDefaultAdapter(): AdapterInterface | undefined {
    if (this.defaultAdapter) {
      return this.adapters.get(this.defaultAdapter);
    }
    return undefined;
  }
}
```

## Controller Adapter

The ControllerAdapter class provides a unified interface for controllers to interact with the adapter system:

```typescript
class ControllerAdapter {
  private registry: AdapterRegistry;
  private adapter: AdapterInterface;
  private controller: any;
  private element: HTMLElement | null = null;
  
  constructor(controller: any, adapterName?: string) {
    this.controller = controller;
    this.registry = AdapterRegistry.getInstance();
    
    // Get the appropriate adapter
    if (adapterName && this.registry.hasAdapter(adapterName)) {
      this.adapter = this.registry.getAdapter(adapterName)!;
    } else {
      // Auto-detect or use default adapter
      const autoAdapter = this.registry.getAppropriateAdapter();
      
      if (autoAdapter) {
        this.adapter = autoAdapter;
      } else {
        // If no adapters are registered yet, create and register a vanilla adapter
        const vanillaAdapter = new VanillaAdapter();
        this.registry.registerAdapter(vanillaAdapter);
        this.adapter = vanillaAdapter;
      }
    }
  }
  
  // Connect to an element
  public connect(element: HTMLElement): void {
    this.element = element;
    this.adapter.connectController(this.controller, element);
  }
  
  // Disconnect
  public disconnect(): void {
    if (this.element) {
      this.adapter.disconnectController(this.controller);
      this.element = null;
    }
  }
  
  // Emit an event
  public emitEvent(eventName: string, eventData: any): void {
    this.adapter.handleEvent(this.controller, eventName, eventData);
  }
  
  // Watch a property
  public watchProperty(propertyName: string, callback: (newValue: any) => void): void {
    this.adapter.watchProperty(this.controller, propertyName, callback);
  }
  
  // Update a property
  public updateProperty(propertyName: string, value: any): void {
    this.adapter.updateProperty(this.controller, propertyName, value);
  }
}
```

## Framework Integration

The framework integration layer provides framework-specific hooks and utilities that leverage the adapter system to provide a smooth developer experience.

### Vanilla JS Integration

```typescript
function useUplink<T extends TypedController>(
  controllerInput: T | (() => T) | string,
  options: UseUplinkOptions = {}
): UseUplinkResult<T> {
  // Implementation details...
  
  return {
    controller,
    state,
    methods,
    events,
    connect,
    disconnect
  };
}
```

### React Integration

```typescript
function useUplink<T extends TypedController>(
  controllerInput: T | (() => T) | string,
  options: UseUplinkOptions = {}
): {
  controller: T;
  state: ControllerState<T>;
  methods: T['methods'];
  events: T['events'];
  Container: React.FC<ControllerEventHandlers<T> & { children: ReactNode }>;
} {
  // Implementation details...
  
  return {
    controller,
    state,
    methods,
    events,
    Container
  };
}
```

## Auto-Detection and Initialization

The Uplink Protocol includes a mechanism for automatically detecting the framework environment and initializing the appropriate adapter.

### Core Auto-Detection

```typescript
function detectFramework(): 'react' | 'vue' | 'angular' | 'svelte' | 'vanilla' {
  // In core package, default to vanilla
  return 'vanilla';
}

function autoInitializeAdapter(): void {
  const registry = getAdapterRegistry();
  
  // Skip if adapters are already registered
  if (registry.getAllAdapters().length > 0) {
    return;
  }
  
  // Initialize vanilla adapter
  const vanillaAdapter = new VanillaAdapter();
  registry.registerAdapter(vanillaAdapter);
  registry.setDefaultAdapter('vanilla');
}
```

### Framework-Specific Auto-Detection

```typescript
// In React package
function detectFramework(): 'react' | 'vue' | 'angular' | 'svelte' | 'vanilla' {
  // Check for React global object
  if (typeof window !== 'undefined' && (window as any).React) {
    return 'react';
  }

  // Check for React DevTools
  if (typeof window !== 'undefined' && (window as any).__REACT_DEVTOOLS_GLOBAL_HOOK__) {
    return 'react';
  }

  return 'vanilla';
}

function autoInitializeAdapter(): void {
  const registry = getAdapterRegistry();
  
  // Skip if adapters are already registered
  if (registry.getAllAdapters().length > 0) {
    return;
  }

  // Only initialize React adapter if React is detected
  if (isReactAvailable()) {
    const adapter = new ReactAdapter();
    registerAdapter(adapter);
    setDefaultAdapter(adapter.name);
  } else {
    // Fall back to vanilla adapter
    import('../../../src/services/integration/auto-detect').then((coreModule) => {
      coreModule.autoInitializeAdapter();
    });
  }
}
```

## ESM Only Build System

The Uplink Protocol uses an ESM-only build system for modern environments:

- **webpack.esm.config.js**: Configuration for ESM build
- **tsconfig.esm.json**: TypeScript configuration for ESM output
- **tsconfig.declarations.json**: TypeScript configuration for generating .d.ts files

### Build Process

1. Clean existing dist directory and declaration files
2. Build ESM module with webpack
3. Generate TypeScript declaration files

```javascript
// In package.json
"scripts": {
  "clean": "rimraf dist && powershell -Command \"Get-ChildItem -Path './src' -Recurse -Include '*.d.ts','*.d.ts.map' | Remove-Item -Force\"",
  "build": "npm run clean && npx webpack --config webpack.esm.config.js --mode=production && npx tsc -p tsconfig.declarations.json"
}
```

## Performance Considerations

1. **Binding Updates**: The protocol only updates subscribers when values actually change
2. **Adapter Registry**: The registry uses a singleton pattern to minimize overhead
3. **Subscriptions Cleanup**: All subscription methods return unsubscribe functions for proper cleanup
4. **Event Batching**: The protocol includes utilities for batching events for better performance

## Security Considerations

1. **Isolation**: Controllers have no direct DOM access, preventing XSS attacks
2. **No Eval/Function**: The protocol never uses eval() or new Function()
3. **Content Security Policy**: The protocol is compatible with strict CSP settings
4. **Data Sanitization**: Framework adapters properly handle data sanitization
