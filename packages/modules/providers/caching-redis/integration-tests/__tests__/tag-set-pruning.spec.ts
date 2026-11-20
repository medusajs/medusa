import { Logger } from "@medusajs/framework/types"
import Redis from "ioredis"
import { RedisCachingProvider } from "../../src/services/redis-cache"

jest.setTimeout(30000)

const PREFIX = "mc-test-pruning:"
const TAG = "Product:list:*"
const TAG_KEY = `${PREFIX}tag:${TAG}`

describe("RedisCachingProvider tag set pruning", () => {
  let redis: Redis
  let provider: RedisCachingProvider

  beforeAll(async () => {
    redis = new Redis("localhost:6379")
    provider = new RedisCachingProvider({
      redisClient: redis,
      prefix: PREFIX,
      hasher: (value) => value,
      logger: console as unknown as Logger,
    })
  })

  afterEach(async () => {
    await provider.flush()
  })

  afterAll(async () => {
    await redis.quit()
  })

  /**
   * What Redis leaves behind once an entry's TTL (and, 60s later, its reverse
   * index TTL) has elapsed: the key is still a member of the tag set.
   */
  const expireEntries = async (keys: string[]) => {
    await redis.unlink(
      ...keys.flatMap((key) => [`${PREFIX}${key}`, `${PREFIX}tags:${key}`])
    )
  }

  const seedExpiredEntries = async (count: number) => {
    const keys = Array.from({ length: count }, (_, i) => `dead-${i}`)
    await Promise.all(
      keys.map((key) => provider.set({ key, data: { key }, tags: [TAG] }))
    )
    await expireEntries(keys)
  }

  it("removes expired entries from the tag set on an auto-invalidation clear", async () => {
    await seedExpiredEntries(200)
    expect(await redis.scard(TAG_KEY)).toBe(200)

    await provider.clear({ tags: [TAG], options: { autoInvalidate: true } })

    expect(await redis.scard(TAG_KEY)).toBe(0)
  })

  it("removes expired entries from the tag set on an explicit clear", async () => {
    await seedExpiredEntries(200)

    await provider.clear({ tags: [TAG] })

    expect(await redis.scard(TAG_KEY)).toBe(0)
  })

  it("keeps live entries that opted out of auto-invalidation indexed", async () => {
    await seedExpiredEntries(50)
    await provider.set({
      key: "kept",
      data: { id: "kept" },
      tags: [TAG],
      options: { autoInvalidate: false },
    })
    await provider.set({ key: "live", data: { id: "live" }, tags: [TAG] })

    await provider.clear({ tags: [TAG], options: { autoInvalidate: true } })

    expect(await redis.smembers(TAG_KEY)).toEqual([`${PREFIX}kept`])
    expect(await provider.get({ key: "kept" })).toEqual({ id: "kept" })
    expect(await provider.get({ key: "live" })).toBeNull()

    // Still reachable by an explicit tag clear
    await provider.clear({ tags: [TAG] })
    expect(await provider.get({ key: "kept" })).toBeNull()
  })
})
