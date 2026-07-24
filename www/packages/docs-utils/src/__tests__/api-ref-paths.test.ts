import { describe, expect, it } from "vitest"
import {
  getApiRefIntroSlug,
  getApiRefOperationSlug,
  getApiRefPath,
  getApiRefTagOperationSlugs,
  getApiRefTagSlug,
} from "../api-ref-paths.js"

describe("getApiRefIntroSlug", () => {
  it("slugifies an intro heading", () => {
    expect(getApiRefIntroSlug("Authentication")).toBe("authentication")
    expect(getApiRefIntroSlug("Select Fields and Relations")).toBe(
      "select-fields-and-relations"
    )
  })
})

describe("getApiRefTagSlug", () => {
  it("slugifies a tag name", () => {
    expect(getApiRefTagSlug("Carts")).toBe("carts")
    expect(getApiRefTagSlug("Gift Cards")).toBe("gift-cards")
  })
})

describe("getApiRefOperationSlug", () => {
  it("prefers x-sidebar-summary, then summary, then operationId", () => {
    expect(
      getApiRefOperationSlug({
        operationId: "GetCartsId",
        summary: "Get a Cart",
        "x-sidebar-summary": "Get Cart",
      })
    ).toBe("get-cart")
    expect(
      getApiRefOperationSlug({ operationId: "GetCartsId", summary: "Get a Cart" })
    ).toBe("get-a-cart")
    expect(getApiRefOperationSlug({ operationId: "GetCartsId" })).toBe(
      "getcartsid"
    )
  })
})

describe("getApiRefTagOperationSlugs", () => {
  it("computes unique slugs within a tag", () => {
    const slugs = getApiRefTagOperationSlugs([
      { operationId: "GetCartsId", summary: "Get a Cart" },
      { operationId: "PostCarts", summary: "Create Cart" },
      { operationId: "PostCartsIdLineItems", "x-sidebar-summary": "Add Line Item" },
    ])

    expect(slugs.get("GetCartsId")).toBe("get-a-cart")
    expect(slugs.get("PostCarts")).toBe("create-cart")
    expect(slugs.get("PostCartsIdLineItems")).toBe("add-line-item")
  })

  it("deduplicates colliding slugs deterministically", () => {
    const slugs = getApiRefTagOperationSlugs([
      { operationId: "A", summary: "Get a Cart" },
      { operationId: "B", summary: "Get a Cart" },
      { operationId: "C", summary: "Get a Cart" },
    ])

    expect(slugs.get("A")).toBe("get-a-cart")
    expect(slugs.get("B")).toBe("get-a-cart-2")
    expect(slugs.get("C")).toBe("get-a-cart-3")
  })

  it("avoids collision with the reserved schema slug", () => {
    const slugs = getApiRefTagOperationSlugs([
      { operationId: "A", summary: "Schema" },
    ])

    expect(slugs.get("A")).toBe("schema-2")
  })
})

describe("getApiRefPath", () => {
  it("builds tag and operation paths", () => {
    expect(getApiRefPath({ area: "store", section: "carts" })).toBe(
      "/store/carts"
    )
    expect(
      getApiRefPath({
        area: "store",
        section: "carts",
        operationSlug: "get-a-cart",
      })
    ).toBe("/store/carts/get-a-cart")
    expect(
      getApiRefPath({ area: "store", section: "carts", operationSlug: "schema" })
    ).toBe("/store/carts/schema")
  })
})
