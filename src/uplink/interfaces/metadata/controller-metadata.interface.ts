import { BindingMetadata } from "./binding-metadata.interface";
import { EventMetadata } from "./event-metadata.interface";
import { MethodMetadata } from "./method-metadata.interface";

/**
 * Metadata for controller documentation and tooling
 */
export interface ControllerMetadata {
  name?: string;
  description?: string;
  bindings?: Record<string, BindingMetadata>;
  methods?: Record<string, MethodMetadata>;
  events?: Record<string, EventMetadata>;
}