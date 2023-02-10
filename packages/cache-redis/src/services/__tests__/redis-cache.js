import { RedisCacheService } from "../index"

const redisClientMock = {
  set: jest.fn(),
  get: jest.fn(),
}

describe("RedisCacheService", () => {
  let cacheService

  beforeAll(() => {
    jest.resetAllMocks()
  })

  it("Creates a RedisCacheService", () => {
    cacheService = new RedisCacheService(
      {
        redisClient: redisClientMock,
      },
      {},
      { resources: "shared" }
    )
  })

  it("Throws on isolated module declaration", () => {
    try {
      cacheService = new RedisCacheService(
        {
          redisClient: redisClientMock,
        },
        {},
        { resources: "shared" }
      )
    } catch (error) {
      expect(error.message).toEqual(
        "At the moment this module can only be used with shared resources"
      )
    }
  })

  it("Underlying client methods are called", async () => {
    cacheService = new RedisCacheService(
      {
        redisClient: redisClientMock,
      },
      {},
      { resources: "shared" }
    )

    await cacheService.set("test-key", "value")
    expect(redisClientMock.set).toBeCalled()

    await cacheService.get("test-key")
    expect(redisClientMock.get).toBeCalled()
  })
})
