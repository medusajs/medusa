import { setTimeout } from "node:timers/promises"
import { RedisLockingProvider } from "../redis-lock"

jest.mock("node:timers/promises", () => ({
  setTimeout: jest.fn().mockResolvedValue(undefined),
}))

describe("RedisLockingProvider Jitter", () => {
  let provider: RedisLockingProvider
  const redisClientMock = {
    defineCommand: jest.fn(),
    acquireLock: jest.fn(),
  }

  beforeEach(() => {
    provider = new RedisLockingProvider(
      {
        redisClient: redisClientMock as any,
        prefix: "test:",
      },
      {
        defaultRetryInterval: 100,
        backoffFactor: 2,
      } as any
    )
    jest.clearAllMocks()
  })

  it("should apply jitter between 50% and 100% of the retryDelay", async () => {
    // Mock acquireLock to fail once then succeed
    redisClientMock.acquireLock
      .mockResolvedValueOnce(0)
      .mockResolvedValueOnce(1)

    await provider.acquire("test-key", { awaitQueue: true })

    // The first retryDelay should be the defaultRetryInterval (100)
    const expectedBaseDelay = 100
    
    expect(setTimeout).toHaveBeenCalledTimes(1)
    const actualDelay = (setTimeout as jest.Mock).mock.calls[0][0]
    
    expect(actualDelay).toBeGreaterThanOrEqual(expectedBaseDelay * 0.5)
    expect(actualDelay).toBeLessThanOrEqual(expectedBaseDelay)
  })

  it("should apply jitter to subsequent exponential backoff steps", async () => {
    // Mock acquireLock to fail twice then succeed
    redisClientMock.acquireLock
      .mockResolvedValueOnce(0)
      .mockResolvedValueOnce(0)
      .mockResolvedValueOnce(1)

    await provider.acquire("test-key", { awaitQueue: true })

    expect(setTimeout).toHaveBeenCalledTimes(2)
    
    // First delay (base 100)
    const firstDelay = (setTimeout as jest.Mock).mock.calls[0][0]
    expect(firstDelay).toBeGreaterThanOrEqual(100 * 0.5)
    expect(firstDelay).toBeLessThanOrEqual(100)

    // Second delay (base 200, due to backoffFactor 2)
    const secondDelay = (setTimeout as jest.Mock).mock.calls[1][0]
    expect(secondDelay).toBeGreaterThanOrEqual(200 * 0.5)
    expect(secondDelay).toBeLessThanOrEqual(200)
  })
})

describe("RedisLockingProvider acquire ordering and release", () => {
  let provider: RedisLockingProvider
  const redisClientMock = {
    defineCommand: jest.fn(),
    acquireLock: jest.fn(),
    releaseLock: jest.fn(),
    scan: jest.fn(),
    pipeline: jest.fn(),
  }

  beforeEach(() => {
    provider = new RedisLockingProvider(
      {
        redisClient: redisClientMock as any,
        prefix: "test:",
      },
      {
        defaultRetryInterval: 10,
        backoffFactor: 2,
      } as any
    )
    jest.clearAllMocks()
  })

  it("should deduplicate and sort keys and acquire them sequentially", async () => {
    redisClientMock.acquireLock.mockResolvedValue(1)

    await provider.acquire(["b", "a", "b"], { ownerId: "owner_1" })

    // A stable, duplicate-free order is what prevents two callers requesting
    // the same keys in different orders from deadlocking against each other.
    // The third argument is the ttl: the script no longer takes awaitQueue.
    expect(redisClientMock.acquireLock.mock.calls).toEqual([
      ["test:a", "owner_1", 0],
      ["test:b", "owner_1", 0],
    ])
  })

  it("should stop at the first key it cannot take", async () => {
    redisClientMock.acquireLock.mockImplementation((key: string) =>
      Promise.resolve(key === "test:b" ? 0 : 1)
    )

    await expect(
      provider.acquire(["c", "a", "b"], { ownerId: "owner_1" })
    ).rejects.toThrow('Failed to acquire lock for key "b"')

    // Sorted order means "a" then "b"; "c" is never attempted because the
    // keys are taken one after the other rather than in parallel.
    expect(redisClientMock.acquireLock.mock.calls).toEqual([
      ["test:a", "owner_1", 0],
      ["test:b", "owner_1", 0],
    ])
  })

  it("should not back off when the first attempt succeeds under awaitQueue", async () => {
    redisClientMock.acquireLock.mockResolvedValue(1)

    await expect(
      provider.acquire("k", { ownerId: "owner_1", awaitQueue: true })
    ).resolves.toBeUndefined()

    // The awaitQueue branch has to return on the first success instead of
    // always sleeping once. Whether an owner re-entering its own lock is
    // given that success is decided by the Lua script, so the re-entrancy
    // fix itself is covered by the integration suite against a real Redis.
    expect(redisClientMock.acquireLock).toHaveBeenCalledTimes(1)
    expect(setTimeout).not.toHaveBeenCalled()
  })

  it("should release scanned keys through a single atomic pipeline", async () => {
    redisClientMock.scan.mockResolvedValueOnce(["0", ["test:x", "test:y"]])

    // Neither mock exposes get or unlink: the previous read-then-delete
    // shape needed both, so it cannot pass this test.
    const pipelineMock = {
      releaseLock: jest.fn().mockReturnThis(),
      exec: jest.fn().mockResolvedValue([]),
    }
    redisClientMock.pipeline.mockReturnValue(pipelineMock)

    await provider.releaseAll({ ownerId: "owner_1" })

    expect(redisClientMock.scan).toHaveBeenCalledWith(
      "0",
      "MATCH",
      "test:*",
      "COUNT",
      100
    )
    // Scanned keys are already prefixed and go to the script as-is, and the
    // owner check now happens inside the delete instead of before it.
    expect(pipelineMock.releaseLock.mock.calls).toEqual([
      ["test:x", "owner_1"],
      ["test:y", "owner_1"],
    ])
    expect(redisClientMock.pipeline).toHaveBeenCalledTimes(1)
    expect(pipelineMock.exec).toHaveBeenCalledTimes(1)
    expect(redisClientMock).not.toHaveProperty("get")
    expect(redisClientMock).not.toHaveProperty("unlink")
    expect(pipelineMock).not.toHaveProperty("get")
    expect(pipelineMock).not.toHaveProperty("unlink")
  })
})
