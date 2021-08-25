const path = require("path")

const setupServer = require("../helpers/setup-server")
const { useApi } = require("../helpers/use-api")
const { useDb, initDb } = require("../helpers/use-db")

const fixtureWriter = require("./utils/write-fixture").default

require("dotenv").config({
  path: path.resolve(path.join(__dirname, "..", ".env")),
})

const DB_USERNAME = process.env.DB_USERNAME || "postgres"
const DB_PASSWORD = process.env.DB_PASSWORD || ""

const pgGodCredentials = {
  user: DB_USERNAME,
  password: DB_PASSWORD,
}

const { dropDatabase } = require("pg-god")

let medusaProcess
beforeEach(async () => {
  const cwd = path.resolve(__dirname)
  await initDb({ cwd })
  medusaProcess = await setupServer({ cwd })
})

afterEach(async () => {
  const db = useDb()
  await db.shutdown()

  dropDatabase({ databaseName: "medusa-integration" }, pgGodCredentials)

  medusaProcess.kill()
})

afterAll(async () => {
  await fixtureWriter.execute()
})
