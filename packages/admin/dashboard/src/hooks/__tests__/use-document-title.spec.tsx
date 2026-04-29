import { createElement } from "react"
import type { UIMatch } from "react-router-dom"
import { describe, expect, it } from "vitest"

import {
  getTitleFromBreadcrumb,
  getTitleFromRouteData,
} from "../use-document-title"

const buildMatch = (overrides: Partial<UIMatch> = {}): UIMatch =>
  ({
    id: "match",
    pathname: "/",
    params: {},
    data: undefined,
    handle: undefined,
    ...overrides,
  } as UIMatch)

describe("getTitleFromRouteData", () => {
  it.each([null, undefined, 42, "string", true])(
    "returns null for non-object input (%s)",
    (input) => {
      expect(getTitleFromRouteData(input)).toBeNull()
    }
  )

  it("returns null when no recognized entity is present", () => {
    expect(getTitleFromRouteData({ unknown: { foo: "bar" } })).toBeNull()
  })

  it("extracts product title", () => {
    expect(
      getTitleFromRouteData({ product: { title: "Medusa Sweatpants" } })
    ).toBe("Medusa Sweatpants")
  })

  it("formats order display_id with a leading hash", () => {
    expect(getTitleFromRouteData({ order: { display_id: 12345 } })).toBe(
      "#12345"
    )
  })

  it("ignores non-numeric order display_id", () => {
    expect(
      getTitleFromRouteData({ order: { display_id: "not-a-number" } })
    ).toBeNull()
  })

  describe("customer", () => {
    it("uses full name when first and last are present", () => {
      expect(
        getTitleFromRouteData({
          customer: {
            first_name: "Tony",
            last_name: "Stark",
            email: "tony@stark.io",
          },
        })
      ).toBe("Tony Stark")
    })

    it("uses first name only when last name is missing", () => {
      expect(
        getTitleFromRouteData({
          customer: { first_name: "Tony", email: "tony@stark.io" },
        })
      ).toBe("Tony")
    })

    it("falls back to email when no name is set", () => {
      expect(
        getTitleFromRouteData({ customer: { email: "tony@stark.io" } })
      ).toBe("tony@stark.io")
    })
  })

  it("extracts collection title", () => {
    expect(
      getTitleFromRouteData({ collection: { title: "Latest drops" } })
    ).toBe("Latest drops")
  })

  it("extracts product_category name", () => {
    expect(
      getTitleFromRouteData({ product_category: { name: "Pants" } })
    ).toBe("Pants")
  })

  it("extracts promotion code", () => {
    expect(getTitleFromRouteData({ promotion: { code: "SUMMER25" } })).toBe(
      "SUMMER25"
    )
  })

  it("extracts campaign name", () => {
    expect(getTitleFromRouteData({ campaign: { name: "Black Friday" } })).toBe(
      "Black Friday"
    )
  })

  it("extracts price_list title", () => {
    expect(getTitleFromRouteData({ price_list: { title: "VIP pricing" } })).toBe(
      "VIP pricing"
    )
  })

  it("extracts customer_group name", () => {
    expect(
      getTitleFromRouteData({ customer_group: { name: "Wholesale" } })
    ).toBe("Wholesale")
  })

  it("extracts region name", () => {
    expect(getTitleFromRouteData({ region: { name: "EU" } })).toBe("EU")
  })

  it("extracts sales_channel name", () => {
    expect(
      getTitleFromRouteData({ sales_channel: { name: "Web Store" } })
    ).toBe("Web Store")
  })

  it("extracts stock_location name", () => {
    expect(
      getTitleFromRouteData({ stock_location: { name: "Main Warehouse" } })
    ).toBe("Main Warehouse")
  })

  describe("inventory_item", () => {
    it("uses title when present", () => {
      expect(
        getTitleFromRouteData({
          inventory_item: { title: "Cotton T-Shirt", sku: "TSHIRT-001" },
        })
      ).toBe("Cotton T-Shirt")
    })

    it("falls back to sku when title is missing", () => {
      expect(
        getTitleFromRouteData({ inventory_item: { sku: "TSHIRT-001" } })
      ).toBe("TSHIRT-001")
    })
  })

  it("extracts reservation id", () => {
    expect(
      getTitleFromRouteData({ reservation: { id: "res_01HXYZ" } })
    ).toBe("res_01HXYZ")
  })

  it("extracts api_key title", () => {
    expect(
      getTitleFromRouteData({ api_key: { title: "Backend integration" } })
    ).toBe("Backend integration")
  })

  describe("tax_region", () => {
    it("prefers province_code uppercased", () => {
      expect(
        getTitleFromRouteData({
          tax_region: { country_code: "us", province_code: "ca" },
        })
      ).toBe("CA")
    })

    it("falls back to country_code uppercased", () => {
      expect(
        getTitleFromRouteData({ tax_region: { country_code: "fr" } })
      ).toBe("FR")
    })
  })

  describe("user", () => {
    it("uses full name when present", () => {
      expect(
        getTitleFromRouteData({
          user: {
            first_name: "Bruce",
            last_name: "Wayne",
            email: "bruce@wayne.inc",
          },
        })
      ).toBe("Bruce Wayne")
    })

    it("falls back to email", () => {
      expect(getTitleFromRouteData({ user: { email: "alfred@wayne.inc" } })).toBe(
        "alfred@wayne.inc"
      )
    })
  })

  it("extracts product_type value", () => {
    expect(
      getTitleFromRouteData({ product_type: { value: "Apparel" } })
    ).toBe("Apparel")
  })

  it("extracts product_tag value", () => {
    expect(getTitleFromRouteData({ product_tag: { value: "summer" } })).toBe(
      "summer"
    )
  })

  it("extracts workflow_execution workflow_id", () => {
    expect(
      getTitleFromRouteData({
        workflow_execution: { workflow_id: "create-order" },
      })
    ).toBe("create-order")
  })

  it("extracts variant title", () => {
    expect(getTitleFromRouteData({ variant: { title: "Black / M" } })).toBe(
      "Black / M"
    )
  })

  it("extracts shipping_profile name", () => {
    expect(
      getTitleFromRouteData({ shipping_profile: { name: "Default" } })
    ).toBe("Default")
  })

  it("does not match when the entity field is not an object", () => {
    expect(getTitleFromRouteData({ product: "not-an-object" })).toBeNull()
  })
})

