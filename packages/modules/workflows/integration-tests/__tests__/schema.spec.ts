import { MikroORM } from "@medusajs/framework/mikro-orm/postgresql"
import { ModulesSdkUtils } from "@medusajs/framework/utils"
import {
  createDatabase,
  dropDatabase,
  TestDatabaseUtils,
} from "@medusajs/test-utils"
import {
  fromKnex,
  PostgresStore,
  SqlClient,
} from "@medusajs/workflow-engine/postgres"
import { runStoreConformance } from "@medusajs/workflow-engine/testing"
import { join } from "path"

jest.setTimeout(60_000)

const MIGRATIONS = join(__dirname, "../../src/migrations")

type Connection = ReturnType<typeof ModulesSdkUtils.createPgConnection>

/**
 * A fresh database with only the module's migrations applied, the way a
 * Medusa app gets the engine's tables.
 */
async function migratedDatabase(label: string) {
  const name = `medusa-workflows-${label}-${
    process.env.JEST_WORKER_ID ?? 1
  }-${Date.now()}`
  const clientUrl = TestDatabaseUtils.getDatabaseURL(name)
  await createDatabase({ databaseName: name })

  const orm = await MikroORM.init({
    ...TestDatabaseUtils.getMikroOrmConfig({
      mikroOrmEntities: [],
      pathToMigrations: MIGRATIONS,
      clientUrl,
    }),
    discovery: { warnWhenNoEntities: false },
  })
  try {
    await orm.getMigrator().up()
  } finally {
    await orm.close()
  }

  return connect(name, clientUrl)
}

function connect(name: string, clientUrl: string) {
  const connection: Connection = ModulesSdkUtils.createPgConnection({
    clientUrl,
    schema: "public",
  })
  return {
    connection,
    client: fromKnex(connection) as SqlClient,
    async drop() {
      await connection.destroy()
      await dropDatabase({ databaseName: name })
    },
  }
}

let conformanceDb: Awaited<ReturnType<typeof migratedDatabase>>

runStoreConformance(
  "PostgresStore on the module migration",
  async () => {
    conformanceDb = await migratedDatabase("conformance")
    return { store: new PostgresStore({ client: conformanceDb.client }) }
  },
  () => conformanceDb.drop()
)
