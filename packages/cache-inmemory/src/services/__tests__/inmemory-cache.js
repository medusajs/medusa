import { MockManager } from "medusa-test-utils"

import { InMemoryCacheService } from "../index"

const loggerMock = {
  info: jest.fn().mockReturnValue(console.log),
  warn: jest.fn().mockReturnValue(console.log),
  error: jest.fn().mockReturnValue(console.log),
}

describe("InMemoryCacheService", () => {
  let inMemoryCache
  beforeAll(() => {
    jest.resetAllMocks()
  })

  it("Creates a InMemoryCacheService", () => {
    inMemoryCache = new InMemoryCacheService(
      {
        manager: MockManager,
        logger: loggerMock,
      },
      {
        // redisUrl: "test-url",
      },
      {
        resources: "shared",
      }
    )
  })

  it("Throws on isolated module declaration", () => {
    try {
      inMemoryCache = new InMemoryCacheService(
        {
          manager: MockManager,
          logger: loggerMock,
        },
        {
          // redisUrl: "test-url",
        },
        {
          resources: "isolated",
        }
      )
    } catch (error) {
      expect(error.message).toEqual(
        "At the moment this module can only be used with shared resources"
      )
    }
  })

  it("Stores and retrieves data", async () => {
    inMemoryCache = new InMemoryCacheService(
      {
        manager: MockManager,
        logger: loggerMock,
      },
      {
        // redisUrl: "test-url",
      },
      {
        resources: "shared",
      }
    )

    await inMemoryCache.set("cache-key", { data: "value" })

    expect(await inMemoryCache.get("cache-key")).toEqual({ data: "value" })
  })

  it("Invalidates data", async () => {
    inMemoryCache = new InMemoryCacheService(
      {
        manager: MockManager,
        logger: loggerMock,
      },
      {
        // redisUrl: "test-url",
      },
      {
        resources: "shared",
      }
    )

    await inMemoryCache.set("cache-key", { data: "value" })

    await inMemoryCache.invalidate("cache-key")

    expect(await inMemoryCache.get("cache-key")).toEqual(null)
  })

  it("Removes data after TTL", async () => {
    inMemoryCache = new InMemoryCacheService(
      {
        manager: MockManager,
        logger: loggerMock,
      },
      {
        // redisUrl: "test-url",
      },
      {
        resources: "shared",
      }
    )

    await inMemoryCache.set("cache-key", { data: "value" }, 1000)
    expect(await inMemoryCache.get("cache-key")).toEqual({ data: "value" })

    await new Promise((res) => setTimeout(res, 1000))

    expect(await inMemoryCache.get("cache-key")).toEqual(null)
  })
})
