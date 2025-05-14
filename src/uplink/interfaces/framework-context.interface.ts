/**
 * Interface for framework context that can be connected to a controller
 */
export interface IFrameworkContext {
  id: string | number;             // Unique identifier
  element?: HTMLElement | null;    // Optional DOM element (might be null for non-DOM frameworks)
  render?: () => void;             // Framework-specific rendering method
  getElement?: () => HTMLElement | null; // Method to get DOM element if needed
  cleanup?: () => void;            // Framework-specific cleanup method
}