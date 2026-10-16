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

  exists(key: string) {
    this.commands.push(() => this.redis.existsSync(key))
    return this
  }

  srem(key: string, ...members: string[]) {
    this.commands.push(() => this.redis.sremSync(key, ...members))
    return this
  }

  unlink(...keys: string[]) {
    this.commands.push(() => this.redis.unlinkSync(...keys))
    return this
  }

  exec = jest.fn(async () => {
    this.redis.pipelineSizes.push(this.commands.length)
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

  /** Number of commands in each pipeline that was executed. */
  public readonly pipelineSizes: number[] = []

  public readonly smembers = jest.fn(async (key: string) => {
    return this.smembersSync(key)
  })

  public readonly unlink = jest.fn(async (...keys: string[]) => {
    return this.unlinkSync(...keys)
  })

  public readonly srem = jest.fn(async (key: string, ...members: string[]) => {
    return this.sremSync(key, ...members)
  })

  /**
   * Mirrors the guarantees the provider relies on: a cursor-driven walk that
   * returns at most `COUNT` members per call, over a snapshot of the members
   * taken when the walk started, so removals during the walk are safe.
   */
  public readonly sscan = jest.fn(
    async (key: string, cursor: string, _countOpt: string, count: number) => {
      const snapshot = this.scanSnapshots.get(key) ?? [
        ...(this.sets.get(key) ?? []),
      ]

      const offset = Number(cursor)
      const slice = snapshot.slice(offset, offset + count)
      const nextOffset = offset + count

      if (nextOffset >= snapshot.length) {
        this.scanSnapshots.delete(key)
        return ["0", slice] as [string, string[]]
      }

      this.scanSnapshots.set(key, snapshot)
      return [String(nextOffset), slice] as [string, string[]]
    }
  )

  private readonly scanSnapshots = new Map<string, string[]>()

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

  existsSync(key: string): number {
    return this.hashes.has(key) || this.strings.has(key) || this.sets.has(key)
      ? 1
      : 0
  }

  sremSync(key: string, ...members: string[]): number {
    const set = this.sets.get(key)
    if (!set) {
      return 0
    }

    let removed = 0
    members.forEach((member) => {
      if (set.delete(member)) {
        removed += 1
      }
    })

    if (!set.size) {
      this.sets.delete(key)
    }

    return removed
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

  it("prunes members whose entry has already expired", async () => {
    const redisClient = new FakeRedisClient()
    const provider = createProvider(redisClient)

    // `mc:entry-live` is still cached. `mc:entry-expired` was dropped by Redis
    // when its TTL ran out, and its reverse index went with it 60s later, so
    // nothing has ever removed it from the forward tag set.
    redisClient.setHash("mc:entry-live", {})
    redisClient.setMembers("mc:tags:entry-live", ["hash:tag-a"])
    redisClient.setMembers("mc:tag:hash:tag-a", [
      "mc:entry-live",
      "mc:entry-expired",
    ])

    await provider.clear({ tags: ["tag-a"], options: { autoInvalidate: true } })

    // The set is emptied rather than left holding the expired member, which is
    // what makes it grow without bound across TTL cycles.
    expect(redisClient.sets.has("mc:tag:hash:tag-a")).toBe(false)
    expect(redisClient.hashes.has("mc:entry-live")).toBe(false)
  })

  it("prunes expired members while leaving opted-out entries indexed", async () => {
    const redisClient = new FakeRedisClient()
    const provider = createProvider(redisClient)

    redisClient.setHash("mc:entry-keep", {
      options: JSON.stringify({ autoInvalidate: false }),
    })
    redisClient.setMembers("mc:tags:entry-keep", ["hash:tag-a"])
    redisClient.setMembers("mc:tag:hash:tag-a", [
      "mc:entry-keep",
      "mc:entry-expired",
    ])

    await provider.clear({ tags: ["tag-a"], options: { autoInvalidate: true } })

    // An entry that opted out is still live and must stay reachable through the
    // tag, so only the expired member is dropped.
    expect(redisClient.hashes.has("mc:entry-keep")).toBe(true)
    expect(redisClient.sets.get("mc:tag:hash:tag-a")).toEqual(
      new Set(["mc:entry-keep"])
    )
  })

  it("walks a large tag set in bounded chunks", async () => {
    const redisClient = new FakeRedisClient()
    const provider = createProvider(redisClient)

    const memberCount = 1200
    const members = Array.from(
      { length: memberCount },
      (_, index) => `mc:entry-${index}`
    )

    members.forEach((member) => {
      redisClient.setHash(member, {})
      redisClient.setMembers(`mc:tags:entry-${member.split("-")[1]}`, [
        "hash:tag-a",
      ])
    })
    redisClient.setMembers("mc:tag:hash:tag-a", members)

    await provider.clear({ tags: ["tag-a"] })

    // The whole set is never materialised at once: SSCAN is driven to
    // completion in fixed-size passes instead of one SMEMBERS.
    expect(redisClient.sscan.mock.calls.length).toBeGreaterThan(1)
    redisClient.sscan.mock.calls.forEach(([, , , count]) => {
      expect(count).toBeLessThanOrEqual(500)
    })

    // The point of the walk: peak work per step is a function of the chunk
    // size, not of how many members the tag has accumulated. The probe issues
    // two commands per member, so 500 members is 1000 commands.
    expect(redisClient.pipelineSizes.length).toBeGreaterThan(0)
    expect(Math.max(...redisClient.pipelineSizes)).toBeLessThanOrEqual(1000)
    expect(Math.max(...redisClient.pipelineSizes)).toBeLessThan(memberCount)

    expect(redisClient.sets.has("mc:tag:hash:tag-a")).toBe(false)
    members.forEach((member) => {
      expect(redisClient.hashes.has(member)).toBe(false)
    })
  })

  it("does not clear anything for an options object that is not an invalidation", async () => {
    const redisClient = new FakeRedisClient()
    const provider = createProvider(redisClient)

    redisClient.setHash("mc:entry-1", {})
    redisClient.setMembers("mc:tags:entry-1", ["hash:tag-a"])
    redisClient.setMembers("mc:tag:hash:tag-a", ["mc:entry-1"])

    await provider.clear({
      tags: ["tag-a"],
      options: { autoInvalidate: false },
    })

    expect(redisClient.sscan).not.toHaveBeenCalled()
    expect(redisClient.hashes.has("mc:entry-1")).toBe(true)
  })
})
