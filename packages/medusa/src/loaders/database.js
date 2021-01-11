import { createConnection, Connection } from "typeorm"

export default async ({ container, configModule }) => {
  const entities = container.resolve("db_entities")

  const connection = await createConnection({
    type: configModule.projectConfig.database_type,
    url: configModule.projectConfig.database_url,
    entities,
    logging: true,
  })

  return connection
}
