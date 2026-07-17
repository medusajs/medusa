import {
  ContainerRegistrationKeys,
  ModulesSdkUtils,
  retryExecution,
  stringifyCircular,
  withDbTroubleshootingLink,
} from "@medusajs/utils"
import { asValue } from "../deps/awilix"
import { configManager } from "../config"
import { container } from "../container"
import { logger } from "../logger"

/**
 * PostgreSQL error codes that indicate a permanent misconfiguration. Retrying
 * these is pointless and only delays surfacing the actual problem.
 */
const FATAL_PG_CONNECTION_ERROR_CODES = new Set([
  "3D000", // database does not exist
  "28P01", // invalid password
  "28000", // invalid authorization specification
  "42501", // insufficient privilege
])

const isFatalConnectionError = (error: unknown): boolean => {
  const code = (error as { code?: string })?.code
  return !!code && FATAL_PG_CONNECTION_ERROR_CODES.has(code)
}

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
  const schema = configModule.projectConfig.databaseSchema || "public"
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

  let lastConnectionError: Error | undefined
  let fatalConnectionError: Error | undefined
  pgConnection.client?.pool?.on?.(
    "createFail",
    (_eventId: unknown, error: Error) => {
      lastConnectionError = error
      if (isFatalConnectionError(error)) {
        fatalConnectionError = error
      }
    }
  )

  const formatConnectionError = (error: unknown) => {
    if (lastConnectionError && lastConnectionError !== error) {
      return `${stringifyCircular(lastConnectionError)}\n(pool reported: ${
        (error as Error)?.message ?? error
      })`
    }
    return stringifyCircular(lastConnectionError ?? error)
  }

  /**
   * A permanent misconfiguration (for example, a non-existent database or
   * invalid credentials) surfaces on the pool's `createFail` event almost
   * immediately, while `raw` stays pending until knex's acquire timeout (~60s)
   * because of `propagateCreateError: false`. Reject as soon as such a fatal
   * error is observed so the migrator/runtime doesn't wait for the full acquire
   * timeout on every retry.
   */
  const probeConnection = () => {
    if (fatalConnectionError) {
      return Promise.reject(fatalConnectionError)
    }

    return new Promise<void>((resolve, reject) => {
      let settled = false
      const settle = (fn: () => void) => {
        if (settled) {
          return
        }
        settled = true
        pgConnection.client?.pool?.removeListener?.("createFail", onFatal)
        fn()
      }

      const onFatal = (_eventId: unknown, error: Error) => {
        if (isFatalConnectionError(error)) {
          settle(() => reject(error))
        }
      }

      pgConnection.client?.pool?.on?.("createFail", onFatal)

      Promise.resolve(pgConnection.raw("SELECT 1"))
        .then(() => settle(resolve))
        .catch((error) => settle(() => reject(error)))
    })
  }

  try {
    await retryExecution(probeConnection, {
      maxRetries,
      retryDelay,
      shouldRetry: (error) =>
        !isFatalConnectionError(error) && !fatalConnectionError,
      onRetry: (error) => {
        logger.warn(
          `Pg connection failed to connect to the database. Retrying...\n${formatConnectionError(
            error
          )}`
        )
      },
    })
  } catch (error) {
    if (lastConnectionError) {
      lastConnectionError.message = withDbTroubleshootingLink(
        `Failed to connect to the database: ${lastConnectionError.message}`
      )
      throw lastConnectionError
    }

    if (error instanceof Error) {
      error.message = withDbTroubleshootingLink(error.message)
    }
    throw error
  }

  container.register(
    ContainerRegistrationKeys.PG_CONNECTION,
    asValue(pgConnection)
  )

  return pgConnection
}
