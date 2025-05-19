/**
 * Tests for binding helpers
 */

import { createBindings, createEventEmitters } from "../binding-helpers";
import { StandardBinding } from "../../uplink/models/standard-binding";
import { EventEmitter } from "../../uplink/models/event-emitter";

describe("createBindings", () => {
  test("creates StandardBinding instances for each provided value", () => {
    const initialValues = {
      count: 0,
      name: "Test",
      isActive: true,
      items: [1, 2, 3]
    };
    
    const bindings = createBindings(initialValues);
    
    // Check that all keys exist
    expect(Object.keys(bindings)).toEqual(Object.keys(initialValues));
    
    // Check each binding is a StandardBinding with correct value
    expect(bindings.count).toBeInstanceOf(StandardBinding);
    expect(bindings.count.current).toBe(0);
    
    expect(bindings.name).toBeInstanceOf(StandardBinding);
    expect(bindings.name.current).toBe("Test");
    
    expect(bindings.isActive).toBeInstanceOf(StandardBinding);
    expect(bindings.isActive.current).toBe(true);
    
    expect(bindings.items).toBeInstanceOf(StandardBinding);
    expect(bindings.items.current).toEqual([1, 2, 3]);
  });
  
  test("handles empty object", () => {
    const bindings = createBindings({});
    expect(Object.keys(bindings).length).toBe(0);
  });
  
  test("handles complex nested objects", () => {
    const initialValues = {
      user: { name: "John", age: 30 },
      settings: { theme: "dark", notifications: true }
    };
    
    const bindings = createBindings(initialValues);
    
    expect(bindings.user).toBeInstanceOf(StandardBinding);
    expect(bindings.user.current).toEqual({ name: "John", age: 30 });
    
    expect(bindings.settings).toBeInstanceOf(StandardBinding);
    expect(bindings.settings.current).toEqual({ theme: "dark", notifications: true });
  });
  
  test("bindings can be updated", () => {
    const bindings = createBindings({ count: 0 });
    
    bindings.count.set(5);
    expect(bindings.count.current).toBe(5);
    
    // Test subscription
    const mockCallback = jest.fn();
    bindings.count.subscribe(mockCallback);
    
    bindings.count.set(10);
    expect(mockCallback).toHaveBeenCalledWith(10);
  });
});

describe("createEventEmitters", () => {
  test("creates emitters from array of event names", () => {
    const eventNames = ["change", "submit", "cancel"] as const;
    const events = createEventEmitters(eventNames);
    
    // Check all event emitters were created
    expect(Object.keys(events)).toEqual(eventNames);
    
    // Check each is an EventEmitter
    eventNames.forEach(name => {
      expect(events[name]).toBeInstanceOf(EventEmitter);
    });
  });
  
  test("creates emitters from object with type information", () => {
    const eventsDefinition = {
      increment: null as null,
      submit: {} as Record<string, any>,
      select: "" as string,
      valueChange: 0 as number
    };
    
    const events = createEventEmitters(eventsDefinition);
    
    // Check all event emitters were created
    expect(Object.keys(events)).toEqual(Object.keys(eventsDefinition));
      // Check each is an EventEmitter
    Object.keys(eventsDefinition).forEach(name => {
      expect((events as any)[name]).toBeInstanceOf(EventEmitter);
    });
  });
  
  test("event emitters can emit and subscribe", () => {
    const events = createEventEmitters(["change"]);
    const mockCallback = jest.fn();
    
    events.change.subscribe(mockCallback);
    events.change.emit("test-value");
    
    expect(mockCallback).toHaveBeenCalledWith("test-value");
  });
  
  test("handles empty array", () => {
    const events = createEventEmitters([]);
    expect(Object.keys(events).length).toBe(0);
  });
  
  test("handles empty object", () => {
    const events = createEventEmitters({});
    expect(Object.keys(events).length).toBe(0);
  });
});
