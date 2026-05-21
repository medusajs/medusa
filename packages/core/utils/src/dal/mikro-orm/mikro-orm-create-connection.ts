import { Filter as MikroORMFilter } from "@medusajs/deps/mikro-orm/core"
import { TSMigrationGenerator } from "@medusajs/deps/mikro-orm/migrations"
import { ModuleServiceInitializeOptions } from "@medusajs/types"
import { isString, retryExecution, stringifyCircular } from "../../common"
import { normalizeMigrationSQL } from "../utils"
import { CustomDBMigrator } from "./custom-db-migrator"

type FilterDef = Parameters<typeof MikroORMFilter>[0]

const expectedMigrationsImportStatement =
  'import { Migration } from "@medusajs/framework/mikro-orm/migrations"'

export class CustomTsMigrationGenerator extends TSMigrationGenerator {
  // TODO: temporary fix to drop unique constraint before creating unique index
  private dropUniqueConstraintBeforeUniqueIndex(
    sqlPatches: string[],
    sql: string
  ) {
    // DML unique index
    const uniqueIndexName = sql.match(/"IDX_(.+?)_unique"/)?.[1]
    if (!uniqueIndexName) {
      return
    }

    // Add drop unique constraint if it exists, using the same name as index without IDX_ prefix
    const tableName = sql.match(/ON "(.+?)"/)?.[1]
    if (tableName) {
      sqlPatches.push(
        `alter table if exists "${tableName}" drop constraint if exists "${uniqueIndexName}_unique";`
      )
    }
  }

  generateMigrationFile(
    className: string,
    diff: { up: string[]; down: string[] }
  ): string {
    const sqlPatches: string[] = []
    for (const sql of diff.up) {
      this.dropUniqueConstraintBeforeUniqueIndex(sqlPatches, sql)
    }

    for (const sql of sqlPatches) {
      diff.up.unshift(sql)
    }

    let migrationFileContent = super.generateMigrationFile(className, diff)
    migrationFileContent = migrationFileContent
      .replace(
        'import { Migration } from "@mikro-orm/migrations"',
        expectedMigrationsImportStatement
      )
      .replace(
        "import { Migration } from '@mikro-orm/migrations'",
        expectedMigrationsImportStatement
      )
    return migrationFileContent
  }

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
      generator: CustomTsMigrationGenerator,
      silent: !(
        database.debug ??
        process.env.NODE_ENV?.startsWith("dev") ??
        false
      ),
    },
    extensions: [CustomDBMigrator],
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
