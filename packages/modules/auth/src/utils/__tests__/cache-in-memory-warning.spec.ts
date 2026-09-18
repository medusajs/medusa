import {
  _resetInMemoryDefaultWarningForTests,
  warnIfAuthCacheIsInMemoryDefault,
} from "../cache-in-memory-warning"

describe("warnIfAuthCacheIsInMemoryDefault", () => {
  beforeEach(() => {
    _resetInMemoryDefaultWarningForTests()
  })
  it("logs nothing when no cache is provided", () => {
    const logger = { warn: jest.fn() } as any

    warnIfAuthCacheIsInMemoryDefault(undefined, logger)

    expect(logger.warn).not.toHaveBeenCalled()
  })

  it("logs nothing when the cache does not expose clear() (e.g. Redis cache)", () => {
    const logger = { warn: jest.fn() } as any
    // ICacheService has only get/set/invalidate; the in-memory default adds
    // a clear() method that production providers don't ship.
    const redisLikeCache = {
      get: jest.fn(),
      set: jest.fn(),
      invalidate: jest.fn(),
    } as any

    warnIfAuthCacheIsInMemoryDefault(redisLikeCache, logger)

    expect(logger.warn).not.toHaveBeenCalled()
  })

  it("emits a warning when the cache exposes clear() (in-memory default)", () => {
    const logger = { warn: jest.fn() } as any
    const inMemoryLikeCache = {
      get: jest.fn(),
      set: jest.fn(),
      invalidate: jest.fn(),
      clear: jest.fn(), // exclusive to @medusajs/medusa/cache-inmemory
    } as any

    warnIfAuthCacheIsInMemoryDefault(inMemoryLikeCache, logger)

    expect(logger.warn).toHaveBeenCalledTimes(1)
    const message = logger.warn.mock.calls[0][0] as string
    expect(message).toContain("Modules.CACHE")
    expect(message).toContain("in-memory")
  })

  it("treats a non-function clear property as a non-match (e.g. someone overrode clear with a plain value)", () => {
    const logger = { warn: jest.fn() } as any
    const oddCache = {
      get: jest.fn(),
      set: jest.fn(),
      invalidate: jest.fn(),
      clear: "not a function",
    } as any

    warnIfAuthCacheIsInMemoryDefault(oddCache, logger)

    expect(logger.warn).not.toHaveBeenCalled()
  })

  it("does not throw when logger is undefined", () => {
    const inMemoryLikeCache = {
      get: jest.fn(),
      set: jest.fn(),
      invalidate: jest.fn(),
      clear: jest.fn(),
    } as any

    expect(() =>
      warnIfAuthCacheIsInMemoryDefault(inMemoryLikeCache, undefined)
    ).not.toThrow()
  })

  it("logs only once across repeated calls (deduplication for test runners)", () => {
    const logger = { warn: jest.fn() } as any
    const inMemoryLikeCache = {
      get: jest.fn(),
      set: jest.fn(),
      invalidate: jest.fn(),
      clear: jest.fn(),
    } as any

    warnIfAuthCacheIsInMemoryDefault(inMemoryLikeCache, logger)
    warnIfAuthCacheIsInMemoryDefault(inMemoryLikeCache, logger)
    warnIfAuthCacheIsInMemoryDefault(inMemoryLikeCache, logger)

    expect(logger.warn).toHaveBeenCalledTimes(1)
  })
})
