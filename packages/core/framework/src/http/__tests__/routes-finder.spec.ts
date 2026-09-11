import { RoutesFinder } from "../routes-finder"

describe("RoutesFinder", () => {
  describe("string matchers", () => {
    it("matches an exact path", () => {
      const finder = new RoutesFinder([
        { matcher: "/admin/products", methods: ["GET"] as const },
      ] as any)

      expect(finder.find("/admin/products", "GET" as any)).toBeTruthy()
      expect(finder.find("/admin/orders", "GET" as any)).toBeNull()
    })

    it("does not match when the method differs", () => {
      const finder = new RoutesFinder([
        { matcher: "/admin/products", methods: ["GET"] as const },
      ] as any)

      expect(finder.find("/admin/products", "POST" as any)).toBeNull()
    })
  })

  describe("regular expression matchers", () => {
    it("matches every URL the expression covers", () => {
      const finder = new RoutesFinder([
        { matcher: /\/admin/, methods: ["GET"] as const },
      ] as any)

      expect(finder.find("/admin/products", "GET" as any)).toBeTruthy()
      expect(finder.find("/admin/orders", "GET" as any)).toBeTruthy()
    })

    /**
     * `test()` advances `lastIndex` on a global expression, so a matcher that
     * matched the previous URL starts the next search partway through the
     * string. Consecutive distinct URLs would otherwise alternate between
     * matching and missing.
     */
    it("is not made stateful by the global flag", () => {
      const finder = new RoutesFinder([
        { matcher: /\/admin/g, methods: ["GET"] as const },
      ] as any)

      const urls = [
        "/admin/products",
        "/admin/orders",
        "/admin/customers",
        "/admin/users",
      ]

      for (const url of urls) {
        expect(finder.find(url, "GET" as any)).toBeTruthy()
      }
    })

    it("is not made stateful by the sticky flag", () => {
      const finder = new RoutesFinder([
        { matcher: /\/admin/y, methods: ["GET"] as const },
      ] as any)

      expect(finder.find("/admin/products", "GET" as any)).toBeTruthy()
      expect(finder.find("/admin/orders", "GET" as any)).toBeTruthy()
    })

    /**
     * A sticky matcher anchors at `lastIndex`; with `lastIndex` reset to 0 that
     * means "must match at the start of the URL". Stripping the flag instead of
     * resetting the index would silently widen the matcher, so assert the
     * anchoring still holds.
     */
    it("keeps a sticky matcher anchored at the start of the URL", () => {
      const finder = new RoutesFinder([
        { matcher: /\/admin/y, methods: ["GET"] as const },
      ] as any)

      expect(finder.find("/store/admin/products", "GET" as any)).toBeNull()
    })

    it("does not mutate the caller's expression", () => {
      const matcher = /\/admin/g
      const finder = new RoutesFinder([
        { matcher, methods: ["GET"] as const },
      ] as any)

      finder.find("/admin/products", "GET" as any)

      expect(matcher.lastIndex).toBe(0)
    })

    /**
     * `find()` memoises per `method:url`, so a wrong answer is not transient —
     * it is cached for the lifetime of the process. Re-querying must therefore
     * agree with the first answer.
     */
    it("caches a result consistent with a fresh lookup", () => {
      const finder = new RoutesFinder([
        { matcher: /\/admin/g, methods: ["GET"] as const },
      ] as any)

      const first = ["/admin/products", "/admin/orders"].map((url) =>
        Boolean(finder.find(url, "GET" as any))
      )
      const second = ["/admin/products", "/admin/orders"].map((url) =>
        Boolean(finder.find(url, "GET" as any))
      )

      expect(first).toEqual([true, true])
      expect(second).toEqual(first)
    })
  })
})
