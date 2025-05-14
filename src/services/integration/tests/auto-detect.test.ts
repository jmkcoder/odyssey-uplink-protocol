import { detectFramework, autoInitializeAdapter } from '../auto-detect';
import { getAdapterRegistry } from '../../adapter';
import * as uplinkProtocol from '../../../uplink/uplink-protocol';

// Mock adapter registry
jest.mock('../../adapter');
jest.mock('../../../uplink/uplink-protocol');

describe('Framework auto-detection', () => {
  // Save original window object
  
  // Restore window after each test
  afterEach(() => {
    Object.defineProperty(window, 'React', { value: undefined });
    Object.defineProperty(window, 'Vue', { value: undefined });
    Object.defineProperty(window, 'ng', { value: undefined });
    Object.defineProperty(window, '__SVELTE__', { value: undefined });
    
    // Restore document methods
    document.querySelector = jest.fn().mockReturnValue(null);
  });
  
  test('should detect React framework', () => {
    // Mock React availability
    Object.defineProperty(window, 'React', { value: {} });
    
    expect(detectFramework()).toBe('react');
  });
  
  test('should detect React by devtools', () => {
    // Mock React devtools availability
    Object.defineProperty(window, '__REACT_DEVTOOLS_GLOBAL_HOOK__', { value: {} });
    
    expect(detectFramework()).toBe('react');
  });
  
  test('should detect Vue framework', () => {
    // Mock Vue availability
    Object.defineProperty(window, 'Vue', { value: {} });
    
    expect(detectFramework()).toBe('vue');
  });
  
  test('should detect Vue by DOM', () => {
    // Mock Vue DOM element
    document.querySelector = jest.fn().mockImplementation(selector => {
      if (selector === '[data-v-app]') {
        return document.createElement('div');
      }
      return null;
    });
    
    expect(detectFramework()).toBe('vue');
  });
  
  test('should detect Angular framework', () => {
    // Mock Angular availability
    Object.defineProperty(window, 'ng', { value: {} });
    
    expect(detectFramework()).toBe('angular');
  });
  
  test('should detect Angular by DOM', () => {
    // Mock Angular DOM element
    document.querySelector = jest.fn().mockImplementation(selector => {
      if (selector === '[ng-version]') {
        return document.createElement('div');
      }
      return null;
    });
    
    expect(detectFramework()).toBe('angular');
  });
  
  test('should detect Svelte framework', () => {
    // Mock Svelte availability
    Object.defineProperty(window, '__SVELTE__', { value: {} });
    
    expect(detectFramework()).toBe('svelte');
  });
  
  test('should detect Svelte by DOM', () => {
    // Mock Svelte DOM element
    document.querySelector = jest.fn().mockImplementation(selector => {
      if (selector === '.__svelte-hooks__') {
        return document.createElement('div');
      }
      return null;
    });
    
    expect(detectFramework()).toBe('svelte');
  });
  
  test('should default to vanilla when no framework is detected', () => {
    expect(detectFramework()).toBe('vanilla');
  });
});

describe('Adapter auto-initialization', () => {
  // Mock adapter registry and uplink protocol
  const mockRegistry = {
    getAllAdapters: jest.fn().mockReturnValue([]),
    getAdapter: jest.fn()
  };
  
  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
    
    // Mock getAdapterRegistry to return our mock registry
    (getAdapterRegistry as jest.Mock).mockReturnValue(mockRegistry);
  });
  
  test('should register React adapter when React is detected', () => {
    // Mock React availability
    Object.defineProperty(window, 'React', { value: {} });
    
    // Mock dynamic imports
    jest.spyOn(require('../react'), 'getReactAdapter').mockReturnValue({
      name: 'react',
      connect: jest.fn(),
      disconnect: jest.fn()
    });
    
    autoInitializeAdapter();
    
    // Check if registerAdapter was called with React adapter
    expect(uplinkProtocol.registerAdapter).toHaveBeenCalledWith(
      expect.objectContaining({ name: 'react' })
    );
    
    // Check if default adapter was set
    expect(uplinkProtocol.setDefaultAdapter).toHaveBeenCalledWith('react');
  });
});
