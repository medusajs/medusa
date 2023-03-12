import { InMemoryCacheService } from "../index"

jest.setTimeout(40000)

describe("InMemoryCacheService", () => {
  let inMemoryCache

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("Stores and retrieves data", async () => {
    inMemoryCache = new InMemoryCacheService({}, {})

    await inMemoryCache.set("cache-key", { data: "value" })

    expect(await inMemoryCache.get("cache-key")).toEqual({ data: "value" })
  })

  it("Invalidates single record", async () => {
    inMemoryCache = new InMemoryCacheService({}, {})

    await inMemoryCache.set("cache-key", { data: "value" })

    await inMemoryCache.invalidate("cache-key")

    expect(await inMemoryCache.get("cache-key")).toEqual(null)
  })

  it("Invalidates multiple keys with wildcard (end matching)", async () => {
    inMemoryCache = new InMemoryCacheService({}, {})

    await inMemoryCache.set("cache-key:id_1:x:y", { data: "value" })
    await inMemoryCache.set("cache-key:id_2:x:y", { data: "value" })
    await inMemoryCache.set("cache-key:id_3:x:y", { data: "value" })
    await inMemoryCache.set("cache-key-old", { data: "value" })

    await inMemoryCache.invalidate("cache-key:*")

    expect(await inMemoryCache.get("cache-key:id1:x:y")).toEqual(null)
    expect(await inMemoryCache.get("cache-key:id2:x:y")).toEqual(null)
    expect(await inMemoryCache.get("cache-key:id3:x:y")).toEqual(null)
    expect(await inMemoryCache.get("cache-key-old")).toEqual({ data: "value" })
  })

  it("Invalidates multiple keys with wildcard (middle matching)", async () => {
    inMemoryCache = new InMemoryCacheService({}, {})

    await inMemoryCache.set("cache-key:1:new", { data: "value" })
    await inMemoryCache.set("cache-key:2:new", { data: "value" })
    await inMemoryCache.set("cache-key:3:new", { data: "value" })
    await inMemoryCache.set("cache-key:4:old", { data: "value" })

    await inMemoryCache.invalidate("cache-key:*:new")

    expect(await inMemoryCache.get("cache-key:1:new")).toEqual(null)
    expect(await inMemoryCache.get("cache-key:2:new")).toEqual(null)
    expect(await inMemoryCache.get("cache-key:3:new")).toEqual(null)
    expect(await inMemoryCache.get("cache-key:4:old")).toEqual({
      data: "value",
    })
  })

  it("Removes data after TTL", async () => {
    inMemoryCache = new InMemoryCacheService({}, {})

    await inMemoryCache.set("cache-key", { data: "value" }, 2)
    expect(await inMemoryCache.get("cache-key")).toEqual({ data: "value" })

    await new Promise((res) => setTimeout(res, 3000))

    expect(await inMemoryCache.get("cache-key")).toEqual(null)
  })

  it("Removes data after default TTL if TTL params isn't passed", async () => {
    inMemoryCache = new InMemoryCacheService({})

    await inMemoryCache.set("cache-key", { data: "value" })
    expect(await inMemoryCache.get("cache-key")).toEqual({ data: "value" })

    await new Promise((res) => setTimeout(res, 33000))

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
