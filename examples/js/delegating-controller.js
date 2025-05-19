import { createBinding, EventEmitter } from '../../dist/index.js'

/**
 * Example controller with delegated bindings
 * 
 * This controller delegates binding operations to external services.
 * This pattern is useful for:
 * - Reusing existing state management logic
 * - Connecting to external data sources
 * - Building adapters for existing code
 */
export class DelegatingController {
  constructor() {
    // External service that manages configuration
    this.configService = {
      _config: { theme: 'light', fontSize: 16 },
      _listeners: [],
      
      getConfig() {
        return { ...this._config };
      },
      
      setConfig(newConfig) {
        this._config = { ...this._config, ...newConfig };
        this._listeners.forEach(listener => listener(this._config));
      },
      
      subscribe(callback) {
        // Initial call with current value
        callback(this._config);
        
        // Add to listeners
        this._listeners.push(callback);
        
        // Return unsubscribe function
        return () => {
          this._listeners = this._listeners.filter(l => l !== callback);
        };
      }
    };
    
    // External service that manages user info
    this.userService = {
      _user: { name: 'Guest', role: 'viewer' },
      _listeners: [],
      
      getUser() {
        return { ...this._user };
      },
      
      setUser(newUser) {
        this._user = { ...this._user, ...newUser };
        this._listeners.forEach(listener => listener(this._user));
      },
      
      subscribe(callback) {
        // Initial call with current value
        callback(this._user);
        
        // Add to listeners
        this._listeners.push(callback);
        
        // Return unsubscribe function
        return () => {
          this._listeners = this._listeners.filter(l => l !== callback);
        };
      }
    };
      // Create bindings that delegate to services
    this.bindings = {
      config: createBinding(this.configService.getConfig(), {
        customSet: (value) => this.configService.setConfig(value),
        customSubscribe: (callback) => this.configService.subscribe(callback)
      }),
      
      user: createBinding(this.userService.getUser(), {
        customSet: (value) => this.userService.setUser(value),
        customSubscribe: (callback) => this.userService.subscribe(callback)
      })
    };
    
    // Controller methods
    this.methods = {
      updateTheme: (theme) => {
        // Update just the theme property
        this.bindings.config.set({
          ...this.bindings.config.current,
          theme
        });
      },
      
      updateFontSize: (fontSize) => {
        // Update just the fontSize property
        this.bindings.config.set({
          ...this.bindings.config.current,
          fontSize
        });
      },
      
      login: (name, role) => {
        this.bindings.user.set({ name, role });
      },
      
      logout: () => {
        this.bindings.user.set({ name: 'Guest', role: 'viewer' });
      }
    };
    
    // Events
    this.events = {
      themeChanged: new EventEmitter(),
      userChanged: new EventEmitter()
    };
    
    // Subscribe to service changes to emit events
    this.configService.subscribe(config => {
      this.events.themeChanged.emit(config.theme);
    });
    
    this.userService.subscribe(user => {
      this.events.userChanged.emit(user);
    });
  }
}
