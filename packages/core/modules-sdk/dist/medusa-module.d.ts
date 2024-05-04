import { InternalModuleDeclaration, LinkModuleDefinition, LoadedModule, MedusaContainer, ModuleBootstrapDeclaration, ModuleDefinition, ModuleExports, ModuleJoinerConfig, ModuleResolution } from "@medusajs/types";
declare global {
    interface MedusaModule {
        getLoadedModules(aliases?: Map<string, string>): {
            [key: string]: LoadedModule;
        }[];
        getModuleInstance(moduleKey: string, alias?: string): LoadedModule;
    }
}
export type ModuleBootstrapOptions = {
    moduleKey: string;
    defaultPath: string;
    declaration?: ModuleBootstrapDeclaration;
    moduleExports?: ModuleExports;
    sharedContainer?: MedusaContainer;
    moduleDefinition?: ModuleDefinition;
    injectedDependencies?: Record<string, any>;
    /**
     * In this mode, all instances are partially loaded, meaning that the module will not be fully loaded and the services will not be available.
     * Don't forget to clear the instances (MedusaModule.clearInstances()) after the migration are done.
     */
    migrationOnly?: boolean;
    /**
     * Forces the modules bootstrapper to only run the modules loaders and return prematurely. This
     * is meant for modules that have data loader. In a test env, in order to clear all data
     * and load them back, we need to run those loader again
     */
    loaderOnly?: boolean;
    workerMode?: "shared" | "worker" | "server";
};
export type LinkModuleBootstrapOptions = {
    definition: LinkModuleDefinition;
    declaration?: InternalModuleDeclaration;
    moduleExports?: ModuleExports;
    injectedDependencies?: Record<string, any>;
};
export declare class MedusaModule {
    private static instances_;
    private static modules_;
    private static loading_;
    private static joinerConfig_;
    private static moduleResolutions_;
    static getLoadedModules(aliases?: Map<string, string>): {
        [key: string]: LoadedModule;
    }[];
    static onApplicationStart(onApplicationStartCb?: () => void): void;
    static onApplicationShutdown(): Promise<void>;
    static onApplicationPrepareShutdown(): Promise<void>;
    static clearInstances(): void;
    static isInstalled(moduleKey: string, alias?: string): boolean;
    static getJoinerConfig(moduleKey: string): ModuleJoinerConfig;
    static getAllJoinerConfigs(): ModuleJoinerConfig[];
    static getModuleResolutions(moduleKey: string): ModuleResolution;
    static getAllModuleResolutions(): ModuleResolution[];
    static setModuleResolution(moduleKey: string, resolution: ModuleResolution): ModuleResolution;
    static setJoinerConfig(moduleKey: string, config: ModuleJoinerConfig): ModuleJoinerConfig;
    static getModuleInstance(moduleKey: string, alias?: string): any | undefined;
    private static registerModule;
    static bootstrap<T>({ moduleKey, defaultPath, declaration, moduleExports, sharedContainer, moduleDefinition, injectedDependencies, migrationOnly, loaderOnly, workerMode, }: ModuleBootstrapOptions): Promise<{
        [key: string]: T;
    }>;
    static bootstrapLink({ definition, declaration, moduleExports, injectedDependencies, }: LinkModuleBootstrapOptions): Promise<{
        [key: string]: unknown;
    }>;
    static migrateUp(moduleKey: string, modulePath: string, options?: Record<string, any>, moduleExports?: ModuleExports): Promise<void>;
    static migrateDown(moduleKey: string, modulePath: string, options?: Record<string, any>, moduleExports?: ModuleExports): Promise<void>;
}
