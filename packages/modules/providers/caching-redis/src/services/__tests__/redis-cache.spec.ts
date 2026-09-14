import { Logger } from "@medusajs/framework/types"
import { RedisCachingProvider } from "../redis-cache"

type RedisHashValue = string | Buffer

class FakePipeline {
  private readonly commands: Array<() => unknown> = []

  constructor(private readonly redis: FakeRedisClient) {}

  smembers(key: string) {
    this.commands.push(() => this.redis.smembersSync(key))
    return this
  }

  hget(key: string, field: string) {
    this.commands.push(() => this.redis.hgetSync(key, field))
    return this
  }

  srem(key: string, member: string) {
    this.commands.push(() => this.redis.sremSync(key, member))
    return this
  }

  unlink(...keys: string[]) {
    this.commands.push(() => this.redis.unlinkSync(...keys))
    return this
  }

  exec = jest.fn(async () => {
    return this.commands.map((command) => [null, command()] as [null, unknown])
  })
}

class FakeRedisClient {
  public status = "ready"
  public readonly hashes = new Map<string, Map<string, RedisHashValue>>()
  public readonly strings = new Map<string, RedisHashValue>()
  public readonly sets = new Map<string, Set<string>>()

  public readonly keys = jest.fn(() => {
    throw new Error("KEYS should not be called")
  })

  public readonly pipeline = jest.fn(() => new FakePipeline(this))

  public readonly smembers = jest.fn(async (key: string) => {
    return this.smembersSync(key)
  })

  public readonly unlink = jest.fn(async (...keys: string[]) => {
    return this.unlinkSync(...keys)
  })

  setHash(key: string, fields: Record<string, RedisHashValue>) {
    this.hashes.set(key, new Map(Object.entries(fields)))
  }

  setMembers(key: string, members: string[]) {
    this.sets.set(key, new Set(members))
  }

  smembersSync(key: string): string[] {
    return Array.from(this.sets.get(key) ?? [])
  }

  hgetSync(key: string, field: string): RedisHashValue | null {
    return this.hashes.get(key)?.get(field) ?? null
  }

  sremSync(key: string, member: string): number {
    const set = this.sets.get(key)
    if (!set?.has(member)) {
      return 0
    }

    set.delete(member)

    if (!set.size) {
      this.sets.delete(key)
    }

    return 1
  }

  unlinkSync(...keys: string[]): number {
    let deleted = 0

    keys.forEach((key) => {
      const removed =
        this.hashes.delete(key) ||
        this.strings.delete(key) ||
        this.sets.delete(key)

      deleted += removed ? 1 : 0
    })

    return deleted
  }
}

const loggerMock = {
  warn: jest.fn(),
  info: jest.fn(),
  error: jest.fn(),
  debug: jest.fn(),
} as unknown as Logger

const createProvider = (redisClient: FakeRedisClient) => {
  return new RedisCachingProvider({
    redisClient: redisClient as any,
    prefix: "mc:",
    hasher: (key) => `hash:${key}`,
    logger: loggerMock,
  })
}

describe("RedisCachingProvider clear", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("clears tagged entries without falling back to a global KEYS scan", async () => {
    const redisClient = new FakeRedisClient()
    const provider = createProvider(redisClient)

    redisClient.setHash("mc:entry-1", {})
    redisClient.setMembers("mc:tags:entry-1", ["hash:tag-a"])
    redisClient.setMembers("mc:tag:hash:tag-a", ["mc:entry-1"])

    await provider.clear({ tags: ["tag-a"] })

    expect(redisClient.keys).not.toHaveBeenCalled()
    expect(redisClient.hashes.has("mc:entry-1")).toBe(false)
    expect(redisClient.sets.has("mc:tags:entry-1")).toBe(false)
    expect(redisClient.sets.has("mc:tag:hash:tag-a")).toBe(false)
  })

  it("only deletes auto-invalidated entries without using KEYS", async () => {
    const redisClient = new FakeRedisClient()
    const provider = createProvider(redisClient)

    redisClient.setHash("mc:entry-1", {})
    redisClient.setHash("mc:entry-2", {
      options: JSON.stringify({ autoInvalidate: false }),
    })
    redisClient.setMembers("mc:tags:entry-1", ["hash:tag-a"])
    redisClient.setMembers("mc:tags:entry-2", ["hash:tag-a"])
    redisClient.setMembers("mc:tag:hash:tag-a", ["mc:entry-1", "mc:entry-2"])

    await provider.clear({
      tags: ["tag-a"],
      options: { autoInvalidate: true },
    })

    expect(redisClient.keys).not.toHaveBeenCalled()
    expect(redisClient.hashes.has("mc:entry-1")).toBe(false)
    expect(redisClient.sets.has("mc:tags:entry-1")).toBe(false)
    expect(redisClient.hashes.has("mc:entry-2")).toBe(true)
    expect(redisClient.sets.get("mc:tags:entry-2")).toEqual(
      new Set(["hash:tag-a"])
    )
    expect(redisClient.sets.get("mc:tag:hash:tag-a")).toEqual(
      new Set(["mc:entry-2"])
    )
  })

  it("clears by key using the reverse tag index", async () => {
    const redisClient = new FakeRedisClient()
    const provider = createProvider(redisClient)

    redisClient.setHash("mc:entry-1", {})
    redisClient.setMembers("mc:tags:entry-1", ["hash:tag-a", "hash:tag-b"])
    redisClient.setMembers("mc:tag:hash:tag-a", ["mc:entry-1", "mc:entry-2"])
    redisClient.setMembers("mc:tag:hash:tag-b", ["mc:entry-1"])

    await provider.clear({ key: "entry-1" })

    expect(redisClient.hashes.has("mc:entry-1")).toBe(false)
    expect(redisClient.sets.has("mc:tags:entry-1")).toBe(false)
    expect(redisClient.sets.get("mc:tag:hash:tag-a")).toEqual(
      new Set(["mc:entry-2"])
    )
    expect(redisClient.sets.has("mc:tag:hash:tag-b")).toBe(false)
  })

  it("removes tag indexes before deleting entries", async () => {
    const redisClient = new FakeRedisClient()
    const provider = createProvider(redisClient)

    redisClient.setHash("mc:entry-1", {})
    redisClient.setMembers("mc:tags:entry-1", ["hash:tag-a"])
    redisClient.setMembers("mc:tag:hash:tag-a", ["mc:entry-1"])

    const events: string[] = []
    const originalSrem = redisClient.sremSync.bind(redisClient)
    const originalUnlink = redisClient.unlinkSync.bind(redisClient)

    redisClient.sremSync = ((key: string, member: string) => {
      events.push(`srem:${member}`)
      return originalSrem(key, member)
    }) as typeof redisClient.sremSync

    redisClient.unlinkSync = ((...keys: string[]) => {
      events.push(`unlink:${keys.join(",")}`)
      return originalUnlink(...keys)
    }) as typeof redisClient.unlinkSync

    await provider.clear({ key: "entry-1" })

    const sremIdx = events.findIndex((event) => event === "srem:mc:entry-1")
    const reverseUnlinkIdx = events.findIndex((event) =>
      event.includes("mc:tags:entry-1")
    )
    const entryUnlinkIdx = events.findIndex(
      (event) => event === "unlink:mc:entry-1"
    )

    expect(sremIdx).toBeGreaterThanOrEqual(0)
    expect(reverseUnlinkIdx).toBeGreaterThan(sremIdx)
    expect(entryUnlinkIdx).toBeGreaterThan(reverseUnlinkIdx)
  })
})
