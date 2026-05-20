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
