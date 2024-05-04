import { ModuleServiceInitializeOptions } from "@medusajs/types";
import { TSMigrationGenerator } from "@mikro-orm/migrations";
import { FilterDef } from "@mikro-orm/core/typings";
export { TSMigrationGenerator };
export type Filter = {
    name?: string;
} & Omit<FilterDef, "name">;
export declare function mikroOrmCreateConnection(database: ModuleServiceInitializeOptions["database"] & {
    connection?: any;
    filters?: Record<string, Filter>;
}, entities: any[], pathToMigrations: string): Promise<import("@mikro-orm/core").MikroORM<import("@mikro-orm/postgresql").PostgreSqlDriver>>;
