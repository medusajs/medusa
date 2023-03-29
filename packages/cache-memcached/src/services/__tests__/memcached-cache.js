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

    cacheService.set("test-key", "value")
    expect(memcachedClientMock.set).toBeCalled()

    cacheService.get("test-key")
    expect(memcachedClientMock.get).toBeCalled()
  })
})
