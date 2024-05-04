import { InternalModuleDeclaration } from "@medusajs/modules-sdk";
import { ExternalModuleDeclaration, ILinkModule, LoaderOptions, ModuleJoinerConfig, ModuleServiceInitializeCustomDataLayerOptions, ModuleServiceInitializeOptions } from "@medusajs/types";
import { InitializeModuleInjectableDependencies } from "../types";
export declare const initialize: (options?: ModuleServiceInitializeOptions | ModuleServiceInitializeCustomDataLayerOptions | ExternalModuleDeclaration | InternalModuleDeclaration, modulesDefinition?: ModuleJoinerConfig[], injectedDependencies?: InitializeModuleInjectableDependencies) => Promise<{
    [link: string]: ILinkModule;
}>;
export declare function runMigrations({ options, logger, }: Omit<LoaderOptions<ModuleServiceInitializeOptions>, "container">, modulesDefinition?: ModuleJoinerConfig[]): Promise<void>;
