import { SearchTypes } from "@medusajs/framework/types"
import { SearchIndexContext } from "@types"
import { MedusaError } from "@medusajs/framework/utils"
import { ActiveIndexVersionCache } from "../active-version-cache"
import { resolveActiveDefinition, withActiveIndexRetry } from "../index"

const SOFT_TTL_MS = 30_000
const HARD_TTL_MS = 2 * 60_000

const version = (n: number) => ({
  physical_name: `product_v${n}`,
  provider: "test",
  version: n,
})

/**
 * A cache over a fetcher whose answer the test controls, with the clock under
 * the test's control too — every behaviour here is a function of elapsed time.
 */
const buildCache = () => {
  let now = 1_000_000
  let active = 1
  let failNext = false

  const fetchAll = jest.fn(async () => {
    if (failNext) {
      throw new Error("db unreachable")
    }
    return new Map([["product", version(active)]])
  })

  jest.spyOn(Date, "now").mockImplementation(() => now)

  return {
    cache: new ActiveIndexVersionCache(fetchAll),
    fetchAll,
    advance: (ms: number) => {
      now += ms
    },
    /** Stands in for another process finishing a swap. */
    flipTo: (n: number) => {
      active = n
    },
    breakFetch: (broken: boolean) => {
      failNext = broken
    },
    // Lets a background refresh settle before the next assertion.
    settle: () => new Promise((resolve) => setImmediate(resolve)),
  }
}

describe("ActiveIndexVersionCache", () => {
  afterEach(() => {
    jest.restoreAllMocks()
  })

  it("serves from memory inside the soft TTL", async () => {
    const { cache, fetchAll, advance, flipTo } = buildCache()

    expect((await cache.get("product")).version).toBe(1)

    flipTo(2)
    advance(SOFT_TTL_MS - 1)

    expect((await cache.get("product")).version).toBe(1)
    expect(fetchAll).toHaveBeenCalledTimes(1)
  })

  it("serves the stale value once past the soft TTL, then the fresh one", async () => {
    const { cache, advance, flipTo, settle } = buildCache()

    await cache.get("product")
    flipTo(2)
    advance(SOFT_TTL_MS)

    // Stale-while-revalidate: this call still answers 1 and kicks off the fetch.
    expect((await cache.get("product")).version).toBe(1)
    await settle()
    expect((await cache.get("product")).version).toBe(2)
  })

  it("keeps refreshing in the background after one refresh fails", async () => {
    const { cache, fetchAll, advance, flipTo, breakFetch, settle } =
      buildCache()

    await cache.get("product")
    flipTo(2)

    advance(SOFT_TTL_MS)
    breakFetch(true)
    await cache.get("product")
    await settle()

    expect(fetchAll).toHaveBeenCalledTimes(2)

    // The engine is healthy again and the value is still stale, so the next
    // access past the soft TTL has to try again rather than wait out the hard
    // TTL
    breakFetch(false)
    advance(SOFT_TTL_MS)
    await cache.get("product")
    await settle()

    expect(fetchAll).toHaveBeenCalledTimes(3)
    expect((await cache.get("product")).version).toBe(2)
  })

  it("counts the hard TTL from the last success, not the last attempt", async () => {
    const { cache, advance, flipTo, breakFetch, settle } = buildCache()

    await cache.get("product")
    flipTo(2)

    // A failed refresh must not look like a fill.
    advance(SOFT_TTL_MS)
    breakFetch(true)
    await cache.get("product")
    await settle()
    breakFetch(false)

    advance(HARD_TTL_MS - SOFT_TTL_MS)

    // Past the hard TTL since the last *successful* fetch, so this one waits.
    expect((await cache.get("product")).version).toBe(2)
  })

  it("waits for a fetch rather than serving anything past the hard TTL", async () => {
    const { cache, advance, flipTo } = buildCache()

    await cache.get("product")
    flipTo(2)
    advance(HARD_TTL_MS)

    expect((await cache.get("product")).version).toBe(2)
  })

  it("refetches on every `fresh` read, whatever the age", async () => {
    const { cache, fetchAll, flipTo } = buildCache()

    await cache.get("product")
    flipTo(2)

    // No time has passed, so a plain read would be served from memory.
    expect((await cache.get("product", { fresh: true })).version).toBe(2)
    expect(fetchAll).toHaveBeenCalledTimes(2)
  })

  it("coalesces concurrent fetches into one", async () => {
    const { cache, fetchAll } = buildCache()

    const results = await Promise.all([
      cache.get("product"),
      cache.get("product"),
      cache.get("product"),
    ])

    expect(fetchAll).toHaveBeenCalledTimes(1)
    expect(results.map((result) => result.version)).toEqual([1, 1, 1])
  })

  it("refetches after being invalidated", async () => {
    const { cache, fetchAll, flipTo } = buildCache()

    await cache.get("product")
    flipTo(2)
    await cache.invalidate()

    expect((await cache.get("product")).version).toBe(2)
    expect(fetchAll).toHaveBeenCalledTimes(2)
  })

  it("throws when the index has no active version", async () => {
    const { cache } = buildCache()

    await expect(cache.get("blog")).rejects.toThrow(
      /Search index "blog" has no active version yet/
    )
  })

  it("surfaces the failure when it cannot serve anything", async () => {
    const { cache, breakFetch } = buildCache()

    breakFetch(true)

    await expect(cache.get("product")).rejects.toThrow("db unreachable")
  })

  describe("with a fetch in flight", () => {
    // Every fetch stays pending until the test lands it, so a fetch that read
    // the database before a flip can be made to land after the flip was made.
    const buildDeferredCache = () => {
      let now = 1_000_000
      jest.spyOn(Date, "now").mockImplementation(() => now)

      const pending: ((values: Map<string, unknown>) => void)[] = []
      const fetchAll = jest.fn(
        () => new Promise<Map<string, any>>((resolve) => pending.push(resolve))
      )

      return {
        cache: new ActiveIndexVersionCache(fetchAll),
        fetchAll,
        advance: (ms: number) => {
          now += ms
        },
        land: async (fetch: number, active?: number) => {
          pending[fetch](new Map(active ? [["product", version(active)]] : []))
          await new Promise((resolve) => setImmediate(resolve))
        },
      }
    }

    it("keeps a first activation that the fetch did not see", async () => {
      const { cache, fetchAll, land } = buildDeferredCache()

      // Read the database before the activation, so it answers "no version".
      const cold = cache.get("product").catch(() => undefined)
      const set = cache.set("product", version(1))
      await land(0)
      await Promise.all([cold, set])

      expect((await cache.get("product")).version).toBe(1)
      expect(fetchAll).toHaveBeenCalledTimes(1)
    })

    it("does not roll a flip back to the version the fetch read", async () => {
      const { cache, advance, land } = buildDeferredCache()

      const initial = cache.get("product")
      await land(0, 1)
      await initial

      // Past the soft TTL, so this starts a background fetch that reads the
      // database before the flip below.
      advance(SOFT_TTL_MS)
      await cache.get("product")
      const set = cache.set("product", version(2))
      await land(1, 1)
      await set

      expect((await cache.get("product")).version).toBe(2)
    })

    it("does not join or keep a fetch that started before invalidate()", async () => {
      const { cache, fetchAll, land } = buildDeferredCache()

      const before = cache.get("product")
      const invalidated = cache.invalidate()
      await land(0, 1)
      await Promise.all([before, invalidated])

      const after = cache.get("product")
      await land(1, 2)

      expect((await after).version).toBe(2)
      expect(fetchAll).toHaveBeenCalledTimes(2)
    })
  })
})

