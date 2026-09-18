import type {
  ItemTaxLineDTO,
  LineItemTaxLineDTO,
  ShippingMethodTaxLineDTO,
  ShippingTaxLineDTO,
} from "@medusajs/framework/types"
import {
  normalizeItemTaxLinesForCart,
  normalizeShippingTaxLinesForCart,
} from "../upsert-tax-lines-for-items"

describe("normalizeItemTaxLinesForCart", () => {
  it("should pair a second combinable tax line for the same item with its own existing row instead of collapsing onto the first", () => {
    // A single item with two tax lines already persisted from a previous
    // calculation - e.g. a combinable regional rate plus its parent's rate.
    const existingTaxLines = [
      {
        id: "calitxl_region",
        item_id: "item_1",
        tax_rate_id: "txr_region",
      },
      {
        id: "calitxl_parent",
        item_id: "item_1",
        tax_rate_id: "txr_parent",
      },
    ] as LineItemTaxLineDTO[]

    // The recalculated tax lines for the same item, in the opposite order
    // from how they're stored, to rule out the bug only failing to show up
    // because of a lucky ordering match.
    const newTaxLines = [
      {
        line_item_id: "item_1",
        rate_id: "txr_parent",
        rate: 5,
        code: "PARENT",
        name: "Parent tax",
        provider_id: "system",
      },
      {
        line_item_id: "item_1",
        rate_id: "txr_region",
        rate: 10,
        code: "REGION",
        name: "Region tax",
        provider_id: "system",
      },
    ] as ItemTaxLineDTO[]

    const result = normalizeItemTaxLinesForCart(newTaxLines, existingTaxLines)

    expect(result).toHaveLength(2)

    const parentLine = result.find((r) => r.tax_rate_id === "txr_parent")
    const regionLine = result.find((r) => r.tax_rate_id === "txr_region")

    // Each new line has to keep the id of *its own* existing row - not both
    // resolving to the same id, which would make the upsert treat them as
    // the same row and silently drop one of the two tax lines.
    expect((parentLine as any)?.id).toEqual("calitxl_parent")
    expect((regionLine as any)?.id).toEqual("calitxl_region")
  })

  it("should still create both rows the first time, when there is no existing tax line for the item yet", () => {
    const newTaxLines = [
      {
        line_item_id: "item_1",
        rate_id: "txr_parent",
        rate: 5,
        code: "PARENT",
        name: "Parent tax",
        provider_id: "system",
      },
      {
        line_item_id: "item_1",
        rate_id: "txr_region",
        rate: 10,
        code: "REGION",
        name: "Region tax",
        provider_id: "system",
      },
    ] as ItemTaxLineDTO[]

    const result = normalizeItemTaxLinesForCart(newTaxLines, [])

    expect(result).toHaveLength(2)
    expect(result.every((r) => (r as any).id === undefined)).toBe(true)
  })
})

describe("normalizeShippingTaxLinesForCart", () => {
  it("should pair a second combinable tax line for the same shipping method with its own existing row", () => {
    const existingTaxLines = [
      {
        id: "castl_region",
        shipping_method_id: "sm_1",
        tax_rate_id: "txr_region",
      },
      {
        id: "castl_parent",
        shipping_method_id: "sm_1",
        tax_rate_id: "txr_parent",
      },
    ] as ShippingMethodTaxLineDTO[]

    const newTaxLines = [
      {
        shipping_line_id: "sm_1",
        rate_id: "txr_parent",
        rate: 5,
        code: "PARENT",
        name: "Parent tax",
        provider_id: "system",
      },
      {
        shipping_line_id: "sm_1",
        rate_id: "txr_region",
        rate: 10,
        code: "REGION",
        name: "Region tax",
        provider_id: "system",
      },
    ] as ShippingTaxLineDTO[]

    const result = normalizeShippingTaxLinesForCart(
      newTaxLines,
      existingTaxLines
    )

    expect(result).toHaveLength(2)

    const parentLine = result.find((r) => r.tax_rate_id === "txr_parent")
    const regionLine = result.find((r) => r.tax_rate_id === "txr_region")

    expect((parentLine as any)?.id).toEqual("castl_parent")
    expect((regionLine as any)?.id).toEqual("castl_region")
  })
})
