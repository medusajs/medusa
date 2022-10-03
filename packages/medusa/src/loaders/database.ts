import { DataSource, DataSourceOptions, Repository } from "typeorm"
import { ShortenedNamingStrategy } from "../utils/naming-strategy"
import { AwilixContainer } from "awilix"
import { ConfigModule } from "../types/global"

type Options = {
  configModule: ConfigModule
  container: AwilixContainer
}

export let dataSource: DataSource

if (process.env.NODE_ENV === "test") {
  dataSource = {
    getRepository: (target) => new Repository(target, {} as any) as any,
  } as unknown as DataSource
}

export default async ({
  container,
  configModule,
}: Options): Promise<DataSource> => {
  const entities = container.resolve("db_entities")

  const isSqlite = configModule.projectConfig.database_type === "sqlite"

  dataSource = new DataSource({
    type: configModule.projectConfig.database_type,
    url: configModule.projectConfig.database_url,
    database: configModule.projectConfig.database_database,
    extra: configModule.projectConfig.database_extra || {},
    entities,
    namingStrategy: new ShortenedNamingStrategy(),
    logging: configModule.projectConfig.database_logging || false,
  } as DataSourceOptions)

  await dataSource.initialize()

  if (isSqlite) {
    await dataSource.query(`PRAGMA foreign_keys = OFF`)
    await dataSource.synchronize()
    await dataSource.query(`PRAGMA foreign_keys = ON`)
  }

  return dataSource
}
