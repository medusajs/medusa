import { InMemoryCacheService } from "../index"

jest.setTimeout(40000)

describe("InMemoryCacheService", () => {
  let inMemoryCache
  beforeAll(() => {
    jest.resetAllMocks()
  })

  it("Creates an `InMemoryCacheService`", () => {
    inMemoryCache = new InMemoryCacheService({}, { ttl: 10 })
  })

  it("Stores and retrieves data", async () => {
    inMemoryCache = new InMemoryCacheService({}, {})

    await inMemoryCache.set("cache-key", { data: "value" })

    expect(await inMemoryCache.get("cache-key")).toEqual({ data: "value" })
  })

  it("Invalidates data", async () => {
    inMemoryCache = new InMemoryCacheService({}, {})

    await inMemoryCache.set("cache-key", { data: "value" })

    await inMemoryCache.invalidate("cache-key")

    expect(await inMemoryCache.get("cache-key")).toEqual(null)
  })

  it("Removes data after TTL", async () => {
    inMemoryCache = new InMemoryCacheService({}, {})

    await inMemoryCache.set("cache-key", { data: "value" }, 2)
    expect(await inMemoryCache.get("cache-key")).toEqual({ data: "value" })

    await new Promise((res) => setTimeout(res, 3000))

    expect(await inMemoryCache.get("cache-key")).toEqual(null)
  })

  it("Removes data after default TTL if TTL params isn't passed", async () => {
    inMemoryCache = new InMemoryCacheService({}, { ttl: 1 })

    await inMemoryCache.set("cache-key", { data: "value" })
    expect(await inMemoryCache.get("cache-key")).toEqual({ data: "value" })

    await new Promise((res) => setTimeout(res, 2000))

    expect(await inMemoryCache.get("cache-key")).toEqual(null)
  })

  it("Removes data after TTL from the config if TTL params isn't passed", async () => {
    inMemoryCache = new InMemoryCacheService({}, { ttl: 1 })

    await inMemoryCache.set("cache-key", { data: "value" })
    expect(await inMemoryCache.get("cache-key")).toEqual({ data: "value" })

    await new Promise((res) => setTimeout(res, 2000))

    expect(await inMemoryCache.get("cache-key")).toEqual(null)
  })
})
