import { MikroORM, PostgreSqlDriver } from "@mikro-orm/postgresql"
import { ModuleServiceInitializeOptions } from "@medusajs/types"

export async function createConnection(
  database: ModuleServiceInitializeOptions["database"] & { connection?: any },
  entities: any[]
) {
  const schema = database.schema || "public"

  let driverOptions = database.driverOptions ?? {
    connection: { ssl: true },
  }

  if (database.connection) {
    // Reuse already existing connection
    driverOptions = database.connection
  }

  return await MikroORM.init<PostgreSqlDriver>({
    discovery: { disableDynamicFileAccess: true },
    entities,
    debug: database.debug ?? process.env.NODE_ENV?.startsWith("dev") ?? false,
    baseDir: process.cwd(),
    clientUrl: database.clientUrl,
    schema,
    driverOptions: driverOptions,
    tsNode: process.env.APP_ENV === "development",
    type: "postgresql",
    migrations: {
      path: __dirname + "/../migrations",
    },
  })
}
