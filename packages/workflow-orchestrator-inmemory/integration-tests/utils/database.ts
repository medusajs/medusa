import * as process from "process"

const DB_HOST = process.env.DB_HOST ?? "localhost"
const DB_USERNAME = process.env.DB_USERNAME ?? ""
const DB_PASSWORD = process.env.DB_PASSWORD
const DB_NAME = process.env.DB_TEMP_NAME

export const DB_URL = `postgres://${DB_USERNAME}${
  DB_PASSWORD ? `:${DB_PASSWORD}` : ""
}@${DB_HOST}/${DB_NAME}`

interface TestDatabase {
  setupDatabase(knex): Promise<void>
}

export const TestDatabase: TestDatabase = {
  setupDatabase: async (knex) => {
    try {
      // Disconnect any existing connections to the test database
      await knex.raw(
        `SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname = '${DB_NAME}'`
      )

      await knex.raw(`DROP DATABASE IF EXISTS "${DB_NAME}"`)

      await knex.raw(`CREATE DATABASE "${DB_NAME}"`)
    } catch (error) {
      console.error("Error recreating database:", error)
    } finally {
      await knex.destroy()
    }
  },
}
