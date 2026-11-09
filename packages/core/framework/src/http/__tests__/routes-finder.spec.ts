import { preloadPathToRegexp, RoutesFinder } from "../routes-finder"

describe("RoutesFinder", () => {
  beforeAll(async () => {
    await preloadPathToRegexp()
  })

  it("returns the matching route for a parametric path and null for a miss", () => {
    const finder = new RoutesFinder([
      { matcher: "/store/carts/:id", method: "GET" as const },
    ])

    expect(finder.find("/store/carts/cart_1", "GET")).toEqual(
      expect.objectContaining({ matcher: "/store/carts/:id", method: "GET" })
    )
    expect(finder.find("/store/carts/cart_1", "POST")).toBeNull()
    expect(finder.find("/store/missing", "GET")).toBeNull()
  })

  it("answers a repeated lookup from the cache", () => {
    const matcher = /^\/store\/carts\/[^/]+$/
    const test = jest.spyOn(matcher, "test")
    const finder = new RoutesFinder([{ matcher, method: "GET" as const }])

    finder.find("/store/carts/cart_1", "GET")
    finder.find("/store/carts/cart_1", "GET")

    expect(test).toHaveBeenCalledTimes(1)
  })

  it("keeps the cache bounded under many distinct paths and evicts the oldest entry", () => {
    const matcher = /^\/store\/carts\/[^/]+$/
    const test = jest.spyOn(matcher, "test")
    const finder = new RoutesFinder([{ matcher, method: "GET" as const }])

    for (let i = 0; i < 10_000; i++) {
      finder.find(`/store/carts/cart_${i}`, "GET")
    }
    test.mockClear()

    // The most recent path is still cached...
    expect(finder.find("/store/carts/cart_9999", "GET")).not.toBeNull()
    expect(test).not.toHaveBeenCalled()

    // ...while the first one was evicted and is matched again, with the same result.
    expect(finder.find("/store/carts/cart_0", "GET")).not.toBeNull()
    expect(test).toHaveBeenCalledTimes(1)
  })
})
