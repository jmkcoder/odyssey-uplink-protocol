import { ParameterMetadata } from "./parameter-metadata.interface";

export interface MethodMetadata {
  description?: string;
  parameters?: Record<string, ParameterMetadata>;
  returns?: string;
}