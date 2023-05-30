import { resolve } from "path"
import { MikroORM, PostgreSqlDriver } from "@mikro-orm/postgresql"
import { TSMigrationGenerator } from "@mikro-orm/migrations"
import { ProductServiceInitializeOptions } from "../types"

export async function createConnection(
  database: ProductServiceInitializeOptions["database"],
  entities: any[]
) {
  const orm = await MikroORM.init<PostgreSqlDriver>({
    discovery: { disableDynamicFileAccess: true },
    entities,
    debug: process.env.NODE_ENV === "development",
    baseDir: process.cwd(),
    clientUrl: database.clientUrl,
    schema: database.schema ?? "public",
    driverOptions: database.driverOptions ?? {
      connection: { ssl: true },
    },
    tsNode: process.env.APP_ENV === "development",
    type: "postgresql",
    migrations: {
      path: resolve(__dirname, "../migrations"),
      pathTs: resolve(__dirname, "../migrations"),
      glob: "!(*.d).{js,ts}",
      silent: true,
      dropTables: true,
      transactional: true,
      allOrNothing: true,
      safe: false,
      generator: TSMigrationGenerator,
    },
  })

  return orm
}
