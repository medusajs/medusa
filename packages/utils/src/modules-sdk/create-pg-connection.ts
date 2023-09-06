import knex from "knex"
import { ModuleServiceInitializeOptions } from "@medusajs/types"
import { loadDatabaseConfig } from "./load-module-database-config"

type Options = {
  database: ModuleServiceInitializeOptions["database"]
  pool?: {
    name?: string
    afterCreate?: Function
    min?: number
    max?: number
    refreshIdle?: boolean
    idleTimeoutMillis?: number
    reapIntervalMillis?: number
    returnToHead?: boolean
    priorityRange?: number
    log?: (message: string, logLevel: string) => void
  }
}

/**
 * Create a new knex (pg in the future) connection which can be reused and shared
 * @param options
 */
export function createPgConnection(options: Options) {
  const dbData = loadDatabaseConfig(
    "medusa",
    { database: options.database },
    true
  )!

  const schema = dbData.schema ?? "public"
  const connectionString = dbData.clientUrl
  const ssl = dbData.driverOptions?.ssl ?? false

  return knex<any, any>({
    client: "pg",
    searchPath: schema,
    connection: {
      connectionString: connectionString,
      ssl,
      idle_in_transaction_session_timeout:
        (options.database.driverOptions
          ?.idle_in_transaction_session_timeout as number) ?? undefined, // prevent null to be passed
    },
    pool: {
      // https://knexjs.org/guide/#pool
      ...(options.pool ?? {}),
      min: options.pool?.min ?? 0,
    },
  })
}
