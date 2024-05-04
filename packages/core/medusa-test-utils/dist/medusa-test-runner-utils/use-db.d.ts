import { DataSource } from "typeorm";
export function initDb({ cwd, database_extra, env, force_modules_migration, dbUrl, dbSchema, }: {
    cwd: any;
    database_extra: any;
    env: any;
    force_modules_migration: any;
    dbUrl?: string | undefined;
    dbSchema?: string | undefined;
}): Promise<{
    dbDataSource: DataSource;
    pgConnection: any;
}>;
