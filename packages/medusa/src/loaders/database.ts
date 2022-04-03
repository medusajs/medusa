import { Connection, createConnection, LoggerOptions } from "typeorm"
import { ShortenedNamingStrategy } from "../utils/naming-strategy"
import { AwilixContainer } from "awilix"
import { ConnectionOptions } from "typeorm/connection/ConnectionOptions"

export type DatabaseConfig = {
  database_type: string;
  database_url?: string;
  database_database?: string;
  database_extra?: Record<string, unknown>;
  database_logging: LoggerOptions
}

type Options = {
  configModule: { projectConfig: DatabaseConfig };
  container: AwilixContainer
}

export default async ({ container, configModule }: Options): Promise<Connection> => {
  const entities = container.resolve("db_entities")

  const isSqlite = configModule.projectConfig.database_type === "sqlite"

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
