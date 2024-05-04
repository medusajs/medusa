import { ModuleExports } from "@medusajs/modules-sdk";
import LocalEventBus from "./services/event-bus-local";
export declare const service: typeof LocalEventBus;
export declare const loaders: (({ logger }: import("@medusajs/modules-sdk").LoaderOptions) => Promise<void>)[];
declare const moduleDefinition: ModuleExports;
export default moduleDefinition;
export * from "./initialize";
