import { ExternalModuleDeclaration, InternalModuleDeclaration } from "@medusajs/modules-sdk";
import { IPaymentModuleService, ModuleProvider, ModulesSdkTypes } from "@medusajs/types";
import { InitializeModuleInjectableDependencies } from "../types";
export declare const initialize: (options?: ((ModulesSdkTypes.ModuleServiceInitializeOptions | ModulesSdkTypes.ModuleServiceInitializeCustomDataLayerOptions | ExternalModuleDeclaration | InternalModuleDeclaration) & {
    providers: ModuleProvider[];
}), injectedDependencies?: InitializeModuleInjectableDependencies) => Promise<IPaymentModuleService>;
