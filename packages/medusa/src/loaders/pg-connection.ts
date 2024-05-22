import { ConfigModule } from "@medusajs/types"
import { ContainerRegistrationKeys, ModulesSdkUtils } from "@medusajs/utils"
import { asValue, AwilixContainer } from "awilix"

type Options = {
  container: AwilixContainer
  configModule: ConfigModule
}

export default async ({ container, configModule }: Options): Promise<any> => {
  if (container.hasRegistration(ContainerRegistrationKeys.PG_CONNECTION)) {
    return container.resolve(ContainerRegistrationKeys.PG_CONNECTION)
  }

  // Share a knex connection to be consumed by the shared modules
  const connectionString = configModule.projectConfig.database_url
  const driverOptions: any =
    configModule.projectConfig.database_driver_options || {}
  const schema = configModule.projectConfig.database_schema || "public"
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
