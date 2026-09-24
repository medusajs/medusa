import {
  ActiveIndexVersion,
  ActiveIndexVersionCache,
} from "../active-version-cache"

const version = (n: number): ActiveIndexVersion => ({
  physical_name: `product_v${n}`,
  provider: "test",
  version: n,
})

const deferredFetch = () => {
  let resolve!: (values: Map<string, ActiveIndexVersion>) => void
  let reject!: (error: Error) => void
  const promise = new Promise<Map<string, ActiveIndexVersion>>((res, rej) => {
    resolve = res
    reject = rej
  })
  return { promise, resolve, reject }
}

describe("ActiveIndexVersionCache writes during refresh", () => {
  afterEach(() => {
    jest.restoreAllMocks()
  })

  it.each(["missing", "older"])(
    "preserves a local activation when the cold snapshot has a %s version",
    async (snapshot) => {
      const pending = deferredFetch()
      const fetchAll = jest.fn(() => pending.promise)
      const cache = new ActiveIndexVersionCache(fetchAll)
      const reads = [cache.get("product"), cache.get("product")]

      cache.set("product", version(2))
      pending.resolve(
        snapshot === "missing" ? new Map() : new Map([["product", version(1)]])
      )

      expect(await Promise.all(reads)).toEqual([version(2), version(2)])
      expect(await cache.get("product")).toEqual(version(2))
      expect(fetchAll).toHaveBeenCalledTimes(1)
    }
  )

  it.each(["soft", "hard", "fresh"])(
    "preserves writes during a %s refresh without losing other indexes",
    async (mode) => {
      let now = 1_000_000
      jest.spyOn(Date, "now").mockImplementation(() => now)
      const pending = deferredFetch()
      const fetchAll = jest
        .fn()
        .mockResolvedValueOnce(new Map([["product", version(1)]]))
        .mockReturnValueOnce(pending.promise)
      const cache = new ActiveIndexVersionCache(fetchAll)
      await cache.get("product")

      now += mode === "soft" ? 30_000 : mode === "hard" ? 120_000 : 0
      const read = cache.get("product", { fresh: mode === "fresh" })
      if (mode === "soft") {
        expect(await read).toEqual(version(1))
      }

      cache.set("product", version(2))
      cache.set("product", version(3))
      cache.set("local", version(4))
      // Join the in-flight refresh so that assertions do not rely on timers.
      const refreshed = cache.get("product", { fresh: true })
      pending.resolve(
        new Map([
          ["product", version(1)],
          ["blog", version(5)],
        ])
      )

      expect(await refreshed).toEqual(version(3))
      if (mode !== "soft") {
        expect(await read).toEqual(version(3))
      }
      expect(await cache.get("local")).toEqual(version(4))
      expect(await cache.get("blog")).toEqual(version(5))
      expect(fetchAll).toHaveBeenCalledTimes(2)
    }
  )

  it("lets a later fetch replace local writes, including a recreated index", async () => {
    const pending = deferredFetch()
    const recreated = { ...version(1), provider: "other", physical_name: "new" }
    const fetchAll = jest
      .fn()
      .mockReturnValueOnce(pending.promise)
      .mockResolvedValueOnce(new Map([["product", recreated]]))
      .mockResolvedValueOnce(new Map())
    const cache = new ActiveIndexVersionCache(fetchAll)
    const read = cache.get("product")
    cache.set("product", version(3))
    pending.resolve(new Map())

    expect(await read).toEqual(version(3))
    expect(await cache.get("product", { fresh: true })).toEqual(recreated)
    await expect(cache.get("product", { fresh: true })).rejects.toThrow(
      /has no active version yet/
    )
  })

  it("does not carry a write made before a fetch into its result", async () => {
    const cache = new ActiveIndexVersionCache(async () => new Map())
    cache.set("product", version(2))

    await expect(cache.get("product", { fresh: true })).rejects.toThrow(
      /has no active version yet/
    )
  })

  it("keeps local writes on failure without making the failed fetch fresh", async () => {
    let now = 1_000_000
    jest.spyOn(Date, "now").mockImplementation(() => now)
    const pending = deferredFetch()
    const fetchAll = jest
      .fn()
      .mockResolvedValueOnce(new Map([["product", version(1)]]))
      .mockReturnValueOnce(pending.promise)
      .mockRejectedValueOnce(new Error("still unavailable"))
      .mockResolvedValueOnce(new Map([["product", version(4)]]))
    const cache = new ActiveIndexVersionCache(fetchAll)
    await cache.get("product")
    now += 10_000

    const read = cache.get("product", { fresh: true })
    const rejected = expect(read).rejects.toThrow("db unavailable")
    cache.set("product", version(2))
    pending.reject(new Error("db unavailable"))
    await rejected

    expect(await cache.get("product")).toEqual(version(2))
    now += 110_000
    // The hard TTL is measured from the successful fetch, not the failed one.
    await expect(cache.get("product")).rejects.toThrow("still unavailable")
    expect(await cache.get("product")).toEqual(version(4))
    expect(fetchAll).toHaveBeenCalledTimes(4)
  })

  it("does not reapply a pending write that was invalidated", async () => {
    const pending = deferredFetch()
    const cache = new ActiveIndexVersionCache(() => pending.promise)
    const read = cache.get("product")
    const rejected = expect(read).rejects.toThrow(/has no active version yet/)
    cache.set("product", version(2))
    cache.invalidate()
    pending.resolve(new Map())

    await rejected
  })

  it("preserves a new write after invalidation during the same fetch", async () => {
    const pending = deferredFetch()
    const cache = new ActiveIndexVersionCache(() => pending.promise)
    const read = cache.get("product")
    cache.set("product", version(2))
    cache.invalidate()
    cache.set("product", version(3))
    pending.resolve(new Map())

    expect(await read).toEqual(version(3))
  })
})
