import { ModuleServiceInitializeOptions } from "@medusajs/types"

export async function mikroOrmCreateConnection(
  database: ModuleServiceInitializeOptions["database"] & { connection?: any },
  entities: any[],
  pathToMigrations: string
) {
  let schema = database.schema || "public"

  let driverOptions = database.driverOptions ?? {
    connection: { ssl: true },
  }

  let clientUrl = database.clientUrl

  if (database.connection) {
    // Reuse already existing connection
    // It is important that the knex package version is the same as the one used by MikroORM knex package
    driverOptions = database.connection
    clientUrl =
      database.connection.context.client.config.connection.connectionString
    schema = database.connection.context.client.config.searchPath
  }

  const { MikroORM } = await import("@mikro-orm/postgresql")
  return await MikroORM.init({
    discovery: { disableDynamicFileAccess: true },
    entities,
    debug: database.debug ?? process.env.NODE_ENV?.startsWith("dev") ?? false,
    baseDir: process.cwd(),
    clientUrl,
    schema,
    driverOptions,
    tsNode: process.env.APP_ENV === "development",
    type: "postgresql",
    migrations: {
      path: pathToMigrations,
    },
    pool: database.pool as any,
  })
}
