/**
 * Example controller demonstrating the updated createBindings helper function
 * with support for custom set and subscribe implementations
 */
class BindingHelpersController {
  constructor() {
    // Create an external service for managing state
    this.configService = {
      _config: { theme: 'light', fontSize: 16 },
      _listeners: [],
      
      get config() {
        return { ...this._config };
      },
      
      set(newConfig) {
        this._config = { ...this._config, ...newConfig };
        this._listeners.forEach(listener => listener(this._config));
        return this._config;
      },
      
      subscribe(callback) {
        // Call immediately with current state
        callback(this._config);
        
        // Add to listeners
        this._listeners.push(callback);
        
        // Return unsubscribe function
        return () => {
          this._listeners = this._listeners.filter(l => l !== callback);
        };
      }
    };
    
    // Using the updated createBindings function with a mix of:
    // - simple value bindings
    // - custom implementation bindings
    this.bindings = UplinkProtocol.createBindings({
      // Simple value bindings
      count: 0,
      isActive: false,
      
      // Custom implementation binding
      config: {
        initialValue: this.configService.config,
        customSet: (value) => this.configService.set(value),
        customSubscribe: (callback) => this.configService.subscribe(callback)
      }
    });
    
    // Controller methods
    this.methods = {
      increment: () => {
        this.bindings.count.set(this.bindings.count.current + 1);
      },
      
      decrement: () => {
        this.bindings.count.set(this.bindings.count.current - 1);
      },
      
      toggleActive: () => {
        this.bindings.isActive.set(!this.bindings.isActive.current);
      },
      
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
      }
    };
    
    // Events
    this.events = UplinkProtocol.createEventEmitters(['countChanged', 'themeChanged']);
    
    // Set up event emission
    this.bindings.count.subscribe(value => {
      this.events.countChanged.emit(value);
    });
    
    this.bindings.config.subscribe(config => {
      this.events.themeChanged.emit(config.theme);
    });
  }
}
