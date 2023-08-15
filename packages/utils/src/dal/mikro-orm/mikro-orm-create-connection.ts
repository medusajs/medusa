import { ModuleServiceInitializeOptions } from "@medusajs/types"

export async function mikroOrmCreateConnection(
  database: ModuleServiceInitializeOptions["database"] & { connection?: any },
  entities: any[], 
  context: {dirname?: string } = {}
) {
  let schema = database.schema || "public"

  let driverOptions = database.driverOptions ?? {
    connection: { ssl: true },
  }

  const dirname = context.dirname ?? __dirname
  let clientUrl = database.clientUrl

  if (database.connection) {
    // Reuse already existing connection
    // It is important that the knex package version is the same as the one used by MikroORM knex package
    driverOptions = database.connection
    clientUrl =
      database.connection.context.client.config.connection.connectionString
    schema = database.connection.context.client.config.searchPath
  }

  console.log(dirname)
  console.log(dirname + "/../migrations")

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
      path: dirname + "/../migrations",
    },
  })
}
