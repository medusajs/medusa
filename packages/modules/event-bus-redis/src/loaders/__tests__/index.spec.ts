import { Logger } from "@medusajs/framework/types"
import loader from "../index"

let connectError: Error | undefined

jest.mock("ioredis", () => {
  return jest.fn().mockImplementation(() => ({
    connect: jest.fn((callback) => {
      if (callback) callback(connectError ?? null)
      return connectError ? Promise.reject(connectError) : Promise.resolve()
    }),
    disconnect: jest.fn(),
  }))
})

const loggerMock = {
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
  debug: jest.fn(),
} as unknown as Logger

describe("Redis Event Bus loader", () => {
  let containerMock: { register: jest.Mock }

  beforeEach(() => {
    jest.clearAllMocks()
    connectError = undefined
    containerMock = {
      register: jest.fn(),
    }
  })

  it("should log that the connection is established when connect succeeds", async () => {
    await loader({
      container: containerMock as any,
      logger: loggerMock,
      options: { redisUrl: "redis://localhost:6379" },
    } as any)

    expect(loggerMock.info).toHaveBeenCalledWith(
      "Connection to Redis in module 'event-bus-redis' established"
    )
    expect(loggerMock.error).not.toHaveBeenCalled()
  })

  it("should log the connection error and not raise an unhandled rejection when connect fails", async () => {
    connectError = new Error("Connection is closed.")
    const unhandled = jest.fn()
    process.on("unhandledRejection", unhandled)

    try {
      await loader({
        container: containerMock as any,
        logger: loggerMock,
        options: { redisUrl: "redis://localhost:6379" },
      } as any)
      await new Promise((resolve) => setImmediate(resolve))
    } finally {
      process.off("unhandledRejection", unhandled)
    }

    expect(unhandled).not.toHaveBeenCalled()
    expect(loggerMock.info).not.toHaveBeenCalled()
    expect(loggerMock.error).toHaveBeenCalledWith(
      expect.stringContaining(
        "An error occurred while connecting to Redis in module 'event-bus-redis'"
      )
    )

    const registerCall = containerMock.register.mock.calls[0][0]
    expect(registerCall.eventBusRedisConnection.resolve()).toBeDefined()
  })
})
