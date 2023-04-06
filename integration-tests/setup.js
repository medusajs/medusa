const { dropDatabase } = require("pg-god")

const DB_HOST = process.env.DB_HOST
const DB_USERNAME = process.env.DB_USERNAME
const DB_PASSWORD = process.env.DB_PASSWORD
const DB_NAME = process.env.DB_TEMP_NAME

const pgGodCredentials = {
  user: DB_USERNAME,
  password: DB_PASSWORD,
  host: DB_HOST,
}

afterAll(async () => {
  await dropDatabase({ databaseName: DB_NAME }, pgGodCredentials)
})
