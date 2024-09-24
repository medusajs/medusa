import { createDatabase, dropDatabase } from "pg-god"

const DB_HOST = process.env.DB_HOST
const DB_USERNAME = process.env.DB_USERNAME ?? ""
const DB_PASSWORD = process.env.DB_PASSWORD ?? ""

const pgGodCredentials = {
  user: DB_USERNAME,
  password: DB_PASSWORD,
  host: DB_HOST,
}

export async function createDb(dbName: string) {
  await createDatabase(
    { databaseName: dbName, errorIfExist: false },
    pgGodCredentials
  )
}

export async function dropDb(dbName: string) {
  await dropDatabase(
    { databaseName: dbName, errorIfNonExist: false },
    pgGodCredentials
  )
}
