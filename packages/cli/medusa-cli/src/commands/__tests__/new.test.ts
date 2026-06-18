const mockQuery = jest.fn()
const mockEnd = jest.fn()

jest.mock("@medusajs/deps/pg", () => ({
  Pool: jest.fn(() => ({ query: mockQuery, end: mockEnd })),
}))

jest.mock("@medusajs/telemetry", () => ({ track: jest.fn() }))

jest.mock("@medusajs/utils", () => ({
  getNodeVersion: jest.fn(() => 20),
  MIN_SUPPORTED_NODE_VERSION: 20,
}))

jest.mock("../../reporter", () => ({
  __esModule: true,
  default: {
    activity: jest.fn(() => "db-activity"),
    success: jest.fn(),
    failure: jest.fn(),
    warn: jest.fn(),
    info: jest.fn(),
    error: jest.fn(),
    panic: jest.fn(),
  },
}))

import { Pool } from "@medusajs/deps/pg"
import reporter from "../../reporter"
import { createDatabase, setupDB } from "../new"

const credentials = {
  user: "postgres",
  database: "postgres",
  password: "",
  port: 5432,
  host: "localhost",
}

const pgError = (code: string, message = "pg error") =>
  Object.assign(new Error(message), { code })

describe("medusa new - database setup", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe("createDatabase", () => {
    it("connects with the given credentials and issues CREATE DATABASE", async () => {
      mockQuery.mockResolvedValueOnce({})

      await createDatabase("medusa-db-abc12", credentials)

      expect(Pool).toHaveBeenCalledWith(credentials)
      expect(mockQuery).toHaveBeenCalledWith(`CREATE DATABASE "medusa-db-abc12"`)
      expect(mockEnd).toHaveBeenCalledTimes(1)
    })

    it("closes the pool even when the query fails", async () => {
      mockQuery.mockRejectedValueOnce(pgError("28P01", "auth failed"))

      await expect(
        createDatabase("medusa-db-abc12", credentials)
      ).rejects.toThrow("auth failed")
      expect(mockEnd).toHaveBeenCalledTimes(1)
    })
  })

  describe("setupDB", () => {
    it("reports success when the database is created", async () => {
      mockQuery.mockResolvedValueOnce({})

      await setupDB("medusa-db-abc12", credentials)

      expect(reporter.success).toHaveBeenCalledWith(
        "db-activity",
        `Created database "medusa-db-abc12"`
      )
      expect(reporter.failure).not.toHaveBeenCalled()
    })

    it("treats Postgres error 42P04 as 'already exists' and still succeeds", async () => {
      mockQuery.mockRejectedValueOnce(pgError("42P04", "database already exists"))

      await setupDB("medusa-db-abc12", credentials)

      expect(reporter.success).toHaveBeenCalledWith(
        "db-activity",
        `Database medusa-db-abc12 already exists; skipping setup`
      )
      expect(reporter.failure).not.toHaveBeenCalled()
    })

    it("reports a failure for any other error", async () => {
      const errorSpy = jest.spyOn(console, "error").mockImplementation(() => {})
      mockQuery.mockRejectedValueOnce(pgError("ECONNREFUSED", "connection refused"))

      await setupDB("medusa-db-abc12", credentials)

      expect(reporter.failure).toHaveBeenCalledWith(
        "db-activity",
        `Skipping database setup.`
      )
      expect(reporter.warn).toHaveBeenCalledTimes(1)
      expect(reporter.success).not.toHaveBeenCalled()
      expect(errorSpy).toHaveBeenCalledTimes(1)

      errorSpy.mockRestore()
    })
  })
})
