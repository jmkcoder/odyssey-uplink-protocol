import { StandardBinding } from '../standard-binding';

describe('StandardBinding', () => {
  test('should notify all subscribers when value changes', () => {
    // Arrange
    const binding = new StandardBinding<number>(0);
    
    const callback1 = jest.fn();
    const callback2 = jest.fn();
    const callback3 = jest.fn();
    
    binding.subscribe(callback1);
    binding.subscribe(callback2);
    binding.subscribe(callback3);
    
    // Act
    binding.set(42);
    
    // Assert
    expect(callback1).toHaveBeenCalledWith(42);
    expect(callback2).toHaveBeenCalledWith(42);
    expect(callback3).toHaveBeenCalledWith(42);
    expect(callback1).toHaveBeenCalledTimes(1);
    expect(callback2).toHaveBeenCalledTimes(1);
    expect(callback3).toHaveBeenCalledTimes(1);
  });

  test('should update current value', () => {
    // Arrange
    const binding = new StandardBinding<string>('initial');
    
    // Act
    binding.set('updated');
    
    // Assert
    expect(binding.current).toBe('updated');
  });

  test('should allow unsubscribe', () => {
    // Arrange
    const binding = new StandardBinding<boolean>(false);
    
    const callback = jest.fn();
    const unsubscribe = binding.subscribe(callback);
    
    // Act
    unsubscribe();
    binding.set(true);
    
    // Assert
    expect(callback).not.toHaveBeenCalled();
  });

  test('should correctly maintain multiple subscribers', () => {
    // Arrange
    const binding = new StandardBinding<number>(0);
    
    const callback1 = jest.fn();
    const callback2 = jest.fn();
    
    const unsubscribe1 = binding.subscribe(callback1);
    const unsubscribe2 = binding.subscribe(callback2);
    
    // Act & Assert - Both receive updates
    binding.set(1);
    expect(callback1).toHaveBeenCalledWith(1);
    expect(callback2).toHaveBeenCalledWith(1);
    
    // Reset mocks
    callback1.mockClear();
    callback2.mockClear();
    
    // Act & Assert - After unsubscribe
    unsubscribe1();
    binding.set(2);
    expect(callback1).not.toHaveBeenCalled();
    expect(callback2).toHaveBeenCalledWith(2);
    
    // Reset mocks
    callback2.mockClear();
    
    // Act & Assert - After all unsubscribe
    unsubscribe2();
    binding.set(3);
    expect(callback1).not.toHaveBeenCalled();
    expect(callback2).not.toHaveBeenCalled();
  });
});
