import * as process from "process"

const DB_HOST = process.env.DB_HOST ?? "localhost"
const DB_USERNAME = process.env.DB_USERNAME ?? ""
const DB_PASSWORD = process.env.DB_PASSWORD
const DB_NAME = process.env.DB_TEMP_NAME

export const DB_URL = `postgres://${DB_USERNAME}${
  DB_PASSWORD ? `:${DB_PASSWORD}` : ""
}@${DB_HOST}/${DB_NAME}`

interface TestDatabase {
  clearTables(knex): Promise<void>
}

export const TestDatabase: TestDatabase = {
  clearTables: async (knex) => {
    await knex.raw(`
      TRUNCATE TABLE workflow_execution CASCADE;
    `)
  },
}
