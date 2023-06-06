import { AwilixContainer } from "awilix"
import {
  DataSource,
  DataSourceOptions,
  Repository,
  TreeRepository,
} from "typeorm"
import { ConfigModule } from "../types/global"
import "../utils/naming-strategy"
import { EOL } from "os"

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
    handleError(err)
  }

  // If migrations are not included in the config, we assume you are attempting to start the server
  // Therefore, throw if the database is not migrated
  if (!dataSource.migrations?.length) {
    try {
      await dataSource.query(`select * from migrations`)
    } catch (err) {
      handleError(err)
    }
  }

  return dataSource
}

const DatabaseErrorCode = {
  databaseDoesNotExist: "3D000",
  connectionFailure: "ECONNREFUSED",
  wrongCredentials: "28000",
  notFound: "ENOTFOUND",
  migrationMissing: "42P01",
}

function handleError(err: any) {
  if (DatabaseErrorCode.databaseDoesNotExist === err.code) {
    throw new Error(
      `The specified PostgreSQL database does not exist. Please create it and try again.${EOL}${err.message}`
    )
  }

  if (DatabaseErrorCode.connectionFailure === err.code) {
    throw new Error(
      `The connection cannot be established to the specified PostgreSQL database. Please, check the following point.
      - Is the database running?
      - Is the database url correct?
      - Is the database port correct?
      Please, also verify that your medusa-config.js database_url is correctly formatted. It should be in the following format:
      postgres://user:password@host:post/db_name - If there is no password, you can omit it.
      ${EOL}
      ${err.message}`
    )
  }

  if (DatabaseErrorCode.wrongCredentials === err.code) {
    throw new Error(
      `The specified credentials does not exists for the specified PostgreSQL database.${EOL}${err.message}`
    )
  }

  if (DatabaseErrorCode.notFound === err.code) {
    throw new Error(
      `The specified connection url for your PostgreSQL database might contains illegal characters. Please check that all the connection segments contains only allowed characters [a-zA-Z0-9]${EOL}${err.message}`
    )
  }

  if (DatabaseErrorCode.migrationMissing === err.code) {
    throw new Error(
      `Migrations missing. Please run 'medusa migrations run' and try again.`
    )
  }

  throw err
}
