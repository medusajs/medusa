const path = require("path")
const { dropDatabase } = require("pg-god")
const dbFactory = require("./helpers/use-template-db")

require("dotenv").config({ path: path.join(__dirname, ".env") })

const DB_USERNAME = process.env.DB_USERNAME || "postgres"
const DB_PASSWORD = process.env.DB_PASSWORD || ""

const pgGodCredentials = {
  user: DB_USERNAME,
  password: DB_PASSWORD,
}

beforeAll(async () => {
  await dbFactory.createTemplateDb_({ cwd: path.resolve(".") })
})

afterAll(async () => {
  await dbFactory.destroy()
  const workerId = parseInt(process.env.JEST_WORKER_ID || "1")
  await dropDatabase(
    { databaseName: `medusa-integration-${workerId}` },
    pgGodCredentials
  )
})
