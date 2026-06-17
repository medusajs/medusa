import { EventEmitter } from "events"

jest.mock("@medusajs/utils", () => {
  const actual = jest.requireActual("@medusajs/utils")
  return {
    ...actual,
    ModulesSdkUtils: {
      ...actual.ModulesSdkUtils,
      createPgConnection: jest.fn(),
    },
  }
})
jest.mock("../../config", () => ({
  configManager: {
    config: {
      projectConfig: {
        databaseUrl: "postgres://user:pass@127.0.0.1:1/medusa",
        databaseDriverOptions: {},
        databaseSchema: "public",
      },
    },
  },
}))
jest.mock("../../container", () => ({
  container: {
    hasRegistration: jest.fn(() => false),
    resolve: jest.fn(),
    register: jest.fn(),
  },
}))
jest.mock("../../logger", () => ({
  logger: { warn: jest.fn(), error: jest.fn() },
}))
jest.mock("../../deps/awilix", () => ({ asValue: (value: any) => value }))

import { ModulesSdkUtils } from "@medusajs/utils"
import { container } from "../../container"
import { logger } from "../../logger"
import { pgConnectionLoader } from "../pg-connection-loader"

const mockContainer = container as unknown as {
  hasRegistration: jest.Mock
  resolve: jest.Mock
  register: jest.Mock
}
const mockLogger = logger as unknown as { warn: jest.Mock; error: jest.Mock }
const mockCreatePgConnection =
  ModulesSdkUtils.createPgConnection as unknown as jest.Mock

/**
 * Builds a fake knex connection whose pool can emit `createFail` events and
 * whose `raw("SELECT 1")` rejects — mirroring the masked behavior caused by
 * `propagateCreateError: false`, where the real driver error surfaces on the
 * pool's `createFail` event while `raw` only sees a KnexTimeoutError.
 */
function buildFakeConnection({
  realError,
  rawError,
}: {
  realError?: Error
  rawError: Error
}) {
  const pool = new EventEmitter()
  const raw = jest.fn(async () => {
    if (realError) {
      pool.emit("createFail", "event-id", realError)
    }
    throw rawError
  })
  return { client: { pool }, raw }
}

const timeoutError = () =>
  Object.assign(
    new Error(
      "Knex: Timeout acquiring a connection. The pool is probably full."
    ),
    { name: "KnexTimeoutError" }
  )

describe("pgConnectionLoader", () => {
  const ORIGINAL_ENV = { ...process.env }

  beforeEach(() => {
    jest.clearAllMocks()
    mockContainer.hasRegistration.mockReturnValue(false)
    // Keep the test fast and deterministic.
    process.env.__MEDUSA_DB_CONNECTION_MAX_RETRIES = "2"
    process.env.__MEDUSA_DB_CONNECTION_RETRY_DELAY = "0"
  })

  afterEach(() => {
    process.env = { ...ORIGINAL_ENV }
  })

  it("rethrows the real connection error (not the masked KnexTimeoutError) once retries are exhausted", async () => {
    const realError = Object.assign(new Error("connect ECONNREFUSED"), {
      code: "ECONNREFUSED",
    })
    mockCreatePgConnection.mockReturnValue(
      buildFakeConnection({ realError, rawError: timeoutError() })
    )

    await expect(pgConnectionLoader()).rejects.toMatchObject({
      code: "ECONNREFUSED",
      message: "Failed to connect to the database: connect ECONNREFUSED",
    })
    expect(mockContainer.register).not.toHaveBeenCalled()
  })

  it("logs the real cause and demotes the pool-reported message on each retry", async () => {
    const realError = Object.assign(new Error("connect ECONNREFUSED"), {
      code: "ECONNREFUSED",
    })
    mockCreatePgConnection.mockReturnValue(
      buildFakeConnection({ realError, rawError: timeoutError() })
    )

    await expect(pgConnectionLoader()).rejects.toBeDefined()

    expect(mockLogger.warn).toHaveBeenCalledTimes(1)
    const warning = mockLogger.warn.mock.calls[0][0] as string
    expect(warning).toContain("ECONNREFUSED")
    expect(warning).toContain("(pool reported: Knex: Timeout acquiring")
  })

  it("falls back to the raw error when no createFail was emitted", async () => {
    const rawError = timeoutError()
    mockCreatePgConnection.mockReturnValue(buildFakeConnection({ rawError }))

    await expect(pgConnectionLoader()).rejects.toBe(rawError)
    // The original error is untouched (no "Failed to connect" prefix).
    expect(rawError.message).toBe(
      "Knex: Timeout acquiring a connection. The pool is probably full."
    )
  })

  it("registers and returns the connection on success", async () => {
    const connection = {
      client: { pool: new EventEmitter() },
      raw: jest.fn(async () => undefined),
    }
    mockCreatePgConnection.mockReturnValue(connection)

    const result = await pgConnectionLoader()

    expect(result).toBe(connection)
    expect(connection.raw).toHaveBeenCalledWith("SELECT 1")
    expect(mockContainer.register).toHaveBeenCalledTimes(1)
  })

  it("returns the already-registered connection without reconnecting", async () => {
    const existing = { client: {}, raw: jest.fn() }
    mockContainer.hasRegistration.mockReturnValue(true)
    mockContainer.resolve.mockReturnValue(existing)

    const result = await pgConnectionLoader()

    expect(result).toBe(existing)
    expect(mockCreatePgConnection).not.toHaveBeenCalled()
  })
})
