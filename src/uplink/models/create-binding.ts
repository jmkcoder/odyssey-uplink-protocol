import { Binding } from "../interfaces/binding.interface";
import { Unsubscribe } from "../types/unsubscribe.type";
import { StandardBinding } from "./standard-binding";

/**
 * Creates a binding with optional custom implementation of set and subscribe methods
 * 
 * @param initialValue - The initial value for the binding
 * @param options - Custom implementation options
 * @returns A binding object that implements the Binding interface
 * 
 * @example
 * // Create a standard binding
 * const simpleBinding = createBinding(initialValue);
 * 
 * @example
 * // Create a binding with custom set/subscribe that delegates to another service
 * const customBinding = createBinding(config, {
 *   customSet: (value) => configService.set(value),
 *   customSubscribe: (callback) => configService.subscribe(callback)
 * });
 */
export function createBinding<T>(
  initialValue: T,
  options?: {
    customSet?: (value: T) => void;
    customSubscribe?: (callback: (value: T) => void) => Unsubscribe;
  }
): Binding<T> {
  return new StandardBinding<T>(initialValue, options);
}
