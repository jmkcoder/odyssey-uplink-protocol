import { Binding } from "../interfaces/binding.interface";
import { Unsubscribe } from "../types/unsubscribe.type";

/**
 * Standard binding implementation
 */
export class StandardBinding<T> implements Binding<T> {
  private _value: T;
  private subscribers: ((value: T) => void)[] = [];

  constructor(initialValue: T) {
    this._value = initialValue;
  }

  get current(): T {
    return this._value;
  }

  set(value: T): void {
    this._value = value;
    this.subscribers.forEach(subscriber => subscriber(value));
  }

  subscribe(callback: (value: T) => void): Unsubscribe {
    this.subscribers.push(callback);
    return () => {
      this.subscribers = this.subscribers.filter(subscriber => subscriber !== callback);
    };
  }
}