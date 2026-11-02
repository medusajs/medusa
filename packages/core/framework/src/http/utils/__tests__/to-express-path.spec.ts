import { pathToRegexp } from "path-to-regexp"
import { toExpressPath } from "../to-express-path"

const matches = (matcher: string, url: string) =>
  pathToRegexp(toExpressPath(matcher), { end: false }).regexp.test(url)

describe("toExpressPath", () => {
  it("should convert each bare wildcard to a uniquely named optional wildcard", () => {
    expect(toExpressPath("/admin/products/*/variants/*")).toBe(
      "/admin/products/{*splat0}/variants/{*splat1}"
    )
    expect(toExpressPath("/admin*")).toBe("/admin{*splat0}")
  })

  it("should leave matchers without bare wildcards unchanged", () => {
    const regex = /^\/admin/
    expect(toExpressPath(regex)).toBe(regex)
    expect(toExpressPath("/admin/products/:id")).toBe("/admin/products/:id")
    expect(toExpressPath("/admin/{*rest}")).toBe("/admin/{*rest}")
    expect(toExpressPath("/admin/*rest")).toBe("/admin/*rest")
  })

  it("should match the same paths as the Express 4 wildcard", () => {
    expect(matches("/admin/products/*", "/admin/products/")).toBe(true)
    expect(matches("/admin/products/*", "/admin/products/prod_1/variants")).toBe(
      true
    )
    expect(matches("/admin/products/*", "/admin/products")).toBe(false)
    expect(matches("/admin/products/*", "/admin/products-tags")).toBe(false)
    expect(matches("/admin*", "/admin")).toBe(true)
    expect(matches("/admin*", "/admin/users")).toBe(true)
  })
})
