import { asValue, AwilixContainer } from "awilix"
import {
  DataSource,
  DataSourceOptions,
  Repository,
  TreeRepository,
} from "typeorm"
import { ConfigModule } from "../types/global"
import "../utils/naming-strategy"
import {
  handlePostgresDatabaseError,
  PG_KNEX_CONNECTION_REGISTRATION_KEY,
} from "@medusajs/utils"

type Options = {
  configModule: ConfigModule
  container: AwilixContainer
  customOptions?: {
    migrations: DataSourceOptions["migrations"]
    logging: DataSourceOptions["logging"]
  }
}

export let dataSource: DataSource

// TODO: With the latest version of typeorm, the datasource is expected to be
// available globally. During the integration test, the medusa
// files are imported from @medusajs/medusa, therefore, the repositories are
// evaluated at the same time, unfortunately, the integration tests have their
// own way to load and at the moment, the datasource does not exists. This is
// why we are mocking them here
if (process.env.NODE_ENV === "test") {
  dataSource = {
    getRepository: (target) => new Repository(target, {} as any) as any,
    getTreeRepository: (target) => new TreeRepository(target, {} as any) as any,
  } as unknown as DataSource
}

export default async ({
  container,
  configModule,
  customOptions,
}: Options): Promise<DataSource> => {
  const entities = container.resolve("db_entities")

  const connectionString = configModule.projectConfig.database_url
  const database = configModule.projectConfig.database_database
  const extra: any = configModule.projectConfig.database_extra || {}
  const schema = configModule.projectConfig.database_schema || "public"

  dataSource = new DataSource({
    type: "postgres",
    url: connectionString,
    database: database,
    extra,
    schema,
    entities,
    migrations: customOptions?.migrations,
    logging:
      customOptions?.logging ??
      (configModule.projectConfig.database_logging || false),
  } as DataSourceOptions)

  await dataSource.initialize().catch(handlePostgresDatabaseError)

  // If migrations are not included in the config, we assume you are attempting to start the server
  // Therefore, throw if the database is not migrated
  if (!dataSource.migrations?.length) {
    await dataSource
      .query(`select * from migrations`)
      .catch(handlePostgresDatabaseError)
  }

  // Share a knex connection to be consumed by the shared modules
  if (!container.hasRegistration(PG_KNEX_CONNECTION_REGISTRATION_KEY)) {
    const pgConnection = require("knex")({
      client: "pg",
      searchPath: schema,
      connection: {
        connectionString: connectionString,
        database: database,
        ssl: extra?.ssl ?? false,
        idle_in_transaction_session_timeout:
          extra.idle_in_transaction_session_timeout ?? undefined, // prevent null to be passed
      },
      pool: {
        min: 0,
        max: extra.max,
        idleTimeoutMillis: extra.idleTimeoutMillis ?? undefined, // prevent null to be passed
      },
    })

    container.register(
      PG_KNEX_CONNECTION_REGISTRATION_KEY,
      asValue(pgConnection)
    )
  }

  return dataSource
}
