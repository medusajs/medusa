import { MockManager } from "medusa-test-utils"

import { InMemoryCacheService } from "../index"

const loggerMock = {
  info: jest.fn().mockReturnValue(console.log),
  warn: jest.fn().mockReturnValue(console.log),
  error: jest.fn().mockReturnValue(console.log),
}

jest.setTimeout(40000)

describe("InMemoryCacheService", () => {
  let inMemoryCache
  beforeAll(() => {
    jest.resetAllMocks()
  })

  it("Creates an `InMemoryCacheService`", () => {
    inMemoryCache = new InMemoryCacheService(
      {
        manager: MockManager,
        logger: loggerMock,
      },
      {},
      { resources: "shared" }
    )
  })

  it("Throws on isolated module declaration", () => {
    try {
      inMemoryCache = new InMemoryCacheService(
        {
          manager: MockManager,
          logger: loggerMock,
        },
        {},
        { resources: "isolated" }
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
      {},
      { resources: "shared" }
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
      {},
      { resources: "shared" }
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
      {},
      { resources: "shared" }
    )

    await inMemoryCache.set("cache-key", { data: "value" }, 1000)
    expect(await inMemoryCache.get("cache-key")).toEqual({ data: "value" })

    await new Promise((res) => setTimeout(res, 1000))

    expect(await inMemoryCache.get("cache-key")).toEqual(null)
  })

  it("Removes data after default TTL if TTL params isn't passed", async () => {
    inMemoryCache = new InMemoryCacheService(
      {
        manager: MockManager,
        logger: loggerMock,
      },
      {},
      { resources: "shared" }
    )

    await inMemoryCache.set("cache-key", { data: "value" })
    expect(await inMemoryCache.get("cache-key")).toEqual({ data: "value" })

    await new Promise((res) => setTimeout(res, 32000))

    expect(await inMemoryCache.get("cache-key")).toEqual(null)
  })
})
