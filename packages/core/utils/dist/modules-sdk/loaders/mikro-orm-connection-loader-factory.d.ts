/**
 * Factory for creating a MikroORM connection loader for the modules
 *
 * @param moduleName
 * @param moduleModels
 * @param migrationsPath
 */
export declare function mikroOrmConnectionLoaderFactory({ moduleName, moduleModels, migrationsPath, }: {
    moduleName: string;
    moduleModels: any[];
    migrationsPath?: string;
}): any;
