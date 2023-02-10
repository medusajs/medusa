import { InMemoryCacheService } from "../index"

jest.setTimeout(40000)

describe("InMemoryCacheService", () => {
  let inMemoryCache
  beforeAll(() => {
    jest.resetAllMocks()
  })

  it("Creates an `InMemoryCacheService`", () => {
    inMemoryCache = new InMemoryCacheService(
      {},
      { defaultTTL: 10 },
      { resources: "shared" }
    )
  })

  it("Throws on isolated module declaration", () => {
    try {
      inMemoryCache = new InMemoryCacheService(
        {},
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
    inMemoryCache = new InMemoryCacheService({}, {}, { resources: "shared" })

    await inMemoryCache.set("cache-key", { data: "value" })

    expect(await inMemoryCache.get("cache-key")).toEqual({ data: "value" })
  })

  it("Invalidates data", async () => {
    inMemoryCache = new InMemoryCacheService({}, {}, { resources: "shared" })

    await inMemoryCache.set("cache-key", { data: "value" })

    await inMemoryCache.invalidate("cache-key")

    expect(await inMemoryCache.get("cache-key")).toEqual(null)
  })

  it("Removes data after TTL", async () => {
    inMemoryCache = new InMemoryCacheService({}, {}, { resources: "shared" })

    await inMemoryCache.set("cache-key", { data: "value" }, 2)
    expect(await inMemoryCache.get("cache-key")).toEqual({ data: "value" })

    await new Promise((res) => setTimeout(res, 3000))

    expect(await inMemoryCache.get("cache-key")).toEqual(null)
  })

  it("Removes data after default TTL if TTL params isn't passed", async () => {
    inMemoryCache = new InMemoryCacheService({}, {}, { resources: "shared" })

    await inMemoryCache.set("cache-key", { data: "value" })
    expect(await inMemoryCache.get("cache-key")).toEqual({ data: "value" })

    await new Promise((res) => setTimeout(res, 32000))

    expect(await inMemoryCache.get("cache-key")).toEqual(null)
  })

  it("Removes data after TTL from the config if TTL params isn't passed", async () => {
    inMemoryCache = new InMemoryCacheService(
      {},
      { defaultTTL: 10 },
      { resources: "shared" }
    )

    await inMemoryCache.set("cache-key", { data: "value" })
    expect(await inMemoryCache.get("cache-key")).toEqual({ data: "value" })

    await new Promise((res) => setTimeout(res, 11000))

    expect(await inMemoryCache.get("cache-key")).toEqual(null)
  })
})
