import path from "path"
import { Connection, createConnection } from "typeorm"
import dbFactory from "../__fixtures__/use-template-db"
import { dropDatabase } from "pg-god"

jest.setTimeout(1000000)

const DB_HOST = "localhost"
const DB_USERNAME = "postgres"
const DB_PASSWORD = ""
const DB_NAME = "medusa-integration-1"
const DB_URL = `postgres://${DB_USERNAME}:${DB_PASSWORD}@${DB_HOST}/${DB_NAME}`

const pgGodCredentials = {
  user: DB_USERNAME,
  password: DB_PASSWORD,
  host: DB_HOST,
}

async function initDb(): Promise<Connection> {
  const modelsLoader = require("../../loaders/models").default

  const entities = modelsLoader({}, { register: false, isTest: true })

  await dbFactory.createFromTemplate(DB_NAME)

  const migrationDir = path.resolve(
    path.join(__dirname, `..`, `..`, `migrations`, `*.ts`)
  )

  const { getEnabledMigrations } = require(path.join(
    __dirname,
    `..`,
    `..`,
    `commands`,
    `utils`,
    `get-migrations`
  ))

  const enabledMigrations = await getEnabledMigrations(
    [migrationDir],
    () => false
  )

  const enabledEntities = entities.filter(
    (e) => typeof e.isFeatureEnabled === "undefined" || e.isFeatureEnabled()
  )

  return await createConnection({
    type: "postgres",
    url: DB_URL,
    migrationsRun: true,
    entities: enabledEntities,
    migrations: enabledMigrations,
  })
}

describe("DbTransactionService", function () {
  let dbConnection

  beforeAll(async () => {
    dbConnection = await initDb().catch((e) => {
      console.log(e)
    })
  })

  afterAll(async () => {
    return await dropDatabase({ databaseName: DB_NAME }, pgGodCredentials)
  })

  it("should have a db connection established", () => {
    expect(dbConnection).toBeDefined()
  })
})
