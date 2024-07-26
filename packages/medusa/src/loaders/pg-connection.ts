import { ConfigModule } from "@medusajs/framework"
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
