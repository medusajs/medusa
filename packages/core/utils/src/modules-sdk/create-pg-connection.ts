import { ModuleServiceInitializeOptions } from "@medusajs/types"
import { knex } from "@medusajs/deps/mikro-orm/postgresql"

type Options = ModuleServiceInitializeOptions["database"]

/**
 * Create a new knex (pg in the future) connection which can be reused and shared
 * @param options
 */
export function createPgConnection(options: Options) {
  const { pool, schema = "public", clientUrl, driverOptions } = options
  const ssl =
    options.driverOptions?.ssl ??
    options.driverOptions?.connection?.ssl ??
    false
  const connectionTimeoutMillis =
    driverOptions?.connectionTimeoutMillis ??
    driverOptions?.connection?.connectionTimeoutMillis ??
    5000
  const keepAliveInitialDelayMillis =
    driverOptions?.keepAliveInitialDelayMillis ??
    driverOptions?.connection?.keepAliveInitialDelayMillis ??
    10000
  const keepAlive =
    driverOptions?.keepAlive ?? driverOptions?.connection?.keepAlive ?? true

  return knex<any, any>({
    client: "pg",
    searchPath: schema,
    connection: {
      connectionString: clientUrl,
      ssl: ssl as any,
      idle_in_transaction_session_timeout:
        (driverOptions?.idle_in_transaction_session_timeout as number) ??
        undefined, // prevent null to be passed

      connectionTimeoutMillis: connectionTimeoutMillis as number, // Fail fast on slow connects
      keepAlive: keepAlive as boolean, // Prevent connections from being dropped
      keepAliveInitialDelayMillis: keepAliveInitialDelayMillis as number, // Start keepalive probes after 10s
      ...(driverOptions?.dynamicPassword ? { password: driverOptions.dynamicPassword } : {}),
      ...(driverOptions?.expirationChecker
        ? { expirationChecker: driverOptions.expirationChecker }
        : {}),
    },
    pool: {
      propagateCreateError: false, // Don't fail entire pool on one bad connection
      min: (pool?.min as number) ?? 1,
      // https://knexjs.org/guide/#pool
      ...(pool ?? {}),
    },
  })
}

export const isSharedConnectionSymbol = Symbol.for("isSharedConnection")
