import { ModuleServiceInitializeOptions } from "@medusajs/types"
import { knex } from "@medusajs/deps/mikro-orm/postgresql"
import { parse } from "pg-connection-string"

type Options = ModuleServiceInitializeOptions["database"]

type DynamicPassword = NonNullable<
  NonNullable<Options["driverOptions"]>["dynamicPassword"]
>

/**
 * pg merges parse(connectionString) over the explicit connection fields, which
 * replaces a password function with the URL's password (an empty string when
 * the URL has none). Perform that merge here instead, then reinstate the
 * function so pg calls it for every new connection.
 */
function withDynamicPassword(
  clientUrl: string,
  connection: Record<string, unknown>,
  dynamicPassword: DynamicPassword
) {
  const { password: _urlPassword, port, ...fromUrl } = parse(clientUrl)

  return {
    ...connection,
    ...fromUrl,
    ...(port ? { port: Number(port) } : {}),
    password: dynamicPassword,
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

  const connection = {
    ssl: ssl as any,
    idle_in_transaction_session_timeout:
      (driverOptions?.idle_in_transaction_session_timeout as number) ??
      undefined, // prevent null to be passed

    connectionTimeoutMillis: connectionTimeoutMillis as number, // Fail fast on slow connects
    keepAlive: keepAlive as boolean, // Prevent connections from being dropped
    keepAliveInitialDelayMillis: keepAliveInitialDelayMillis as number, // Start keepalive probes after 10s
  }

  const dynamicPassword = driverOptions?.dynamicPassword
  let connectionConfig: Record<string, unknown>
  if (!dynamicPassword) {
    connectionConfig = { connectionString: clientUrl, ...connection }
  } else if (clientUrl) {
    connectionConfig = withDynamicPassword(
      clientUrl,
      connection,
      dynamicPassword
    )
  } else {
    // Without a URL, pg reads the connection details from the PG* environment
    // variables
    connectionConfig = { ...connection, password: dynamicPassword }
  }

  return knex<any, any>({
    client: "pg",
    searchPath: schema,
    connection: connectionConfig,
    pool: {
      propagateCreateError: false, // Don't fail entire pool on one bad connection
      min: (pool?.min as number) ?? 1,
      // https://knexjs.org/guide/#pool
      ...(pool ?? {}),
    },
  })
}

export const isSharedConnectionSymbol = Symbol.for("isSharedConnection")
