import { ContainerRegistrationKeys, ModulesSdkUtils } from "@medusajs/utils"
import { asValue, AwilixContainer } from "awilix"
import { ConfigModule } from "../types/global"

type Options = {
  configModule: ConfigModule
  container: AwilixContainer
}

export default async ({ container, configModule }: Options): Promise<any> => {
  if (container.hasRegistration(ContainerRegistrationKeys.PG_CONNECTION)) {
    return container.resolve(ContainerRegistrationKeys.PG_CONNECTION)
  }

  // Share a knex connection to be consumed by the shared modules
  const connectionString = configModule.projectConfig.database_url
  const extra: any = configModule.projectConfig.database_extra || {}
  const schema = configModule.projectConfig.database_schema || "public"
  const idleTimeoutMillis = extra.idleTimeoutMillis ?? undefined // prevent null to be passed
  const poolMax = extra.max

  delete extra.max
  delete extra.idleTimeoutMillis

  const pgConnection = ModulesSdkUtils.createPgConnection({
    clientUrl: connectionString,
    schema,
    driverOptions: extra,
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
