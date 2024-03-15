import { ModuleServiceInitializeOptions } from "@medusajs/types"
import { Migrator, TSMigrationGenerator } from "@mikro-orm/migrations"
import { isString } from "../../common"

// Monkey patch due to the compilation version issue which prevents us from creating a proper class that extends the TSMigrationGenerator
const originalCreateStatement = TSMigrationGenerator.prototype.createStatement

/**
 * Safe migration generation for MikroORM
 *
 * @param sql The sql statement
 * @param padLeft The padding
 *
 * @example see test file
 */
TSMigrationGenerator.prototype.createStatement = function (
  sql: string,
  padLeft: number
) {
  if (isString(sql)) {
    if (!sql.includes("create table if not exists")) {
      sql = sql.replace("create table", "create table if not exists")
    }

    if (!sql.includes("alter table if exists")) {
      sql = sql.replace("alter table", "alter table if exists")
    }

    if (!sql.includes("create index if not exists")) {
      sql = sql.replace("create index", "create index if not exists")
    }

    if (!sql.includes("drop index if exists")) {
      sql = sql.replace("drop index", "drop index if exists")
    }

    if (!sql.includes("create unique index if not exists")) {
      sql = sql.replace(
        "create unique index",
        "create unique index if not exists"
      )
    }

    if (!sql.includes("drop unique index if exists")) {
      sql = sql.replace("drop unique index", "drop unique index if exists")
    }

    if (!sql.includes("add column if not exists")) {
      sql = sql.replace("add column", "add column if not exists")
    }

    if (!sql.includes("alter column if exists exists")) {
      sql = sql.replace("alter column", "alter column if exists")
    }

    if (!sql.includes("drop column if exists")) {
      sql = sql.replace("drop column", "drop column if exists")
    }

    if (!sql.includes("drop constraint if exists")) {
      sql = sql.replace("drop constraint", "drop constraint if exists")
    }
  }

  return originalCreateStatement(sql, padLeft)
}

export { TSMigrationGenerator }

export async function mikroOrmCreateConnection(
  database: ModuleServiceInitializeOptions["database"] & { connection?: any },
  entities: any[],
  pathToMigrations: string
) {
  let schema = database.schema || "public"

  let driverOptions = database.driverOptions ?? {
    connection: { ssl: true },
  }

  let clientUrl = database.clientUrl

  if (database.connection) {
    // Reuse already existing connection
    // It is important that the knex package version is the same as the one used by MikroORM knex package
    driverOptions = database.connection
    clientUrl =
      database.connection.context?.client?.config?.connection?.connectionString
    schema = database.connection.context?.client?.config?.searchPath
  }

  const { MikroORM } = await import("@mikro-orm/postgresql")
  return await MikroORM.init({
    // TODO: Change checkDuplicateFileNames to true once we don't use both eg. product_id and product definitions on the model.
    discovery: {
      disableDynamicFileAccess: true,
      checkDuplicateFieldNames: false,
    },
    extensions: [Migrator],
    entities,
    debug: database.debug ?? process.env.NODE_ENV?.startsWith("dev") ?? false,
    baseDir: process.cwd(),
    clientUrl,
    schema,
    driverOptions,
    tsNode: process.env.APP_ENV === "development",
    migrations: {
      path: pathToMigrations,
      generator: TSMigrationGenerator,
    },
    pool: database.pool as any,
  })
}
