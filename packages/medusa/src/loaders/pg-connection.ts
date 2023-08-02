import { asValue, AwilixContainer } from "awilix"
import { ConfigModule } from "../types/global"
import { ContainerRegistrationKeys } from "@medusajs/utils"
import { Client, ClientConfig } from "pg"

type Options = {
  configModule: ConfigModule
  container: AwilixContainer
}

export default async ({ container, configModule }: Options): Promise<void> => {
  const connectionString = configModule.projectConfig.database_url
  const database = configModule.projectConfig.database_database
  const extra: any = configModule.projectConfig.database_extra || {}
  const schema = configModule.projectConfig.database_schema || "public"

  // Share a knex connection to be consumed by the shared modules
  if (!container.hasRegistration(ContainerRegistrationKeys.PG_CONNECTION)) {
    const config: ClientConfig = {
      connectionString,
      database,
      ssl: extra?.ssl ?? false,
      idle_in_transaction_session_timeout:
        extra.idle_in_transaction_session_timeout ?? undefined, // prevent null to be passed
    }
    const pgConnection = await new Client(config).connect() // or any other method to create your connection here
    /* const pgConnection = knex<any, any>({
      client: "pg",
      searchPath: schema,
      connection: {
        connectionString: connectionString,
        database,
        ssl: extra?.ssl ?? false,
        idle_in_transaction_session_timeout:
          extra.idle_in_transaction_session_timeout ?? undefined, // prevent null to be passed
      },
      pool: {
        min: 0,
        max: extra.max,
        idleTimeoutMillis: extra.idleTimeoutMillis ?? undefined, // prevent null to be passed
      },
    })*/

    container.register(
      ContainerRegistrationKeys.PG_CONNECTION,
      asValue(pgConnection)
    )
  }
}
