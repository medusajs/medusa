const mockConnect = jest.fn()
const mockQuery = jest.fn()
const mockEnd = jest.fn()

jest.mock("@medusajs/framework/pg", () => ({
  Client: jest.fn(() => ({
    connect: mockConnect,
    query: mockQuery,
    end: mockEnd,
    on: jest.fn(),
  })),
}))

import { Client } from "@medusajs/framework/pg"
import {
  createDatabase,
  dropDatabase,
} from "../medusa-test-runner-utils/postgres-template"

const pgError = (code: string, message = "pg error") =>
  Object.assign(new Error(message), { code })

describe("test-utils database management (pg-god replacement)", () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockConnect.mockResolvedValue(undefined)
    mockEnd.mockResolvedValue(undefined)
    mockQuery.mockResolvedValue({ rows: [], rowCount: 0 })
  })

  describe("createDatabase", () => {
    it("connects and issues a quoted CREATE DATABASE, then closes the client", async () => {
      await createDatabase({ databaseName: "test_db" })

      expect(mockConnect).toHaveBeenCalledTimes(1)
      expect(mockQuery).toHaveBeenCalledWith(`CREATE DATABASE "test_db";`)
      expect(mockEnd).toHaveBeenCalledTimes(1)
    })

    it("merges the provided credentials over the defaults", async () => {
      await createDatabase(
        { databaseName: "test_db" },
        { user: "tester", host: "db.example.com", port: 5433 }
      )

      expect(Client).toHaveBeenCalledWith({
        user: "tester",
        database: "postgres",
        password: "",
        port: 5433,
        host: "db.example.com",
      })
    })

    it("treats an already existing database as success when errorIfExist is false", async () => {
      mockQuery.mockRejectedValueOnce(pgError("42P04", "already exists"))

      await expect(
        createDatabase({ databaseName: "test_db" })
      ).resolves.toBeUndefined()
      expect(mockEnd).toHaveBeenCalledTimes(1)
    })

    it("rethrows the duplicate-database error when errorIfExist is true", async () => {
      mockQuery.mockRejectedValueOnce(pgError("42P04", "already exists"))

      await expect(
        createDatabase({ databaseName: "test_db", errorIfExist: true })
      ).rejects.toThrow("already exists")
      expect(mockEnd).toHaveBeenCalledTimes(1)
    })

    it("rethrows unexpected errors and still closes the client", async () => {
      mockQuery.mockRejectedValueOnce(pgError("28P01", "auth failed"))

      await expect(
        createDatabase({ databaseName: "test_db" })
      ).rejects.toThrow("auth failed")
      expect(mockEnd).toHaveBeenCalledTimes(1)
    })
  })

  describe("dropDatabase", () => {
    it("terminates connections before issuing a quoted DROP DATABASE, then closes the client", async () => {
      await dropDatabase({ databaseName: "test_db" })

      const queries = mockQuery.mock.calls.map((c) => String(c[0]))
      const terminateIdx = queries.findIndex((q) =>
        q.includes("pg_terminate_backend")
      )
      const dropIdx = queries.findIndex((q) =>
        q.includes(`DROP DATABASE "test_db";`)
      )

      expect(terminateIdx).toBeGreaterThanOrEqual(0)
      expect(dropIdx).toBeGreaterThan(terminateIdx)
      expect(mockEnd).toHaveBeenCalledTimes(1)
    })

    it("skips terminating connections when dropConnections is false", async () => {
      await dropDatabase({ databaseName: "test_db", dropConnections: false })

      const terminated = mockQuery.mock.calls.some((c) =>
        String(c[0]).includes("pg_terminate_backend")
      )

      expect(terminated).toBe(false)
      expect(mockQuery).toHaveBeenCalledWith(`DROP DATABASE "test_db";`)
    })

    it("treats a missing database as success when errorIfNonExist is false", async () => {
      mockQuery.mockResolvedValueOnce({ rows: [], rowCount: 0 }) // terminate
      mockQuery.mockRejectedValueOnce(pgError("3D000", "does not exist")) // drop

      await expect(
        dropDatabase({ databaseName: "test_db" })
      ).resolves.toBeUndefined()
      expect(mockEnd).toHaveBeenCalledTimes(1)
    })

    it("rethrows the missing-database error when errorIfNonExist is true", async () => {
      mockQuery.mockResolvedValueOnce({ rows: [], rowCount: 0 }) // terminate
      mockQuery.mockRejectedValueOnce(pgError("3D000", "does not exist")) // drop

      await expect(
        dropDatabase({ databaseName: "test_db", errorIfNonExist: true })
      ).rejects.toThrow("does not exist")
      expect(mockEnd).toHaveBeenCalledTimes(1)
    })

    it("rethrows unexpected errors and still closes the client", async () => {
      mockQuery.mockResolvedValueOnce({ rows: [], rowCount: 0 }) // terminate
      mockQuery.mockRejectedValueOnce(pgError("55006", "in use")) // drop

      await expect(
        dropDatabase({ databaseName: "test_db" })
      ).rejects.toThrow("in use")
      expect(mockEnd).toHaveBeenCalledTimes(1)
    })
  })
})
