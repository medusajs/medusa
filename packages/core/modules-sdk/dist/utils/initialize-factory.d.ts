import { ExternalModuleDeclaration, InternalModuleDeclaration, ModuleExports, ModuleServiceInitializeCustomDataLayerOptions, ModuleServiceInitializeOptions } from "@medusajs/types";
/**
 * Generate a initialize module factory that is exported by the module to be initialized manually
 *
 * @param moduleName
 * @param moduleDefinition
 */
export declare function initializeFactory<T>({ moduleName, moduleDefinition, }: {
    moduleName: string;
    moduleDefinition: ModuleExports;
}): (options?: ModuleServiceInitializeOptions | ModuleServiceInitializeCustomDataLayerOptions | ExternalModuleDeclaration | InternalModuleDeclaration, injectedDependencies?: any) => Promise<T>;
