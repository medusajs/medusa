import { ModuleServiceInitializeOptions } from "@medusajs/types"
import { Filter as MikroORMFilter } from "@mikro-orm/core"
import { TSMigrationGenerator } from "@mikro-orm/migrations"
import { isString } from "../../common"
import { normalizeMigrationSQL } from "../utils"

type FilterDef = Parameters<typeof MikroORMFilter>[0]

export class CustomTsMigrationGenerator extends TSMigrationGenerator {
  createStatement(sql: string, padLeft: number): string {
    if (isString(sql)) {
      sql = normalizeMigrationSQL(sql)
    }

    return super.createStatement(sql, padLeft)
  }
}

export type Filter = {
  name?: string
} & Omit<FilterDef, "name">

export async function mikroOrmCreateConnection(
  database: ModuleServiceInitializeOptions["database"] & {
    connection?: any
    filters?: Record<string, Filter>
  },
  entities: any[],
  pathToMigrations: string
) {
  let schema = database.schema || "public"

  let driverOptions = database.driverOptions ?? {
    connection: { ssl: false },
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
    discovery: { disableDynamicFileAccess: true, warnWhenNoEntities: false },
    entities,
    debug: database.debug ?? process.env.NODE_ENV?.startsWith("dev") ?? false,
    baseDir: process.cwd(),
    clientUrl,
    schema,
    driverOptions,
    tsNode: process.env.APP_ENV === "development",
    type: "postgresql",
    filters: database.filters ?? {},
    migrations: {
      disableForeignKeys: false,
      path: pathToMigrations,
      generator: CustomTsMigrationGenerator,
      silent: !(
        database.debug ??
        process.env.NODE_ENV?.startsWith("dev") ??
        false
      ),
    },
    schemaGenerator: {
      disableForeignKeys: false,
    },
    pool: {
      min: 2,
      ...database.pool,
    },
  })
}
