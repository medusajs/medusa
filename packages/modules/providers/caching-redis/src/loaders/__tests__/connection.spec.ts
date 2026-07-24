import connectionLoader from "../connection"

const redisConstructorCalls: Array<{ url: string; options: any }> = []

jest.mock("ioredis", () => {
  class FakeRedis {
    constructor(url: string, options: any) {
      redisConstructorCalls.push({ url, options })
    }
    on() {
      return this
    }
    async ping() {
      return "PONG"
    }
  }

  return { __esModule: true, default: FakeRedis }
})

const redisUrl = "redis://localhost:6379"

const buildArgs = (options: Record<string, unknown>) => {
  const registered: Record<string, any> = {}

  return {
    registered,
    args: {
      container: {
        register: (toRegister: Record<string, any>) => {
          Object.assign(registered, toRegister)
        },
      },
      logger: { info: jest.fn(), warn: jest.fn() },
      options,
    } as any,
  }
}

describe("caching-redis connection loader", () => {
  beforeEach(() => {
    redisConstructorCalls.length = 0
  })

  it("forwards the `redisOptions` object to the ioredis client", async () => {
    const { args } = buildArgs({ redisUrl, redisOptions: { keepAlive: 10000 } })

    await connectionLoader(args)

    const { options } = redisConstructorCalls[0]
    expect(options.keepAlive).toEqual(10000)
    expect(options).not.toHaveProperty("redisOptions")
  })

  it("does not forward module options to the ioredis client", async () => {
    const { args } = buildArgs({
      redisUrl,
      ttl: 60,
      prefix: "custom:",
      compressionThreshold: 512,
      redisOptions: { keepAlive: 10000 },
    })

    await connectionLoader(args)

    const { options } = redisConstructorCalls[0]
    expect(options).not.toHaveProperty("ttl")
    expect(options).not.toHaveProperty("prefix")
    expect(options).not.toHaveProperty("compressionThreshold")
  })

  it("keeps the defaults that `redisOptions` does not override", async () => {
    const { args } = buildArgs({ redisUrl, redisOptions: { keepAlive: 10000 } })

    await connectionLoader(args)

    const { url, options } = redisConstructorCalls[0]
    expect(url).toEqual(redisUrl)
    expect(options).toEqual(
      expect.objectContaining({
        connectTimeout: 10000,
        commandTimeout: 5000,
        lazyConnect: true,
        maxRetriesPerRequest: 3,
        enableOfflineQueue: true,
        connectionName: "medusa-cache-redis",
      })
    )
  })

  it("lets `redisOptions` override a default", async () => {
    const { args } = buildArgs({
      redisUrl,
      redisOptions: { connectionName: "custom-connection" },
    })

    await connectionLoader(args)

    expect(redisConstructorCalls[0].options.connectionName).toEqual(
      "custom-connection"
    )
  })

  it("still supports top-level ioredis options, with a deprecation warning", async () => {
    const { args } = buildArgs({ redisUrl, keepAlive: 10000 })

    await connectionLoader(args)

    expect(redisConstructorCalls[0].options.keepAlive).toEqual(10000)
    expect(args.logger.warn).toHaveBeenCalledWith(
      expect.stringContaining("deprecated")
    )
  })

  it("does not warn when `redisOptions` is used", async () => {
    const { args } = buildArgs({ redisUrl, redisOptions: { keepAlive: 10000 } })

    await connectionLoader(args)

    expect(args.logger.warn).not.toHaveBeenCalledWith(
      expect.stringContaining("deprecated")
    )
  })

  it("prefers `redisOptions` over deprecated top-level options", async () => {
    const { args } = buildArgs({
      redisUrl,
      keepAlive: 1,
      redisOptions: { keepAlive: 10000 },
    })

    await connectionLoader(args)

    expect(redisConstructorCalls[0].options.keepAlive).toEqual(10000)
  })

  it("registers the configured prefix", async () => {
    const { registered, args } = buildArgs({ redisUrl, prefix: "custom:" })

    await connectionLoader(args)

    expect(registered.prefix.resolve()).toEqual("custom:")
  })

  it("throws when `redisUrl` is missing", async () => {
    const { args } = buildArgs({ redisOptions: { keepAlive: 10000 } })

    await expect(connectionLoader(args)).rejects.toThrow(
      "[caching-redis] redisUrl is required"
    )
  })
})
