import { RedisLockingProvider } from "../redis-lock"

describe("RedisLockingProvider shutdown", () => {
  it("closes the redis client", async () => {
    const redisClient = { defineCommand: jest.fn(), disconnect: jest.fn() }
    const provider = new RedisLockingProvider(
      { redisClient: redisClient as any },
      {} as any
    )

    await provider.shutdown()

    expect(redisClient.disconnect).toHaveBeenCalledTimes(1)
  })
})
