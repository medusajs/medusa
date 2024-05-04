import { MikroORM, Options, SqlEntityManager } from "@mikro-orm/postgresql";
export declare function getDatabaseURL(dbName?: string): string;
export declare function getMikroOrmConfig({ mikroOrmEntities, pathToMigrations, clientUrl, schema, }: {
    mikroOrmEntities: any[];
    pathToMigrations?: string;
    clientUrl?: string;
    schema?: string;
}): Options;
export interface TestDatabase {
    mikroOrmEntities: any[];
    pathToMigrations?: string;
    schema?: string;
    clientUrl?: string;
    orm: MikroORM | null;
    manager: SqlEntityManager | null;
    setupDatabase(): Promise<void>;
    clearDatabase(): Promise<void>;
    getManager(): SqlEntityManager;
    forkManager(): SqlEntityManager;
    getOrm(): MikroORM;
}
export declare function getMikroOrmWrapper({ mikroOrmEntities, pathToMigrations, clientUrl, schema, }: {
    mikroOrmEntities: any[];
    pathToMigrations?: string;
    clientUrl?: string;
    schema?: string;
}): TestDatabase;
