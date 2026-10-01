const loadersMock = jest.fn()
const mockGracefulServer = { shutdown: jest.fn().mockResolvedValue(undefined) }

let listeningHandler: (() => void) | undefined

const mockServer = {
  on: jest.fn(function (this: any, event: string, handler: any) {
    if (event === "listening") {
      listeningHandler = handler
    }
    return this
  }),
}

const mockApp = {
  get: jest.fn(),
  listen: jest.fn(() => mockServer),
}

jest.mock("express", () => jest.fn(() => mockApp))

jest.mock("get-port", () => jest.fn().mockResolvedValue(4000))

jest.mock("@medusajs/framework/logger", () => ({
  logger: { error: jest.fn() },
}))

jest.mock("@medusajs/framework/utils", () => ({
  ...jest.requireActual("@medusajs/framework/utils"),
  GracefulShutdownServer: { create: jest.fn(() => mockGracefulServer) },
  promiseAll: (promises: Promise<any>[]) => Promise.all(promises),
}))

jest.mock(
  "@medusajs/medusa/loaders/index",
  () => ({
    default: (...args: any[]) => loadersMock(...args),
  }),
  { virtual: true }
)

import { startApp } from "../medusa-test-runner-utils/bootstrap-app"

const flushMicrotasks = () => new Promise((resolve) => setImmediate(resolve))

describe("startApp", () => {
  const ENV_KEY = "MEDUSA_TEST_UTILS_BOOTSTRAP_ENV"

  beforeEach(() => {
    jest.clearAllMocks()
    listeningHandler = undefined
  })

  afterEach(() => {
    delete process.env[ENV_KEY]
    delete process.env.PORT
  })

  it("restores previously applied env vars once the app is shut down", async () => {
    process.env[ENV_KEY] = "original"

    const mockShutdown = jest.fn().mockResolvedValue(undefined)
    loadersMock.mockResolvedValueOnce({
      container: {},
      shutdown: mockShutdown,
    })

    const startPromise = startApp({
      env: { [ENV_KEY]: "overridden", PORT: "4000" },
    })

    await flushMicrotasks()
    expect(listeningHandler).toBeDefined()
    expect(process.env[ENV_KEY]).toBe("overridden")

    listeningHandler!()
    const { shutdown } = await startPromise

    await shutdown()

    expect(process.env[ENV_KEY]).toBe("original")
  })

  it("restores previously applied env vars when bootstrapping fails", async () => {
    process.env[ENV_KEY] = "original"

    loadersMock.mockRejectedValueOnce(new Error("boom"))

    await expect(
      startApp({ env: { [ENV_KEY]: "overridden", PORT: "4000" } })
    ).rejects.toThrow("boom")

    expect(process.env[ENV_KEY]).toBe("original")
  })
})
