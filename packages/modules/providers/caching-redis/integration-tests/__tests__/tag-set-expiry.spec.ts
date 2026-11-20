import { Logger } from "@medusajs/framework/types"
import Redis from "ioredis"
import { RedisCachingProvider } from "../../src/services/redis-cache"

jest.setTimeout(30000)

const PREFIX = "mc-test-expiry:"
const TAG = "Product:list:*"
const TAG_KEY = `${PREFIX}tag:${TAG}`

describe("RedisCachingProvider tag set expiry", () => {
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

  it("expires the tag set 60s after its entry", async () => {
    await provider.set({ key: "a", data: {}, ttl: 100, tags: [TAG] })

    const ttl = await redis.ttl(TAG_KEY)
    expect(ttl).toBeGreaterThan(100)
    expect(ttl).toBeLessThanOrEqual(160)
  })

  it("does not shorten the tag set when a shorter-lived entry is added", async () => {
    await provider.set({ key: "long", data: {}, ttl: 3600, tags: [TAG] })
    await provider.set({ key: "short", data: {}, ttl: 1, tags: [TAG] })

    // The set must outlive the long entry, or a tag clear can no longer find it
    expect(await redis.ttl(TAG_KEY)).toBeGreaterThan(3600)
  })

  it("extends the tag set when a longer-lived entry is added", async () => {
    await provider.set({ key: "short", data: {}, ttl: 1, tags: [TAG] })
    await provider.set({ key: "long", data: {}, ttl: 3600, tags: [TAG] })

    expect(await redis.ttl(TAG_KEY)).toBeGreaterThan(3600)
  })

  it("keeps the tag set without expiry while it indexes an entry without TTL", async () => {
    await provider.set({ key: "forever", data: {}, ttl: 0, tags: [TAG] })
    await provider.set({ key: "short", data: {}, ttl: 1, tags: [TAG] })
    expect(await redis.ttl(TAG_KEY)).toBe(-1)

    await provider.flush()

    await provider.set({ key: "short", data: {}, ttl: 1, tags: [TAG] })
    await provider.set({ key: "forever", data: {}, ttl: 0, tags: [TAG] })
    expect(await redis.ttl(TAG_KEY)).toBe(-1)
  })

  it("invalidates a long-lived entry by tag after a shorter-lived one was added", async () => {
    await provider.set({
      key: "long",
      data: { v: "old" },
      ttl: 3600,
      tags: [TAG],
    })
    await provider.set({ key: "short", data: {}, ttl: 1, tags: [TAG] })

    // Fast-forward to when the tag set would have expired with the short TTL
    const remaining = await redis.ttl(TAG_KEY)
    if (remaining <= 61) {
      await redis.unlink(TAG_KEY)
    }

    await provider.clear({ tags: [TAG], options: { autoInvalidate: true } })

    expect(await provider.get({ key: "long" })).toBeNull()
  })
})
