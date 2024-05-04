import { LoaderOptions, ModulesSdkTypes } from "@medusajs/types";
/**
 * Utility function to build a migration script that will run the migrations.
 * Only used in mikro orm based modules.
 * @param moduleName
 * @param models
 * @param pathToMigrations
 */
export declare function buildMigrationScript({ moduleName, models, pathToMigrations }: {
    moduleName: any;
    models: any;
    pathToMigrations: any;
}): ({ options, logger, }?: Pick<LoaderOptions<ModulesSdkTypes.ModuleServiceInitializeOptions>, "options" | "logger">) => Promise<void>;
