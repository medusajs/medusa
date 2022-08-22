const path = require("path")
const { dropDatabase } = require("pg-god")

require("dotenv").config({ path: path.join(__dirname, ".env.test") })

if(typeof process.env.DB_TEMP_NAME === "undefined") {
  const tempName = [Date.now(), Math.floor(Math.random() * 9e2), parseInt(process.env.JEST_WORKER_ID || "1")].join("-")
  process.env.DB_TEMP_NAME = `medusa-integration-${tempName}`
}

const DB_HOST = process.env.DB_HOST
const DB_USERNAME = process.env.DB_USERNAME
const DB_PASSWORD = process.env.DB_PASSWORD

const pgGodCredentials = {
  user: DB_USERNAME,
  password: DB_PASSWORD,
  host: DB_HOST,
}

afterAll(async () => {
  await dropDatabase(
    { databaseName: process.env.DB_TEMP_NAME },
    pgGodCredentials
  )
})