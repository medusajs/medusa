import { LoaderOptions, Logger, ModulesSdkTypes } from "@medusajs/types";
/**
 * Utility function to build a seed script that will insert the seed data.
 * @param moduleName
 * @param models
 * @param pathToMigrations
 * @param seedHandler
 */
export declare function buildSeedScript({ moduleName, models, pathToMigrations, seedHandler, }: {
    moduleName: string;
    models: Record<string, unknown>;
    pathToMigrations: string;
    seedHandler: (args: {
        manager: any;
        logger: Logger;
        data: any;
    }) => Promise<void>;
}): ({ options, logger, path, }: Partial<Pick<LoaderOptions<ModulesSdkTypes.ModuleServiceInitializeOptions>, "logger" | "options">> & {
    path: string;
}) => Promise<void>;
