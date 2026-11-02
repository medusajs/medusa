import { RoutesFinder } from "../routes-finder"

describe("RoutesFinder", () => {
  const routesFinder = new RoutesFinder([
    { matcher: "/store/custom/*", methods: ["POST"] },
    { matcher: "/admin/products/{*splat}", methods: ["POST"] },
    { matcher: "/admin/custom*", methods: ["POST"] },
  ])

  it("should match the subpaths of a bare wildcard matcher", () => {
    expect(routesFinder.find("/store/custom/", "POST")?.matcher).toBe(
      "/store/custom/*"
    )
    expect(routesFinder.find("/store/custom/a/b", "POST")?.matcher).toBe(
      "/store/custom/*"
    )
  })

  it("should not match the parent or sibling paths of a bare wildcard matcher", () => {
    expect(routesFinder.find("/store/custom", "POST")).toBeNull()
    expect(routesFinder.find("/store/custom-other", "POST")).toBeNull()
  })

  it("should match Express 5 wildcard matchers", () => {
    expect(routesFinder.find("/admin/products/prod_1", "POST")?.matcher).toBe(
      "/admin/products/{*splat}"
    )
    expect(routesFinder.find("/admin/products", "POST")).toBeNull()
  })

  it("should match a wildcard within a segment", () => {
    expect(routesFinder.find("/admin/custom", "POST")?.matcher).toBe(
      "/admin/custom*"
    )
    expect(routesFinder.find("/admin/customers/1", "POST")?.matcher).toBe(
      "/admin/custom*"
    )
  })
})
