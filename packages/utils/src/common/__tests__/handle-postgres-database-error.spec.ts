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
      `The connection cannot be established to the specified PostgreSQL database. Please, check the following point.
      - Is the database running?
      - Is the database url correct?
      - Is the database port correct?
      Please, also verify that your medusa-config.js database_url is correctly formatted. It should be in the following format:
      postgres://user:password@host:post/db_name - If there is no password, you can omit it.
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
    Object.assign(error, { code: DatabaseErrorCode.wrongCredentials })

    let outputError: any
    try {
      handlePostgresDatabaseError(error)
    } catch (e) {
      outputError = e
    }

    expect(outputError.message).toEqual(
      `The specified connection url for your PostgreSQL database might contains illegal characters. Please check that all the connection segments contains only allowed characters [a-zA-Z0-9]${EOL}${error.message}`
    )
  })

  it("should throw a specific message on database migration missing", function () {
    const error = new Error("database does not exist")
    Object.assign(error, { code: DatabaseErrorCode.wrongCredentials })

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
