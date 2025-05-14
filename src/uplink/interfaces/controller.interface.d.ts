import { ControllerAdapter } from "../../services";
import { EventEmitter } from "../models/event-emitter";
import { Binding } from "./binding.interface";
import { ControllerMetadata } from "./metadata/controller-metadata.interface";
/**
 * Base controller interface following the Uplink Protocol
 */
export interface Controller {
    bindings: Record<string, Binding<any>>;
    methods?: Record<string, (...args: any[]) => any>;
    events?: Record<string, EventEmitter<any>>;
    meta?: ControllerMetadata;
    __adapter?: ControllerAdapter;
}
//# sourceMappingURL=controller.interface.d.ts.map