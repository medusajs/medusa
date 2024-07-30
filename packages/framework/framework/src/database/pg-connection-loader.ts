import { ContainerRegistrationKeys, ModulesSdkUtils } from "@medusajs/utils"
import { asValue } from "awilix"
import { container } from "../container"
import { configManager } from "../config"

/**
 * Initialize a knex connection that can then be shared to any resources if needed
 */
export function pgConnectionLoader(): ReturnType<
  typeof ModulesSdkUtils.createPgConnection
> {
  if (container.hasRegistration(ContainerRegistrationKeys.PG_CONNECTION)) {
    return container.resolve(ContainerRegistrationKeys.PG_CONNECTION)
  }

  const configModule = configManager.config

  // Share a knex connection to be consumed by the shared modules
  const connectionString = configModule.projectConfig.databaseUrl
  const driverOptions: any =
    configModule.projectConfig.databaseDriverOptions || {}
  const schema = configModule.projectConfig.databaseSchema || "public"
  const idleTimeoutMillis = driverOptions.pool?.idleTimeoutMillis ?? undefined // prevent null to be passed
  const poolMax = driverOptions.pool?.max

  delete driverOptions.pool

  const pgConnection = ModulesSdkUtils.createPgConnection({
    clientUrl: connectionString,
    schema,
    driverOptions,
    pool: {
      max: poolMax,
      idleTimeoutMillis,
    },
  })

  container.register(
    ContainerRegistrationKeys.PG_CONNECTION,
    asValue(pgConnection)
  )

  return pgConnection
}
