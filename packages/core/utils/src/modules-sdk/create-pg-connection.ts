import { knex } from "@medusajs/deps/mikro-orm/postgresql"
import { ModuleServiceInitializeOptions } from "@medusajs/types"
import { parse } from "pg-connection-string"

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

  const dynamicPassword = driverOptions?.dynamicPassword as
    | (() => string)
    | (() => Promise<string>)
    | undefined
  const expirationChecker = driverOptions?.expirationChecker as
    | (() => boolean)
    | undefined

  // When a dynamic password is used, the connection must not be provided as a
  // connectionString: pg's ConnectionParameters assigns the parsed connectionString
  // fields over the config, which would replace the password function with the
  // (empty) string found in the URL. Instead, provide the connection as an async
  // factory resolving discrete fields, so the password is resolved per connection.
  if (dynamicPassword && clientUrl) {
    // Mirror pg's own connectionString handling: every parsed URL field is
    // applied to the connection (including query parameters such as sslmode),
    // except the password which comes from the dynamic password function.
    const { password: _urlPassword, ...parsedConnection } = parse(clientUrl)

    const resolveConnection = async () => {
      const connection: Record<string, unknown> = {
        ssl: ssl as any,
        idle_in_transaction_session_timeout:
          (driverOptions?.idle_in_transaction_session_timeout as number) ??
          undefined, // prevent null to be passed

        connectionTimeoutMillis: connectionTimeoutMillis as number, // Fail fast on slow connects
        keepAlive: keepAlive as boolean, // Prevent connections from being dropped
        keepAliveInitialDelayMillis: keepAliveInitialDelayMillis as number, // Start keepalive probes
        ...parsedConnection,
      }

      if (expirationChecker) {
        // Consumed by knex: when it reports true, connections are recreated and
        // the dynamic password is resolved again
        connection.expirationChecker = expirationChecker
      }

      // Applied last so the URL can never override the resolved credential
      connection.password = await dynamicPassword()

      return connection
    }

    return knex<any, any>({
      client: "pg",
      searchPath: schema,
      connection: resolveConnection,
      pool: {
        propagateCreateError: false, // Don't fail entire pool on one bad connection
        min: (pool?.min as number) ?? 1,
        // https://knexjs.org/guide/#pool
        ...(pool ?? {}),
      },
    })
  }

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
      keepAliveInitialDelayMillis: keepAliveInitialDelayMillis as number, // Start keepalive probes
      ...(dynamicPassword ? { password: dynamicPassword } : {}),
      ...(expirationChecker ? { expirationChecker } : {}),
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
