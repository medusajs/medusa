import {
  DatabaseErrorCode,
  handlePostgresDatabaseError,
} from "../handle-postgres-database-error"
import { EOL } from "os"

describe("handlePostgresDataError", function () {
  it("should throw a specific message on database does not exists", function () {
    const error = new Error("database does not exist")
    Object.assign(error, { code: DatabaseErrorCode.databaseDoesNotExist })

    let outputError: any
    try {
      handlePostgresDatabaseError(error)
    } catch (e) {
      outputError = e
    }

    expect(outputError.message).toEqual(
      `The specified PostgreSQL database does not exist. Please create it and try again.${EOL}${error.message}`
    )
  })

  it("should throw a specific message on database connection failure", function () {
    const error = new Error("database does not exist")
    Object.assign(error, { code: DatabaseErrorCode.connectionFailure })

    let outputError: any
    try {
      handlePostgresDatabaseError(error)
    } catch (e) {
      outputError = e
    }

    expect(outputError.message).toEqual(
      `Failed to establish a connection to PostgreSQL. Please ensure the following is true and try again:
      - You have a PostgreSQL database running
      - You have passed the correct credentials in medusa-config.js
      - You have formatted the database connection string correctly. See below:
      "postgres://[username]:[password]@[host]:[post]/[db_name]" - If there is no password, you can omit it from the connection string
      ${EOL}
      ${error.message}`
    )
  })

  it("should throw a specific message on database wrong credentials", function () {
    const error = new Error("database does not exist")
    Object.assign(error, { code: DatabaseErrorCode.wrongCredentials })

    let outputError: any
    try {
      handlePostgresDatabaseError(error)
    } catch (e) {
      outputError = e
    }

    expect(outputError.message).toEqual(
      `The specified credentials does not exists for the specified PostgreSQL database.${EOL}${error.message}`
    )
  })

  it("should throw a specific message on database not found", function () {
    const error = new Error("database does not exist")
    Object.assign(error, { code: DatabaseErrorCode.notFound })

    let outputError: any
    try {
      handlePostgresDatabaseError(error)
    } catch (e) {
      outputError = e
    }

    expect(outputError.message).toEqual(
      `The specified connection string for your PostgreSQL database might have illegal characters. Please check that it only contains allowed characters [a-zA-Z0-9]${EOL}${error.message}`
    )
  })

  it("should throw a specific message on database migration missing", function () {
    const error = new Error("database does not exist")
    Object.assign(error, { code: DatabaseErrorCode.migrationMissing })

    let outputError: any
    try {
      handlePostgresDatabaseError(error)
    } catch (e) {
      outputError = e
    }

    expect(outputError.message).toEqual(
      `Migrations missing. Please run 'medusa migrations run' and try again.`
    )
  })

  it("should re throw unhandled error code", function () {
    const error = new Error("database does not exist")
    Object.assign(error, { code: "test" })

    let outputError: any
    try {
      handlePostgresDatabaseError(error)
    } catch (e) {
      outputError = e
    }

    expect(outputError.message).toEqual("database does not exist")
  })
})
