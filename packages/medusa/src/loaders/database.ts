import {
  Connection,
  createConnection,
  getConnectionManager,
  getConnection,
} from "typeorm"
import { ShortenedNamingStrategy } from "../utils/naming-strategy"
import { AwilixContainer } from "awilix"
import { ConnectionOptions } from "typeorm/connection/ConnectionOptions"
import { ConfigModule } from "../types/global"

type Options = {
  configModule: ConfigModule
  container: AwilixContainer
}

export default async ({
  container,
  configModule,
}: Options): Promise<Connection> => {
  const entities = container.resolve("db_entities")

  const isSqlite = configModule.projectConfig.database_type === "sqlite"

  let connection: Connection
  if (!getConnectionManager().has("default")) {
    connection = await createConnection({
      type: configModule.projectConfig.database_type,
      url: configModule.projectConfig.database_url,
      database: configModule.projectConfig.database_database,
      extra: configModule.projectConfig.database_extra || {},
      entities,
      namingStrategy: new ShortenedNamingStrategy(),
      logging: configModule.projectConfig.database_logging || false,
    } as ConnectionOptions)
  } else {
    connection = getConnection()

    if (!connection.isConnected) {
      await connection.connect()
    }
  }

  if (isSqlite) {
    await connection.query(`PRAGMA foreign_keys = OFF`)
    await connection.synchronize()
    await connection.query(`PRAGMA foreign_keys = ON`)
  }

  return connection
}
