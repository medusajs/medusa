import { MikroORM, PostgreSqlDriver } from "@mikro-orm/postgresql"
import { ProductServiceInitializeOptions } from "../types"

export async function createConnection(
  database: ProductServiceInitializeOptions["database"],
  entities: any[]
) {
  const schema = database.schema || "public"
  const orm = await MikroORM.init<PostgreSqlDriver>({
    discovery: { disableDynamicFileAccess: true },
    entities,
    debug: process.env.NODE_ENV === "development",
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
