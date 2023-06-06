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
      `The connection cannot be established to the specified PostgreSQL database. Please, check the following point.
      - Is the database running?
      - Is the database url correct?
      - Is the database port correct?
      Please, also verify that your medusa-config.js database_url is correctly formatted. It should be in the following format:
      postgres://user:password@host:post/db_name - If there is no password, you can omit it.
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
      `The specified connection url for your PostgreSQL database might contains illegal characters. Please check that all the connection segments contains only allowed characters [a-zA-Z0-9]${EOL}${err.message}`
    )
  }

  if (DatabaseErrorCode.migrationMissing === err.code) {
    throw new Error(
      `Migrations missing. Please run 'medusa migrations run' and try again.`
    )
  }

  throw err
}
