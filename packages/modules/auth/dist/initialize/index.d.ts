import { IAuthModuleService, ModulesSdkTypes } from "@medusajs/types";
import { InitializeModuleInjectableDependencies } from "../types";
export declare const initialize: (options?: ModulesSdkTypes.ModuleBootstrapDeclaration | ModulesSdkTypes.ModuleServiceInitializeOptions | ModulesSdkTypes.ModuleServiceInitializeCustomDataLayerOptions, injectedDependencies?: InitializeModuleInjectableDependencies) => Promise<IAuthModuleService>;
