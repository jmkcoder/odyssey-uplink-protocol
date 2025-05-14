/**
 * Interface for framework context that can be connected to a controller
 */
export interface IFrameworkContext {
    id: string | number;
    element?: HTMLElement | null;
    render?: () => void;
    getElement?: () => HTMLElement | null;
    cleanup?: () => void;
}
//# sourceMappingURL=framework-context.interface.d.ts.map