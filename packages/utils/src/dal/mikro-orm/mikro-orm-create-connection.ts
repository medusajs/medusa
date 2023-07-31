import { ModuleServiceInitializeOptions } from "@medusajs/types"

export async function mikroOrmCreateConnection(
  database: ModuleServiceInitializeOptions["database"],
  entities: any[]
) {
  const { MikroORM } = await import("@mikro-orm/postgresql")

  const schema = database.schema || "public"
  const orm = await MikroORM.init({
    discovery: { disableDynamicFileAccess: true },
    entities,
    debug: database.debug ?? process.env.NODE_ENV?.startsWith("dev") ?? false,
    baseDir: process.cwd(),
    clientUrl: database.clientUrl,
    schema,
    driverOptions: database.driverOptions ?? {
      connection: { ssl: true },
    },
    tsNode: process.env.APP_ENV === "development",
    type: "postgresql",
    migrations: {
      path: __dirname + "/../migrations",
    },
  })

  return orm
}
