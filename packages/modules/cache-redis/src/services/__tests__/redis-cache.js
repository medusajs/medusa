import { RedisCacheService } from "../index"

const redisClientMock = {
  set: jest.fn(),
  get: jest.fn(),
}

describe("RedisCacheService", () => {
  let cacheService

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("Underlying client methods are called", async () => {
    cacheService = new RedisCacheService(
      {
        cacheRedisConnection: redisClientMock,
      },
      {}
    )

    await cacheService.set("test-key", "value")
    expect(redisClientMock.set).toHaveBeenCalled()

    await cacheService.get("test-key")
    expect(redisClientMock.get).toHaveBeenCalled()
  })

  it("Increments counters with INCR and EXPIRE in a transaction", async () => {
    const transaction = {
      incr: jest.fn().mockReturnThis(),
      expire: jest.fn().mockReturnThis(),
      exec: jest.fn().mockResolvedValue([
        [null, 3],
        [null, 1],
      ]),
    }

    cacheService = new RedisCacheService(
      {
        cacheRedisConnection: { multi: jest.fn(() => transaction) },
      },
      {}
    )

    const value = await cacheService.increment("counter", 60)

    expect(transaction.incr).toHaveBeenCalledWith("medusa:counter")
    expect(transaction.expire).toHaveBeenCalledWith("medusa:counter", 60)
    expect(value).toEqual(3)
  })
})
