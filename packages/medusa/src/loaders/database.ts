import { handlePostgresDatabaseError } from "@medusajs/utils"
import { AwilixContainer } from "awilix"
import {
  DataSource,
  DataSourceOptions,
  Repository,
  TreeRepository,
} from "typeorm"
import { ConfigModule } from "../types/global"
import "../utils/naming-strategy"

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

  return dataSource
}