describe("getTitleFromBreadcrumb", () => {
  it("returns null when handle is undefined", () => {
    expect(getTitleFromBreadcrumb(undefined, buildMatch())).toBeNull()
  })

  it("returns null when handle has no breadcrumb function", () => {
    expect(getTitleFromBreadcrumb({}, buildMatch())).toBeNull()
  })

  it("returns the breadcrumb string when the function returns a string", () => {
    const handle = { breadcrumb: () => "Products" }
    expect(getTitleFromBreadcrumb(handle, buildMatch())).toBe("Products")
  })

  it("falls back to route data when breadcrumb returns a React element", () => {
    const handle = { breadcrumb: () => createElement("span", null, "Hidden") }
    const match = buildMatch({
      data: { product: { title: "Medusa Sweatpants" } },
    })
    expect(getTitleFromBreadcrumb(handle, match)).toBe("Medusa Sweatpants")
  })

  it("returns null when breadcrumb returns a React element but data is unrecognized", () => {
    const handle = { breadcrumb: () => createElement("span", null, "Hidden") }
    expect(
      getTitleFromBreadcrumb(handle, buildMatch({ data: { unknown: 1 } }))
    ).toBeNull()
  })

  it("returns null when the breadcrumb function throws", () => {
    const handle = {
      breadcrumb: () => {
        throw new Error("boom")
      },
    }
    expect(getTitleFromBreadcrumb(handle, buildMatch())).toBeNull()
  })

  it("returns null when breadcrumb returns a non-string, non-element value", () => {
    const handle = { breadcrumb: () => 42 as unknown as string }
    expect(getTitleFromBreadcrumb(handle, buildMatch())).toBeNull()
  })
})
