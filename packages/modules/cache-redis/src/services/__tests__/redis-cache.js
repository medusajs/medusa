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
    expect(redisClientMock.set).toBeCalled()

    await cacheService.get("test-key")
    expect(redisClientMock.get).toBeCalled()
  })
})
