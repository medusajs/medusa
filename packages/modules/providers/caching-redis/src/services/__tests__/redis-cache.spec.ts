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

  hincrby(key: string, field: string, amount: number) {
    this.commands.push(() => this.redis.hincrbySync(key, field, amount))
    return this
  }

  hdel(key: string, field: string) {
    this.commands.push(() => this.redis.hdelSync(key, field))
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

  public readonly getBuffer = jest.fn(async (key: string) => {
    return this.getBufferSync(key)
  })

  setHash(key: string, fields: Record<string, RedisHashValue>) {
    this.hashes.set(key, new Map(Object.entries(fields)))
  }

  setString(key: string, value: RedisHashValue) {
    this.strings.set(key, value)
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

  hincrbySync(key: string, field: string, amount: number): number {
    const hash = this.hashes.get(key) ?? new Map<string, RedisHashValue>()
    const current = parseInt((hash.get(field) as string | undefined) ?? "0", 10)
    const nextValue = current + amount

    hash.set(field, nextValue.toString())
    this.hashes.set(key, hash)

    return nextValue
  }

  hdelSync(key: string, field: string): number {
    const hash = this.hashes.get(key)
    if (!hash?.has(field)) {
      return 0
    }

    hash.delete(field)

    if (!hash.size) {
      this.hashes.delete(key)
    }

    return 1
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

  getBufferSync(key: string): Buffer | null {
    const value = this.strings.get(key)

    if (value === undefined) {
      return null
    }

    return Buffer.isBuffer(value) ? value : Buffer.from(value)
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

const createTagIdBuffer = (...tagIds: number[]) => {
  const buffer = Buffer.alloc(tagIds.length * 4)

  tagIds.forEach((tagId, index) => {
    buffer.writeUInt32LE(tagId, index * 4)
  })

  return buffer
}

describe("RedisCachingProvider clear", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("clears tagged entries without falling back to a global KEYS scan", async () => {
    const redisClient = new FakeRedisClient()
    const provider = createProvider(redisClient)

    redisClient.setHash("mc:entry-1", {})
    redisClient.setHash("mc:tag:dictionary", { "hash:tag-a": "1" })
    redisClient.setHash("mc:tag:reverse_dict", { "1": "hash:tag-a" })
    redisClient.setHash("mc:tag:refs", { "1": "1" })
    redisClient.setString("mc:tags:entry-1", createTagIdBuffer(1))
    redisClient.setMembers("mc:tag:hash:tag-a", ["mc:entry-1"])

    await provider.clear({ tags: ["tag-a"] })

    expect(redisClient.keys).not.toHaveBeenCalled()
    expect(redisClient.hashes.has("mc:entry-1")).toBe(false)
    expect(redisClient.strings.has("mc:tags:entry-1")).toBe(false)
    expect(redisClient.sets.has("mc:tag:hash:tag-a")).toBe(false)
    expect(redisClient.hashes.has("mc:tag:dictionary")).toBe(false)
    expect(redisClient.hashes.has("mc:tag:reverse_dict")).toBe(false)
    expect(redisClient.hashes.has("mc:tag:refs")).toBe(false)
  })

  it("only deletes auto-invalidated entries without using KEYS", async () => {
    const redisClient = new FakeRedisClient()
    const provider = createProvider(redisClient)

    redisClient.setHash("mc:entry-1", {})
    redisClient.setHash("mc:entry-2", {
      options: JSON.stringify({ autoInvalidate: false }),
    })
    redisClient.setHash("mc:tag:dictionary", { "hash:tag-a": "1" })
    redisClient.setHash("mc:tag:reverse_dict", { "1": "hash:tag-a" })
    redisClient.setHash("mc:tag:refs", { "1": "2" })
    redisClient.setString("mc:tags:entry-1", createTagIdBuffer(1))
    redisClient.setString("mc:tags:entry-2", createTagIdBuffer(1))
    redisClient.setMembers("mc:tag:hash:tag-a", ["mc:entry-1", "mc:entry-2"])

    await provider.clear({
      tags: ["tag-a"],
      options: { autoInvalidate: true },
    })

    expect(redisClient.keys).not.toHaveBeenCalled()
    expect(redisClient.hashes.has("mc:entry-1")).toBe(false)
    expect(redisClient.strings.has("mc:tags:entry-1")).toBe(false)
    expect(redisClient.hashes.has("mc:entry-2")).toBe(true)
    expect(redisClient.strings.has("mc:tags:entry-2")).toBe(true)
    expect(redisClient.sets.get("mc:tag:hash:tag-a")).toEqual(
      new Set(["mc:entry-2"])
    )
    expect(redisClient.hashes.get("mc:tag:refs")?.get("1")).toBe("1")
    expect(redisClient.hashes.get("mc:tag:dictionary")?.get("hash:tag-a")).toBe(
      "1"
    )
    expect(redisClient.hashes.get("mc:tag:reverse_dict")?.get("1")).toBe(
      "hash:tag-a"
    )
  })
})
