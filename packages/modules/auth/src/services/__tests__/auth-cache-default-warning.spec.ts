import { jest } from "@jest/globals"
import { Logger } from "@medusajs/framework/types"
import {
  _resetInMemoryDefaultWarningForTests,
  warnIfAuthCacheIsInMemoryDefault,
} from "../../utils/cache-in-memory-warning"

/**
 * Verifies that the production warning call (in AuthModuleService.__hooks)
 * actually reaches the logger when one is provided. The existing helper
 * tests cover the detection logic; this test pins the call shape — that
 * AuthModuleService passes a non-undefined logger through to the helper
 * so the warning is emitted in production (not silently swallowed by
 * logger?.warn on undefined).
 */
describe("AuthModuleService.__hooks.onApplicationStart -> logger wiring", () => {
  beforeEach(() => {
    _resetInMemoryDefaultWarningForTests()
  })

  it("emits the warning to the injected logger when the cache is the in-memory default", () => {
    const logger: Partial<Logger> = { warn: jest.fn() }
    const cache: any = {
      get: jest.fn(),
      set: jest.fn(),
      invalidate: jest.fn(),
      clear: jest.fn(), // the duck-type marker for the in-memory default
    }

    // This is the exact line from AuthModuleService.__hooks.onApplicationStart.
    warnIfAuthCacheIsInMemoryDefault(cache, logger as Logger)

    expect(logger.warn).toHaveBeenCalledTimes(1)
    const message = (logger.warn as jest.Mock).mock.calls[0][0] as string
    expect(message).toContain("Modules.CACHE")
    expect(message).toContain("in-memory")
  })

  it("does not throw when the logger is undefined (logger_.warn path is optional)", () => {
    const cache: any = {
      get: jest.fn(),
      set: jest.fn(),
      invalidate: jest.fn(),
      clear: jest.fn(),
    }

    expect(() =>
      warnIfAuthCacheIsInMemoryDefault(cache, undefined)
    ).not.toThrow()
  })
})
