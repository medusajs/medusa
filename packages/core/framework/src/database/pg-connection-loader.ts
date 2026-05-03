import {
  ContainerRegistrationKeys,
  ModulesSdkUtils,
  retryExecution,
  stringifyCircular,
} from "@medusajs/utils"
import { asValue } from "../deps/awilix"
import { configManager } from "../config"
import { container } from "../container"
import { logger } from "../logger"

/**
 * Initialize a knex connection that can then be shared to any resources if needed
 */
export async function pgConnectionLoader(): Promise<
  ReturnType<typeof ModulesSdkUtils.createPgConnection>
> {
  if (container.hasRegistration(ContainerRegistrationKeys.PG_CONNECTION)) {
    return container.resolve(
      ContainerRegistrationKeys.PG_CONNECTION
    ) as unknown as ReturnType<typeof ModulesSdkUtils.createPgConnection>
  }

  const configModule = configManager.config

  // Share a knex connection to be consumed by the shared modules
  const connectionString = configModule.projectConfig.databaseUrl
  const driverOptions: any = {
    ...(configModule.projectConfig.databaseDriverOptions || {}),
  }
  // Falls back to the DATABASE_SCHEMA env var so the shared knex
  // connection's search_path stays in sync with what each module's
  // `loadDatabaseConfig` resolves to (it reads the same env directly).
  //
  // Without this fallback, setting DATABASE_SCHEMA in the environment
  // without also assigning `projectConfig.databaseSchema` produces the
  // bug reported in medusajs/medusa#12001 and #769: modules that reuse
  // the shared connection write to "public" (because the shared knex's
  // searchPath is "public"), while modules that build their own
  // connection write to the configured schema. The result is one set
  // of tables in `public` and another in the requested schema.
  const schema =
    configModule.projectConfig.databaseSchema ||
    process.env.DATABASE_SCHEMA ||
    "public"
  const idleTimeoutMillis = driverOptions.pool?.idleTimeoutMillis ?? undefined // prevent null to be passed
  const poolMin = driverOptions.pool?.min ?? 2
  const poolMax = driverOptions.pool?.max
  const reapIntervalMillis = driverOptions.pool?.reapIntervalMillis ?? undefined
  const createRetryIntervalMillis =
    driverOptions.pool?.createRetryIntervalMillis ?? undefined

  delete driverOptions.pool

  const clientUrl = connectionString?.replace(
    /(\?|&)ssl_mode=[^&]*(&|$)/gi,
    (match, prefix, suffix) => {
      if (prefix === "?" && suffix === "&") return "?"
      if (prefix === "?" && suffix === "") return ""
      if (prefix === "&") return suffix
      return ""
    }
  )

  const pgConnection = ModulesSdkUtils.createPgConnection({
    clientUrl,
    schema,
    driverOptions,
    pool: {
      min: poolMin,
      max: poolMax,
      idleTimeoutMillis,
      reapIntervalMillis,
      createRetryIntervalMillis,
    },
  })

  const maxRetries = process.env.__MEDUSA_DB_CONNECTION_MAX_RETRIES
    ? parseInt(process.env.__MEDUSA_DB_CONNECTION_MAX_RETRIES)
    : 5

  const retryDelay = process.env.__MEDUSA_DB_CONNECTION_RETRY_DELAY
    ? parseInt(process.env.__MEDUSA_DB_CONNECTION_RETRY_DELAY)
    : 1000

  await retryExecution(
    async () => {
      await pgConnection.raw("SELECT 1")
    },
    {
      maxRetries,
      retryDelay,
      onRetry: (error) => {
        logger.warn(
          `Pg connection failed to connect to the database. Retrying...\n${stringifyCircular(
            error
          )}`
        )
      },
    }
  )

  container.register(
    ContainerRegistrationKeys.PG_CONNECTION,
    asValue(pgConnection)
  )

  return pgConnection
}
