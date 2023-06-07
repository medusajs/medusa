import { EOL } from "os"

export const DatabaseErrorCode = {
  databaseDoesNotExist: "3D000",
  connectionFailure: "ECONNREFUSED",
  wrongCredentials: "28000",
  notFound: "ENOTFOUND",
  migrationMissing: "42P01",
}

export function handlePostgresDatabaseError(err: any): never {
  if (DatabaseErrorCode.databaseDoesNotExist === err.code) {
    throw new Error(
      `The specified PostgreSQL database does not exist. Please create it and try again.${EOL}${err.message}`
    )
  }

  if (DatabaseErrorCode.connectionFailure === err.code) {
    throw new Error(
      `Failed to establish a connection to PostgreSQL. Please ensure the following is true and try again:
      - You have a PostgreSQL database running
      - You have passed the correct credentials in medusa-config.js
      - You have formatted the database connection string correctly. See below:
      "postgres://[username]:[password]@[host]:[post]/[db_name]" - If there is no password, you can omit it from the connection string
      ${EOL}
      ${err.message}`
    )
  }

  if (DatabaseErrorCode.wrongCredentials === err.code) {
    throw new Error(
      `The specified credentials does not exists for the specified PostgreSQL database.${EOL}${err.message}`
    )
  }

  if (DatabaseErrorCode.notFound === err.code) {
    throw new Error(
      `The specified connection string for your PostgreSQL database might have illegal characters. Please check that it only contains allowed characters [a-zA-Z0-9]${EOL}${err.message}`
    )
  }

  if (DatabaseErrorCode.migrationMissing === err.code) {
    throw new Error(
      `Migrations missing. Please run 'medusa migrations run' and try again.`
    )
  }

  throw err
}
