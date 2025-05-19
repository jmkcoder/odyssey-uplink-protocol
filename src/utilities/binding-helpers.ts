/**
 * Binding helpers module for the Uplink Protocol
 * 
 * This module provides utility functions to simplify the creation of bindings and event emitters
 * when building controllers with the Uplink Protocol.
 */

import { Binding } from "../uplink/interfaces/binding.interface";
import { StandardBinding } from "../uplink/models/standard-binding";
import { EventEmitter } from "../uplink/models/event-emitter";

/**
 * Creates a record of bindings with specified initial values
 * 
 * @param bindingDefinitions Object with binding names as keys and initial values as values
 * @returns Record of StandardBinding instances
 * 
 * @example
 * const bindings = createBindings({
 *   count: 0,
 *   name: 'User',
 *   isActive: true,
 *   items: []
 * });
 */
export function createBindings<T extends Record<string, any>>(
  bindingDefinitions: T
): { [K in keyof T]: Binding<T[K]> } {
  const result = {} as { [K in keyof T]: Binding<T[K]> };
  
  for (const key in bindingDefinitions) {
    if (Object.prototype.hasOwnProperty.call(bindingDefinitions, key)) {
      result[key] = new StandardBinding<T[typeof key]>(bindingDefinitions[key]);
    }
  }
  
  return result;
}

/**
 * Creates a record of event emitters with specified event names
 * 
 * @param eventNames Array of event names or object with event names as keys and optional types as values
 * @returns Record of EventEmitter instances
 * 
 * @example
 * // From array of names
 * const events = createEventEmitters(['change', 'submit', 'cancel']);
 * 
 * // From object with explicit types
 * const typedEvents = createEventEmitters({
 *   increment: null,  // No specific type
 *   submit: {} as FormData,
 *   select: '' as string,
 *   valueChange: 0 as number
 * });
 */
export function createEventEmitters<T extends string>(
  eventNames: readonly T[]
): { [K in T]: EventEmitter<any> };
export function createEventEmitters<T extends Record<string, any>>(
  eventNamesWithTypes: T
): { [K in keyof T]: EventEmitter<T[K]> };
export function createEventEmitters(
  input: string[] | Record<string, any>
): Record<string, EventEmitter<any>> {
  const result: Record<string, EventEmitter<any>> = {};
  
  if (Array.isArray(input)) {
    // Handle array of event names
    input.forEach(eventName => {
      result[eventName] = new EventEmitter();
    });
  } else {
    // Handle object with event names as keys
    for (const eventName in input) {
      if (Object.prototype.hasOwnProperty.call(input, eventName)) {
        result[eventName] = new EventEmitter();
      }
    }
  }
  
  return result;
}
