const path = require("path")
const { dropDatabase } = require("pg-god")

require("dotenv").config({ path: path.join(__dirname, ".env") })

const DB_USERNAME = process.env.DB_USERNAME || "postgres"
const DB_PASSWORD = process.env.DB_PASSWORD || ""

const pgGodCredentials = {
  user: DB_USERNAME,
  password: DB_PASSWORD,
}

afterAll(() => {
  dropDatabase({ databaseName: "medusa-integration" }, pgGodCredentials)
})
