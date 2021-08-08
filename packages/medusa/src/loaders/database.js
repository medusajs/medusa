import { createConnection, Connection, DefaultNamingStrategy } from "typeorm"

import { ShortenedNamingStrategy } from "../utils/naming-strategy"

export default async ({ container, configModule }) => {
  const entities = container.resolve("db_entities")

  const isSqlite = configModule.projectConfig.database_type === "sqlite"

  const connection = await createConnection({
    type: configModule.projectConfig.database_type,
    url: configModule.projectConfig.database_url,
    database: configModule.projectConfig.database_database,
    extra: configModule.projectConfig.database_extra || {},
    entities,
    synchronize: isSqlite,
    namingStrategy: new ShortenedNamingStrategy(),
    logging: configModule.projectConfig.database_logging || false,
  })

  return connection
}
