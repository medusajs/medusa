import { knex } from "@mikro-orm/knex"
import { ModuleServiceInitializeOptions } from "@medusajs/types"
import { isDefined } from "../common"

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

  return knex<any, any>({
    client: "pg",
    searchPath: schema,
    connection: {
      connectionString: clientUrl,
      ssl,
      idle_in_transaction_session_timeout:
        (driverOptions?.idle_in_transaction_session_timeout as number) ??
        undefined, // prevent null to be passed
    },
    pool: {
      // https://knexjs.org/guide/#pool
      ...(pool ?? {}),
      min: (pool?.min as number) ?? 0,
    },
  })
}
