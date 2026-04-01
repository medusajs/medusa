import path from "path"
import { PathMapper } from "../mapping/path-mapper"

describe("PathMapper.mapValidatorToHttpTypes", () => {
  const toAdminPath = (entity: string) =>
    `/repo/packages/medusa/src/api/admin/${entity}/validators.ts`
  const toStorePath = (entity: string) =>
    `/repo/packages/medusa/src/api/store/${entity}/validators.ts`

  describe("area detection", () => {
    it("sets area to 'admin' for admin validator paths", () => {
      const result = PathMapper.mapValidatorToHttpTypes(toAdminPath("products"))
      expect(result?.area).toBe("admin")
    })

    it("sets area to 'store' for store validator paths", () => {
      const result = PathMapper.mapValidatorToHttpTypes(toStorePath("products"))
      expect(result?.area).toBe("store")
    })

    it("returns undefined for paths that don't match the expected structure", () => {
      expect(
        PathMapper.mapValidatorToHttpTypes("/some/random/path/validators.ts")
      ).toBeUndefined()
      expect(
        PathMapper.mapValidatorToHttpTypes(
          "/packages/medusa/src/api/middleware.ts"
        )
      ).toBeUndefined()
      expect(PathMapper.mapValidatorToHttpTypes("")).toBeUndefined()
    })
  })

  describe("entity name overrides", () => {
    const cases: Array<[string, string]> = [
      ["products", "product"],
      ["orders", "order"],
      ["customers", "customer"],
      ["api-keys", "api-key"],
      ["draft-orders", "draft-order"],
      ["exchanges", "exchange"],
      ["fulfillment-sets", "fulfillment-set"],
      ["fulfillments", "fulfillment"],
      ["inventory-items", "inventory"],
      ["invites", "invite"],
      ["notifications", "notification"],
      ["order-changes", "order"],
      ["payments", "payment"],
      ["payment-collections", "payment"],
      ["price-lists", "price-list"],
      ["product-categories", "product-category"],
      ["product-tags", "product-tag"],
      ["product-types", "product-type"],
      ["product-variants", "product"],
      ["regions", "region"],
      ["returns", "return"],
      ["sales-channels", "sales-channel"],
      ["shipping-options", "shipping-option"],
      ["users", "user"],
      ["workflow-executions", "workflow-execution"],
      ["uploads", "file"],
    ]

    it.each(cases)(
      "maps route dir '%s' → domain '%s'",
      (routeDir, expectedDomain) => {
        const result = PathMapper.mapValidatorToHttpTypes(
          toAdminPath(routeDir)
        )
        expect(result?.domain).toBe(expectedDomain)
      }
    )

    it("singularizes the route dir name when no override exists", () => {
      const result = PathMapper.mapValidatorToHttpTypes(toAdminPath("locales"))
      expect(result?.domain).toBe("locale")
    })
  })

  describe("output paths", () => {
    it("puts payloads.ts and queries.ts inside the outputDir", () => {
      const result = PathMapper.mapValidatorToHttpTypes(
        toAdminPath("products")
      )!
      expect(result.payloadsFile).toBe(
        path.join(result.outputDir, "payloads.ts")
      )
      expect(result.queriesFile).toBe(path.join(result.outputDir, "queries.ts"))
    })

    it("outputDir contains the domain and area segments", () => {
      const result = PathMapper.mapValidatorToHttpTypes(toAdminPath("orders"))!
      expect(result.outputDir).toMatch(/order[/\\]admin/)
    })

    it("store paths use 'store' area in outputDir", () => {
      const result = PathMapper.mapValidatorToHttpTypes(
        toStorePath("products")
      )!
      expect(result.outputDir).toMatch(/product[/\\]store/)
    })
  })
})

describe("PathMapper.getValidatorGlobs", () => {
  it("returns one glob for area 'admin'", () => {
    const globs = PathMapper.getValidatorGlobs("admin")
    expect(globs).toHaveLength(1)
    expect(globs[0]).toMatch(/api\/admin\/\*\/validators\.ts$/)
  })

  it("returns one glob for area 'store'", () => {
    const globs = PathMapper.getValidatorGlobs("store")
    expect(globs).toHaveLength(1)
    expect(globs[0]).toMatch(/api\/store\/\*\/validators\.ts$/)
  })

  it("returns two globs for area 'all'", () => {
    const globs = PathMapper.getValidatorGlobs("all")
    expect(globs).toHaveLength(2)
    expect(globs.some((g) => g.includes("admin"))).toBe(true)
    expect(globs.some((g) => g.includes("store"))).toBe(true)
  })
})
