import { ExternalModuleDeclaration, InternalModuleDeclaration } from "@medusajs/modules-sdk";
import { ICartModuleService, ModulesSdkTypes } from "@medusajs/types";
import { InitializeModuleInjectableDependencies } from "../types";
export declare const initialize: (options?: ModulesSdkTypes.ModuleServiceInitializeOptions | ModulesSdkTypes.ModuleServiceInitializeCustomDataLayerOptions | ExternalModuleDeclaration | InternalModuleDeclaration, injectedDependencies?: InitializeModuleInjectableDependencies) => Promise<ICartModuleService>;
