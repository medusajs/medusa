import { resolve } from "path"
import { MikroORM, PostgreSqlDriver } from "@mikro-orm/postgresql"
import { ProductServiceInitializeOptions } from "../types"
import { TSMigrationGenerator } from "@mikro-orm/migrations"

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
      path: resolve(__dirname, "../../dist/migrations"),
      pathTs: resolve(__dirname, "../../src/migrations"),
      glob: "!(*.d).{js,ts}",
      disableForeignKeys: false,
      silent: false,
      dropTables: false,
      transactional: true,
      allOrNothing: true,
      safe: true,
      generator: TSMigrationGenerator,
    },
  })

  return orm
}
