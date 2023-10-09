import { dropDatabase } from "pg-god"

export function afterAllHookDropDatabase() {
  const DB_HOST = process.env.DB_HOST ?? "localhost"
  const DB_USERNAME = process.env.DB_USERNAME ?? "postgres"
  const DB_PASSWORD = process.env.DB_PASSWORD ?? ""
  const DB_NAME = process.env.DB_TEMP_NAME || ""

  const pgGodCredentials = {
    user: DB_USERNAME,
    password: DB_PASSWORD,
    host: DB_HOST,
  }

  afterAll(async () => {
    try {
      await dropDatabase({ databaseName: DB_NAME }, pgGodCredentials)
    } catch (e) {
      console.error(
        `This might fail if it is run during the unit tests since there is no database to drop. Otherwise, please check what is the issue. ${e.message}`
      )
    }
  })
}
