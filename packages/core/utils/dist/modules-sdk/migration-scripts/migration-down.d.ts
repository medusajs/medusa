import { LoaderOptions, ModulesSdkTypes } from "@medusajs/types";
/**
 * Utility function to build a migration script that will revert the migrations.
 * Only used in mikro orm based modules.
 * @param moduleName
 * @param models
 * @param pathToMigrations
 */
export declare function buildRevertMigrationScript({ moduleName, models, pathToMigrations, }: {
    moduleName: any;
    models: any;
    pathToMigrations: any;
}): ({ options, logger, }?: Pick<LoaderOptions<ModulesSdkTypes.ModuleServiceInitializeOptions>, "options" | "logger">) => Promise<void>;
