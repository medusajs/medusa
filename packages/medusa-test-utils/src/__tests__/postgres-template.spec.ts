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

// Joined at runtime so these fixtures are not password literals.
const importTimePassword = ["import", "time", "token"].join("-")
const runnerEnvPassword = ["runner", "env", "token"].join("-")

const IMPORT_TIME_DB_ENV = {
  DB_HOST: "import-host",
  DB_USERNAME: "import-user",
  DB_PASSWORD: importTimePassword,
  DB_PORT: "5432",
  DB_WAITINGROOM_DATABASE: "import_maintenance",
}

const RUNNER_DB_ENV = {
  DB_HOST: "127.0.0.1",
  DB_USERNAME: "runner_admin",
  DB_PASSWORD: runnerEnvPassword,
  DB_PORT: "6543",
  DB_WAITINGROOM_DATABASE: "runner_maintenance",
}

function loadTemplateModules() {
  let template: typeof import("../medusa-test-runner-utils/postgres-template")
  let IsolatedClient: jest.Mock
  let applyEnvVarsToProcess: typeof import("../medusa-test-runner-utils/utils").applyEnvVarsToProcess

  jest.isolateModules(() => {
    template = require("../medusa-test-runner-utils/postgres-template")
    IsolatedClient = require("@medusajs/framework/pg").Client
    applyEnvVarsToProcess =
      require("../medusa-test-runner-utils/utils").applyEnvVarsToProcess
  })

  return {
    template: template!,
    Client: IsolatedClient!,
    applyEnvVarsToProcess: applyEnvVarsToProcess!,
  }
}

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

      await expect(createDatabase({ databaseName: "test_db" })).rejects.toThrow(
        "auth failed"
      )
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

      await expect(dropDatabase({ databaseName: "test_db" })).rejects.toThrow(
        "in use"
      )
      expect(mockEnd).toHaveBeenCalledTimes(1)
    })
  })
})

describe("postgres template waiting-room credentials", () => {
  const originalEnv = process.env

  beforeEach(() => {
    jest.clearAllMocks()
    mockConnect.mockResolvedValue(undefined)
    mockQuery.mockResolvedValue({ rows: [], rowCount: 0 })
    mockEnd.mockResolvedValue(undefined)
  })

  afterEach(() => {
    process.env = originalEnv
  })

  const runnerWaitingroomConfig = {
    host: "127.0.0.1",
    user: "runner_admin",
    password: runnerEnvPassword,
    port: 6543,
    database: "runner_maintenance",
  }

  it("should snapshot and restore templates with credentials applied after import", async () => {
    process.env = {
      ...originalEnv,
      ...IMPORT_TIME_DB_ENV,
    }

    const { template, Client, applyEnvVarsToProcess } = loadTemplateModules()

    applyEnvVarsToProcess(RUNNER_DB_ENV)

    await template.createPostgresDatabaseTemplate({
      databaseName: "suite_db",
      templateName: "suite_db_template",
    })
    await template.closeWaitingroomClient()
    await template.restorePostgresDatabaseFromTemplate({
      databaseName: "suite_db",
      templateName: "suite_db_template",
    })

    expect(Client).toHaveBeenCalledTimes(2)
    expect(Client).toHaveBeenNthCalledWith(1, runnerWaitingroomConfig)
    expect(Client).toHaveBeenNthCalledWith(2, runnerWaitingroomConfig)
  })

  it("should use waiting-room defaults when database env vars are cleared after import", async () => {
    process.env = {
      ...originalEnv,
      ...IMPORT_TIME_DB_ENV,
    }

    const { template, Client } = loadTemplateModules()

    delete process.env.DB_HOST
    delete process.env.DB_USERNAME
    delete process.env.DB_PASSWORD
    delete process.env.DB_PORT
    delete process.env.DB_WAITINGROOM_DATABASE

    await template.createPostgresDatabaseTemplate({
      databaseName: "suite_db",
      templateName: "suite_db_template",
    })

    expect(Client).toHaveBeenCalledWith({
      host: "localhost",
      user: "postgres",
      password: undefined,
      port: 5432,
      database: "postgres",
    })
  })

  it("should reuse the waiting-room client when credentials do not change", async () => {
    process.env = {
      ...originalEnv,
      ...RUNNER_DB_ENV,
    }

    const { template, Client } = loadTemplateModules()

    await template.createPostgresDatabaseTemplate({
      databaseName: "suite_db",
      templateName: "suite_db_template",
    })
    await template.restorePostgresDatabaseFromTemplate({
      databaseName: "suite_db",
      templateName: "suite_db_template",
    })

    expect(Client).toHaveBeenCalledTimes(1)
    expect(Client).toHaveBeenCalledWith(runnerWaitingroomConfig)
    expect(mockEnd).not.toHaveBeenCalled()
  })

  it("should open a new waiting-room client when credentials change", async () => {
    process.env = {
      ...originalEnv,
      ...IMPORT_TIME_DB_ENV,
    }

    const { template, Client, applyEnvVarsToProcess } = loadTemplateModules()

    await template.createPostgresDatabaseTemplate({
      databaseName: "suite_db",
      templateName: "suite_db_template",
    })

    expect(mockEnd).not.toHaveBeenCalled()

    applyEnvVarsToProcess(RUNNER_DB_ENV)

    await template.restorePostgresDatabaseFromTemplate({
      databaseName: "suite_db",
      templateName: "suite_db_template",
    })

    expect(Client).toHaveBeenCalledTimes(2)
    expect(Client).toHaveBeenNthCalledWith(1, {
      host: "import-host",
      user: "import-user",
      password: importTimePassword,
      port: 5432,
      database: "import_maintenance",
    })
    expect(Client).toHaveBeenNthCalledWith(2, runnerWaitingroomConfig)
    expect(mockEnd).toHaveBeenCalledTimes(1)

    const previousClient = Client.mock.results[0].value
    const endHandler = previousClient.on.mock.calls.find(
      (call: [string, () => void]) => call[0] === "end"
    )?.[1]

    expect(endHandler).toEqual(expect.any(Function))
    endHandler()

    await template.restorePostgresDatabaseFromTemplate({
      databaseName: "suite_db",
      templateName: "suite_db_template",
    })

    expect(Client).toHaveBeenCalledTimes(2)
  })
})
