import { Redis } from "ioredis"
import { randomUUID } from "node:crypto"
import { setTimeout as delay } from "node:timers/promises"
import { RedisLockingProvider } from "../../src/services/redis-lock"

describe("RedisLockingProvider acquisition timeout", () => {
  const prefix = `execute-timeout:${randomUUID()}:`
  let redisClient: Redis
  let provider: RedisLockingProvider

  beforeAll(() => {
    redisClient = new Redis(process.env.REDIS_URL ?? "redis://localhost:6379")
    provider = new RedisLockingProvider(
      { redisClient: redisClient as any, prefix },
      { maximumRetryInterval: 20 }
    )
  })

  afterAll(async () => {
    await redisClient.del(`${prefix}free`, `${prefix}busy`)
    await redisClient.quit()
  })

  it("releases acquired keys after timeout without releasing another owner's lock", async () => {
    await provider.acquire("busy", { ownerId: "another-owner", expire: 60 })
    const job = jest.fn(async () => "unreachable")

    await expect(
      provider.execute(["free", "busy"], job, { timeout: 1 })
    ).rejects.toThrow("Timed-out acquiring lock.")

    // The timeout returns immediately; cleanup follows the pending retry.
    const deadline = Date.now() + 1000
    while (
      (await redisClient.exists(`${prefix}free`)) &&
      Date.now() < deadline
    ) {
      await delay(10)
    }

    expect(await redisClient.get(`${prefix}free`)).toBeNull()
    expect(await redisClient.get(`${prefix}busy`)).toBe("another-owner")
    expect(job).not.toHaveBeenCalled()
    await expect(
      provider.execute("free", async () => "available")
    ).resolves.toBe("available")
  })
})
