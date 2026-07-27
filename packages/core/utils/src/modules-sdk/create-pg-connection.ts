import { ModuleServiceInitializeOptions } from "@medusajs/types"
import { knex } from "@medusajs/deps/mikro-orm/postgresql"
import { buildConnectionConfig } from "./build-connection-config"

export { buildConnectionConfig }

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
