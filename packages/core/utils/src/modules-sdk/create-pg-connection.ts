import { ModuleServiceInitializeOptions } from "@medusajs/types"
import { knex } from "@medusajs/deps/mikro-orm/postgresql"

type Options = ModuleServiceInitializeOptions["database"]

/**
 * Build the knex connection config object.
 *
 * When dynamicPassword is provided, we parse the URL into discrete fields
 * instead of passing connectionString. This is required because pg's
 * ConnectionParameters does:
 *
 *   Object.assign({}, config, parse(config.connectionString))
 *
 * The parsed URL always includes a `password` key (empty string for passwordless
 * URLs), which overwrites any password function via Object.assign. By passing
 * discrete fields without connectionString, the password function is preserved
 * and pg invokes it on every new connection.
 */
function buildConnectionConfig(
  clientUrl: string,
  ssl: any,
  driverOptions: any,
  connectionTimeoutMillis: number,
  keepAlive: boolean,
  keepAliveInitialDelayMillis: number
) {
  const sharedConfig = {
    ssl: ssl as any,
    idle_in_transaction_session_timeout:
      (driverOptions?.idle_in_transaction_session_timeout as number) ??
      undefined,
    connectionTimeoutMillis: connectionTimeoutMillis as number,
    keepAlive: keepAlive as boolean,
    keepAliveInitialDelayMillis: keepAliveInitialDelayMillis as number,
    ...(driverOptions?.expirationChecker
      ? { expirationChecker: driverOptions.expirationChecker }
      : {}),
  }

  if (driverOptions?.dynamicPassword) {
    // Parse URL into discrete fields so pg does not clobber the password function
    const parsed = new URL(clientUrl)
    return {
      host: parsed.hostname,
      port: Number(parsed.port) || 5432,
      user: decodeURIComponent(parsed.username),
      database: parsed.pathname.slice(1),
      password: driverOptions.dynamicPassword,
      ...sharedConfig,
    }
  }

  return {
    connectionString: clientUrl,
    ...sharedConfig,
  }
}

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
    connection: buildConnectionConfig(
      clientUrl!,
      ssl,
      driverOptions,
      connectionTimeoutMillis as number,
      keepAlive as boolean,
      keepAliveInitialDelayMillis as number
    ),
    pool: {
      propagateCreateError: false, // Don't fail entire pool on one bad connection
      min: (pool?.min as number) ?? 1,
      // https://knexjs.org/guide/#pool
      ...(pool ?? {}),
    },
  })
}

export const isSharedConnectionSymbol = Symbol.for("isSharedConnection")
