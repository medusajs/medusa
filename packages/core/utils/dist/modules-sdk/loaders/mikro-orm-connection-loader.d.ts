import { Logger, MedusaContainer, ModulesSdkTypes } from "@medusajs/types";
/**
 * Load a MikroORM connection into the container
 *
 * @param moduleName
 * @param container
 * @param options
 * @param filters
 * @param moduleDeclaration
 * @param entities
 * @param pathToMigrations
 */
export declare function mikroOrmConnectionLoader({ moduleName, container, options, moduleDeclaration, entities, pathToMigrations, }: {
    moduleName: string;
    entities: any[];
    container: MedusaContainer;
    options?: ModulesSdkTypes.ModuleServiceInitializeOptions | ModulesSdkTypes.ModuleServiceInitializeCustomDataLayerOptions;
    moduleDeclaration?: ModulesSdkTypes.InternalModuleDeclaration;
    logger?: Logger;
    pathToMigrations: string;
}): Promise<void>;
