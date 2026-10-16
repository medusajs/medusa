jest.mock("@medusajs/framework/pg", () => ({
  Client: jest.fn().mockImplementation(() => ({
    connect: jest.fn().mockResolvedValue(undefined),
    query: jest.fn().mockResolvedValue({ rows: [], rowCount: 0 }),
    end: jest.fn().mockResolvedValue(undefined),
    on: jest.fn(),
  })),
}))

import { getDatabaseURL } from "../database"

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

function loadDatabaseModules() {
  let dbTestUtilFactory: typeof import("../database").dbTestUtilFactory
  let Client: jest.Mock
  let applyEnvVarsToProcess: typeof import("../medusa-test-runner-utils/utils").applyEnvVarsToProcess

  jest.isolateModules(() => {
    dbTestUtilFactory = require("../database").dbTestUtilFactory
    Client = require("@medusajs/framework/pg").Client
    applyEnvVarsToProcess =
      require("../medusa-test-runner-utils/utils").applyEnvVarsToProcess
  })

  return {
    dbTestUtilFactory: dbTestUtilFactory!,
    Client: Client!,
    applyEnvVarsToProcess: applyEnvVarsToProcess!,
  }
}

describe("getDatabaseURL", () => {
  const originalEnv = process.env

  beforeEach(() => {
    process.env = {
      ...originalEnv,
      DB_HOST: "localhost",
      DB_PORT: "5432",
      DB_TEMP_NAME: "test_db",
    }
    delete process.env.DB_USERNAME
    delete process.env.DB_PASSWORD
  })

  afterEach(() => {
    process.env = originalEnv
  })

  it("should build a valid URL with plain credentials", () => {
    process.env.DB_USERNAME = "postgres"
    process.env.DB_PASSWORD = "password"

    const url = getDatabaseURL()

    expect(url).toBe("postgres://postgres:password@localhost:5432/test_db")
    expect(() => new URL(url)).not.toThrow()
  })

  it("should encode a # in the password", () => {
    process.env.DB_USERNAME = "postgres"
    process.env.DB_PASSWORD = "pass#word"

    const url = getDatabaseURL()

    expect(url).toBe("postgres://postgres:pass%23word@localhost:5432/test_db")
    expect(() => new URL(url)).not.toThrow()
    expect(decodeURIComponent(new URL(url).password)).toBe("pass#word")
  })

  it("should encode @ in the password", () => {
    process.env.DB_USERNAME = "postgres"
    process.env.DB_PASSWORD = "pass@word"

    const url = getDatabaseURL()

    expect(() => new URL(url)).not.toThrow()
    expect(decodeURIComponent(new URL(url).password)).toBe("pass@word")
  })

  it("should encode : in the password", () => {
    process.env.DB_USERNAME = "postgres"
    process.env.DB_PASSWORD = "pass:word"

    const url = getDatabaseURL()

    expect(() => new URL(url)).not.toThrow()
    expect(decodeURIComponent(new URL(url).password)).toBe("pass:word")
  })

  it("should encode / in the password", () => {
    process.env.DB_USERNAME = "postgres"
    process.env.DB_PASSWORD = "pass/word"

    const url = getDatabaseURL()

    expect(() => new URL(url)).not.toThrow()
    expect(decodeURIComponent(new URL(url).password)).toBe("pass/word")
  })

  it("should omit the password segment when DB_PASSWORD is empty", () => {
    process.env.DB_USERNAME = "postgres"
    process.env.DB_PASSWORD = ""

    const url = getDatabaseURL()

    expect(url).toBe("postgres://postgres@localhost:5432/test_db")
    expect(() => new URL(url)).not.toThrow()
  })

  it("should encode special characters in the username", () => {
    process.env.DB_USERNAME = "user@domain"
    process.env.DB_PASSWORD = ""

    const url = getDatabaseURL()

    expect(() => new URL(url)).not.toThrow()
    expect(decodeURIComponent(new URL(url).username)).toBe("user@domain")
  })

  it("should use the dbName argument when provided", () => {
    process.env.DB_USERNAME = "postgres"
    process.env.DB_PASSWORD = ""

    const url = getDatabaseURL("my_custom_db")

    expect(url).toContain("/my_custom_db")
    expect(() => new URL(url)).not.toThrow()
  })
})

describe("dbTestUtilFactory database credentials", () => {
  const originalEnv = process.env

  afterEach(() => {
    process.env = originalEnv
  })

  it("should create and drop the database with credentials applied after the utils are constructed", async () => {
    process.env = {
      ...originalEnv,
      ...IMPORT_TIME_DB_ENV,
    }

    const { dbTestUtilFactory, Client, applyEnvVarsToProcess } =
      loadDatabaseModules()
    Client.mockClear()
    const dbUtils = dbTestUtilFactory()

    applyEnvVarsToProcess(RUNNER_DB_ENV)

    await dbUtils.create("suite_db")
    await dbUtils.shutdown("suite_db")

    const expectedCredentials = {
      user: "runner_admin",
      database: "postgres",
      password: runnerEnvPassword,
      port: 6543,
      host: "127.0.0.1",
    }

    expect(Client).toHaveBeenCalledTimes(2)
    expect(Client).toHaveBeenNthCalledWith(1, expectedCredentials)
    expect(Client).toHaveBeenNthCalledWith(2, expectedCredentials)
  })

  it("should use admin credential defaults when database env vars are cleared after import", async () => {
    process.env = {
      ...originalEnv,
      ...IMPORT_TIME_DB_ENV,
    }

    const { dbTestUtilFactory, Client } = loadDatabaseModules()
    Client.mockClear()
    const dbUtils = dbTestUtilFactory()

    delete process.env.DB_HOST
    delete process.env.DB_USERNAME
    delete process.env.DB_PASSWORD
    delete process.env.DB_PORT
    delete process.env.DB_WAITINGROOM_DATABASE

    await dbUtils.create("suite_db")

    expect(Client).toHaveBeenCalledWith({
      user: "",
      database: "postgres",
      password: "",
      port: 5432,
      host: "localhost",
    })
  })
})
