import { MemcachedCacheService } from "../index"

const memcachedClientMock = {
  set: jest.fn(),
  get: jest.fn(),
}

describe("MemcachedCacheService", () => {
  let cacheService

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("Underlying client methods are called", async () => {
    cacheService = new MemcachedCacheService(
      {
        cacheMemcachedConnection: memcachedClientMock,
      },
      {}
    )

    await cacheService.set("test-key", "value")
    expect(memcachedClientMock.set).toBeCalled()

    await cacheService.get("test-key")
    expect(memcachedClientMock.get).toBeCalled()
  })
})
