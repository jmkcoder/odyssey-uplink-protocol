import { Controller } from './controller.interface';
import { Binding } from './binding.interface';
import { EventEmitter } from '../models/event-emitter';

/**
 * Generic controller type that provides strong typing for a controller's bindings, methods, and events
 */
export interface TypedController<
  TBindings extends Record<string, Binding<any>> = Record<string, Binding<any>>,
  TMethods extends Record<string, (...args: any[]) => any> = Record<string, (...args: any[]) => any>,
  TEvents extends Record<string, EventEmitter<any>> = Record<string, EventEmitter<any>>
> extends Controller {
  bindings: TBindings;
  methods?: TMethods;
  events?: TEvents;
}

/**
 * Helper type to extract the value type from a Binding
 */
export type BindingValue<T extends Binding<any>> = T extends Binding<infer U> ? U : never;

/**
 * Helper type to extract the event data type from an EventEmitter
 */
export type EventData<T extends EventEmitter<any>> = T extends EventEmitter<infer U> ? U : never;

/**
 * Helper type to create a state object type from a controller's bindings
 */
export type ControllerState<T extends Controller> = {
  [K in keyof T['bindings']]: T['bindings'][K] extends Binding<infer U> ? U : never;
};

/**
 * Helper type to create an event handlers object type from a controller's events
 */
export type ControllerEventHandlers<T extends Controller> = {
  [K in keyof T['events'] as `on${Capitalize<string & K>}`]?: 
    T['events'][K] extends EventEmitter<infer U> ? (data: U) => void : never;
};
