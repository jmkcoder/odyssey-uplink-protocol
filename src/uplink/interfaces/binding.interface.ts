import { Unsubscribe } from "../types/unsubscribe.type";

/**
 * A reactive binding that stores and manages a value
 */
export interface Binding<T> {
  current: T;
  set(value: T): void;
  subscribe(callback: (value: T) => void): Unsubscribe;
}