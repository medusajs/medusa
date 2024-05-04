import { Logger, MedusaContainer, ModuleExports, ModuleResolution } from "@medusajs/types";
export declare function loadInternalModule(container: MedusaContainer, resolution: ModuleResolution, logger: Logger, migrationOnly?: boolean, loaderOnly?: boolean): Promise<{
    error?: Error;
} | void>;
export declare function loadModuleMigrations(resolution: ModuleResolution, moduleExports?: ModuleExports): Promise<[Function | undefined, Function | undefined]>;
