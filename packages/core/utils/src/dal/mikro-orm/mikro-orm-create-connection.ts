import { Filter as MikroORMFilter } from "@medusajs/deps/mikro-orm/core"
import { ModuleServiceInitializeOptions } from "@medusajs/types"
import { retryExecution, stringifyCircular } from "../../common"

type FilterDef = Parameters<typeof MikroORMFilter>[0]

/**
 * Registers the migrator without loading the migrations tooling, which the
 * connections modules open at boot never use: it's loaded on the first
 * `getMigrator()` call.
 */
class LazyDBMigrator {
  static register(orm: any): void {
    orm.config.registerExtension("@mikro-orm/migrator", () => {
      const { CustomDBMigrator } = require("./custom-db-migrator")
      const {
        CustomTsMigrationGenerator,
      } = require("./custom-ts-migration-generator")
      orm.config.get("migrations").generator ??= CustomTsMigrationGenerator
      return new CustomDBMigrator(orm.em)
    })
  }
}


export type Filter = {
  name?: string
} & Omit<FilterDef, "name">

export async function mikroOrmCreateConnection(
  database: ModuleServiceInitializeOptions["database"] & {
    connection?: any
    snapshotName?: string
    snapshot?: boolean
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

  const { MikroORM, defineConfig } = await import(
    "@medusajs/deps/mikro-orm/postgresql"
  )
  const mikroOrmConfig = defineConfig({
    discovery: { disableDynamicFileAccess: true, warnWhenNoEntities: false },
    entities,
    debug: database.debug ?? process.env.NODE_ENV?.startsWith("dev") ?? false,
    baseDir: process.cwd(),
    clientUrl,
    schema,
    driverOptions,
    tsNode: process.env.APP_ENV === "development",
    filters: database.filters ?? {},
    useBatchInserts: true,
    useBatchUpdates: true,
    implicitTransactions: false,
    ignoreUndefinedInQuery: true,
    // Introduced in MikroORM 6.5.0: when enabled, MikroORM auto-joins referenced entities
    // (e.g. INNER JOINs PaymentSession when querying Payment) to apply their global filters
    // (e.g. softDeletable). For non-nullable FKs this uses INNER JOIN, silently excluding
    // owning entities (e.g. Payment) when the referenced entity (e.g. PaymentSession) is
    // soft-deleted. Medusa was designed around MikroORM 6.4.x where this didn't exist, so
    // we disable it to preserve the expected behavior.
    autoJoinRefsForFilters: false,
    batchSize: 100,
    metadataCache: {
      enabled: true,
    },
    assign: {
      convertCustomTypes: true,
    },
    migrations: {
      disableForeignKeys: false,
      path: pathToMigrations,
      snapshotName: database.snapshotName,
      snapshot: database.snapshot,
      silent: !(
        database.debug ??
        process.env.NODE_ENV?.startsWith("dev") ??
        false
      ),
    },
    extensions: [LazyDBMigrator],
    // We don't want to do any DB checks when establishing the connection. This happens once when creating the pg_connection, and it can happen again explicitly if necessary.
    connect: false,
    ensureDatabase: false,
    schemaGenerator: {
      disableForeignKeys: false,
    },
    pool: {
      min: 2,
      ...database.pool,
    },
  })

  const maxRetries = process.env.__MEDUSA_DB_CONNECTION_MAX_RETRIES
    ? parseInt(process.env.__MEDUSA_DB_CONNECTION_MAX_RETRIES)
    : 5

  const retryDelay = process.env.__MEDUSA_DB_CONNECTION_RETRY_DELAY
    ? parseInt(process.env.__MEDUSA_DB_CONNECTION_RETRY_DELAY)
    : 1000

  return await retryExecution(
    async () => {
      return await MikroORM.init(mikroOrmConfig)
    },
    {
      maxRetries,
      retryDelay,
      onRetry: (error) => {
        console.warn(
          `MikroORM failed to connect to the database. Retrying...\n${stringifyCircular(
            error
          )}`
        )
      },
    }
  )
}
