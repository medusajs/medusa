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

  dataSource = new DataSource({
    type: "postgres",
    url: configModule.projectConfig.database_url,
    database: configModule.projectConfig.database_database,
    extra: configModule.projectConfig.database_extra || {},
    schema: configModule.projectConfig.database_schema,
    entities,
    migrations: customOptions?.migrations,
    logging:
      customOptions?.logging ??
      (configModule.projectConfig.database_logging || false),
  } as DataSourceOptions)

  try {
    await dataSource.initialize()
  } catch (err) {
    // database name does not exist
    if (err.code === "3D000") {
      throw new Error(
        `Specified database does not exist. Please create it and try again.\n${err.message}`
      )
    }

    throw err
  }

  // If migrations are not included in the config, we assume you are attempting to start the server
  // Therefore, throw if the database is not migrated
  if (!dataSource.migrations?.length) {
    try {
      await dataSource.query(`select * from migrations`)
    } catch (err) {
      if (err.code === "42P01") {
        throw new Error(
          `Migrations missing. Please run 'medusa migrations run' and try again.`
        )
      }

      throw err
    }
  }

  return dataSource
}
