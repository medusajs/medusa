import { ModulesSdkTypes } from "@medusajs/types";
/**
 * Load the config for the database connection. The options can be retrieved
 * e.g through PRODUCT_* (e.g PRODUCT_POSTGRES_URL) or * (e.g POSTGRES_URL) environment variables or the options object.
 * @param options
 * @param moduleName
 */
export declare function loadDatabaseConfig(moduleName: string, options?: ModulesSdkTypes.ModuleServiceInitializeOptions, silent?: boolean): Pick<ModulesSdkTypes.ModuleServiceInitializeOptions["database"], "clientUrl" | "schema" | "driverOptions" | "debug">;
