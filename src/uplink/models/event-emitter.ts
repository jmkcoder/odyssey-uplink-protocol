import { ControllerAdapter } from "../../services";
import { Controller } from "../interfaces/controller.interface";
import { Unsubscribe } from "../types/unsubscribe.type";

/**
 * Event emitter for the pub/sub pattern
 */
export class EventEmitter<T> {
  private listeners: ((value: T) => void)[] = [];
  private adapter?: ControllerAdapter;
  private eventName?: string;

  constructor(eventName?: string) {
    this.eventName = eventName;
  }

  /**
   * Connect this event emitter to a controller and its adapter
   */
  connectToAdapter(controller: Controller, eventName: string): void {
    this.eventName = eventName;
    this.adapter = controller.__adapter;
  }

  emit(value: T): void {
    // Notify all direct listeners
    this.listeners.forEach(listener => listener(value));

    // If connected to an adapter, notify it as well
    if (this.adapter && this.eventName) {
      this.adapter.emitEvent(this.eventName, value);
    }
  }

  subscribe(callback: (value: T) => void): Unsubscribe {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(listener => listener !== callback);
    };
  }
}