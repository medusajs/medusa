import { fromPg, PostgresStore } from "../../src/store/postgres"
import { runStoreConformance } from "../../src/store/conformance"
import { createTestDatabase } from "../utils/database"

jest.setTimeout(30_000)

let database: Awaited<ReturnType<typeof createTestDatabase>>

runStoreConformance(
  "PostgresStore (pg)",
  async () => {
    database = await createTestDatabase()
    return { store: new PostgresStore({ client: fromPg(database.pool) }) }
  },
  () => database.drop()
)
