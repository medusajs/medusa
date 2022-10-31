import {
  Connection,
  createConnection,
  getConnectionManager,
  getConnection,
} from "typeorm"
import { ShortenedNamingStrategy } from "../utils/naming-strategy"
import { AwilixContainer } from "awilix"
import { ConnectionOptions } from "typeorm/connection/ConnectionOptions"
import { ConfigModule, Logger } from "../types/global"

type Options = {
  configModule: ConfigModule
  container: AwilixContainer
  logger: Logger
}

export default async ({
  container,
  configModule,
  logger,
}: Options): Promise<Connection> => {
  const entities = container.resolve("db_entities")

  const isSqlite = configModule.projectConfig.database_type === "sqlite"

  logger.info(JSON.stringify(configModule.projectConfig))
  const cnnManager = getConnectionManager()
  if (cnnManager.has("default") && getConnection().isConnected) {
    await getConnection().close()
  }

  const connection = await createConnection({
    type: configModule.projectConfig.database_type,
    url: configModule.projectConfig.database_url,
    database: configModule.projectConfig.database_database,
    extra: configModule.projectConfig.database_extra || {},
    entities,
    namingStrategy: new ShortenedNamingStrategy(),
    logging: configModule.projectConfig.database_logging || false,
  } as ConnectionOptions)

  if (isSqlite) {
    await connection.query(`PRAGMA foreign_keys = OFF`)
    await connection.synchronize()
    await connection.query(`PRAGMA foreign_keys = ON`)
  }

  return connection
}