describe("resolveActiveDefinition", () => {
  const definition = {
    name: "product",
    physical_name: "product",
    provider: "stale-provider",
  } as SearchTypes.ResolvedSearchIndexDefinition

  const context = (get: jest.Mock) => ({
    indexes: new Map([["product", definition]]),
    activeVersionCache: { get, set: jest.fn(), invalidate: jest.fn() },
  })

  it("merges in the physical index and provider serving reads", async () => {
    const get = jest.fn().mockResolvedValue({
      physical_name: "product_v3",
      provider: "live-provider",
      version: 3,
    })

    const resolved = await resolveActiveDefinition(
      context(get) as any,
      "product"
    )

    expect(resolved).toMatchObject({
      physical_name: "product_v3",
      provider: "live-provider",
    })
    expect(get).toHaveBeenCalledWith("product", { fresh: false })
  })

  it("asks for a fresh value when the caller is about to write", async () => {
    const get = jest.fn().mockResolvedValue(version(3))

    await resolveActiveDefinition(context(get) as any, "product", {
      fresh: true,
    })

    expect(get).toHaveBeenCalledWith("product", { fresh: true })
  })
})

describe("withActiveIndexRetry", () => {
  // Typed rather than cast, so dropping a method the helper calls off
  // `activeVersionCache` fails here and not only in a downstream build.
  const context = (): Pick<SearchIndexContext, "activeVersionCache"> & {
    activeVersionCache: { invalidate: jest.Mock }
  } => ({
    activeVersionCache: {
      get: jest.fn(),
      set: jest.fn(),
      invalidate: jest.fn(),
    },
  })

  const missingIndex = () =>
    new MedusaError(
      MedusaError.Types.NOT_FOUND,
      'The postgres search provider has no index "product_v1"'
    )

  it("returns the first result when nothing is missing", async () => {
    const ctx = context()
    const run = jest.fn().mockResolvedValue("ok")

    expect(await withActiveIndexRetry(ctx, run)).toBe("ok")
    expect(run).toHaveBeenCalledTimes(1)
    expect(ctx.activeVersionCache.invalidate).not.toHaveBeenCalled()
  })

  it("invalidates and retries once when the engine has no such index", async () => {
    const ctx = context()
    const run = jest
      .fn()
      .mockRejectedValueOnce(missingIndex())
      .mockResolvedValue("healed")

    expect(await withActiveIndexRetry(ctx, run)).toBe("healed")
    expect(ctx.activeVersionCache.invalidate).toHaveBeenCalledTimes(1)
    expect(run).toHaveBeenCalledTimes(2)
  })

  it("gives up after the second failure", async () => {
    const ctx = context()
    const run = jest.fn().mockRejectedValue(missingIndex())

    await expect(withActiveIndexRetry(ctx, run)).rejects.toThrow(
      'no index "product_v1"'
    )
    expect(run).toHaveBeenCalledTimes(2)
  })

  it("does not retry a failure that a fresher version cannot fix", async () => {
    const ctx = context()
    const run = jest
      .fn()
      .mockRejectedValue(
        new MedusaError(MedusaError.Types.INVALID_DATA, "unsortable field")
      )

    await expect(withActiveIndexRetry(ctx, run)).rejects.toThrow(
      "unsortable field"
    )
    expect(run).toHaveBeenCalledTimes(1)
    expect(ctx.activeVersionCache.invalidate).not.toHaveBeenCalled()
  })
})
