import { MedusaError } from "@medusajs/framework/utils"
import { ActiveIndexVersionCache } from "../active-version-cache"

const version = (n: number) => ({
  physical_name: `product_v${n}`,
  provider: "search-postgres",
  version: n,
})

describe("ActiveIndexVersionCache", () => {
  let now = 0

  beforeEach(() => {
    now = 0
    jest.spyOn(Date, "now").mockImplementation(() => now)
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  const advance = (ms: number) => {
    now += ms
  }

  const settle = () => new Promise((resolve) => setImmediate(resolve))

  it("fetches once and serves the cached value within the soft TTL", async () => {
    const fetchAll = jest
      .fn()
      .mockResolvedValue(new Map([["product", { active: version(1) }]]))
    const cache = new ActiveIndexVersionCache(fetchAll)

    expect(await cache.get("product")).toEqual(version(1))
    advance(1_000)
    expect(await cache.get("product")).toEqual(version(1))

    expect(fetchAll).toHaveBeenCalledTimes(1)
  })

  it("throws when the index has no active version yet", async () => {
    const fetchAll = jest.fn().mockResolvedValue(new Map())
    const cache = new ActiveIndexVersionCache(fetchAll)

    await expect(cache.get("product")).rejects.toThrow(MedusaError)
    await expect(cache.get("product")).rejects.toThrow(
      /has no active version yet/
    )
  })

  it("serves the stale value past the soft TTL while refreshing in the background", async () => {
    const fetchAll = jest
      .fn()
      .mockResolvedValueOnce(new Map([["product", { active: version(1) }]]))
      .mockResolvedValueOnce(new Map([["product", { active: version(2) }]]))
    const cache = new ActiveIndexVersionCache(fetchAll)

    expect(await cache.get("product")).toEqual(version(1))

    advance(31_000) // past the 30s soft TTL, short of the 10min hard TTL
    expect(await cache.get("product")).toEqual(version(1)) // stale, but served
    expect(fetchAll).toHaveBeenCalledTimes(2) // background refresh kicked off

    await settle()
    expect(await cache.get("product")).toEqual(version(2))
  })

  it("does not kick off a second background refresh while one is already in flight", async () => {
    let resolveFetch: (value: Map<string, unknown>) => void
    const fetchAll = jest
      .fn()
      .mockResolvedValueOnce(new Map([["product", { active: version(1) }]]))
      .mockImplementationOnce(
        () => new Promise((resolve) => (resolveFetch = resolve as any))
      )
    const cache = new ActiveIndexVersionCache(fetchAll)

    expect(await cache.get("product")).toEqual(version(1))

    advance(31_000)
    await cache.get("product")
    await cache.get("product")
    await cache.get("product")

    expect(fetchAll).toHaveBeenCalledTimes(2)

    resolveFetch!(new Map([["product", { active: version(2) }]]))
    await settle()
  })

  it("keeps the stale value and does not reset the freshness clock when a background refresh fails", async () => {
    const fetchAll = jest
      .fn()
      .mockResolvedValueOnce(new Map([["product", { active: version(1) }]]))
      .mockRejectedValueOnce(new Error("boom"))
      .mockRejectedValueOnce(new Error("boom again"))
    const cache = new ActiveIndexVersionCache(fetchAll)

    expect(await cache.get("product")).toEqual(version(1))

    advance(31_000)
    expect(await cache.get("product")).toEqual(version(1))
    await settle()

    // Still under the hard TTL from the original fetch, and the earlier
    // failure doesn't block this next background attempt.
    advance(9 * 60_000)
    expect(await cache.get("product")).toEqual(version(1))
    await settle()

    expect(fetchAll).toHaveBeenCalledTimes(3)
  })

  it("blocks for a fresh value past the hard TTL, even if refreshes have been failing", async () => {
    const fetchAll = jest
      .fn()
      .mockResolvedValueOnce(new Map([["product", { active: version(1) }]]))
      .mockResolvedValueOnce(new Map([["product", { active: version(2) }]]))
    const cache = new ActiveIndexVersionCache(fetchAll)

    expect(await cache.get("product")).toEqual(version(1))

    advance(11 * 60_000) // past the 10 minute hard TTL
    expect(await cache.get("product")).toEqual(version(2))
    expect(fetchAll).toHaveBeenCalledTimes(2)
  })

  it("returns undefined from getBuilding when nothing is building", async () => {
    const fetchAll = jest
      .fn()
      .mockResolvedValue(new Map([["product", { active: version(1) }]]))
    const cache = new ActiveIndexVersionCache(fetchAll)

    expect(await cache.getBuilding("product")).toBeUndefined()
  })

  it("returns the version currently being built", async () => {
    const fetchAll = jest.fn().mockResolvedValue(
      new Map([["product", { active: version(1), building: version(2) }]])
    )
    const cache = new ActiveIndexVersionCache(fetchAll)

    expect(await cache.getBuilding("product")).toEqual(version(2))
  })

  it("setActive/setBuilding update the cache immediately, without a fetch", async () => {
    const fetchAll = jest
      .fn()
      .mockResolvedValue(new Map([["product", { active: version(1) }]]))
    const cache = new ActiveIndexVersionCache(fetchAll)

    await cache.get("product")
    cache.setActive("product", version(2))
    cache.setBuilding("product", version(3))

    expect(await cache.get("product")).toEqual(version(2))
    expect(await cache.getBuilding("product")).toEqual(version(3))
    expect(fetchAll).toHaveBeenCalledTimes(1)

    cache.setBuilding("product", undefined)
    expect(await cache.getBuilding("product")).toBeUndefined()
  })

  it("invalidate forces a fresh fetch on the next call", async () => {
    const fetchAll = jest
      .fn()
      .mockResolvedValueOnce(new Map([["product", { active: version(1) }]]))
      .mockResolvedValueOnce(new Map([["product", { active: version(2) }]]))
    const cache = new ActiveIndexVersionCache(fetchAll)

    expect(await cache.get("product")).toEqual(version(1))
    cache.invalidate()
    expect(await cache.get("product")).toEqual(version(2))
    expect(fetchAll).toHaveBeenCalledTimes(2)
  })
})
