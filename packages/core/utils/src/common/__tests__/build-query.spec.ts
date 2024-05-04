import { buildSelects } from "../build-query"

describe("buildSelects", () => {
  it("successfully build back select object shape to list", () => {
    const q = buildSelects([
      "order",
      "order.items",
      "order.swaps",
      "order.swaps.additional_items",
      "order.discounts",
      "order.discounts.rule",
      "order.claims",
      "order.claims.additional_items",
      "additional_items",
      "additional_items.variant",
      "return_order",
      "return_order.items",
      "return_order.shipping_method",
      "return_order.shipping_method.tax_lines",
    ])

    expect(q).toEqual({
      order: {
        items: true,
        swaps: {
          additional_items: true,
        },
        discounts: {
          rule: true,
        },
        claims: {
          additional_items: true,
        },
      },
      additional_items: {
        variant: true,
      },
      return_order: {
        items: true,
        shipping_method: {
          tax_lines: true,
        },
      },
    })
  })
})

describe("buildSelects", () => {
  it("successfully build back select object shape to list", () => {
    const q = buildSelects([
      "order",
      "order.items",
      "order.swaps",
      "order.swaps.additional_items",
      "order.discounts",
      "order.discounts.rule",
      "order.claims",
      "order.claims.additional_items",
      "additional_items",
      "additional_items.variant",
      "return_order",
      "return_order.items",
      "return_order.shipping_method",
      "return_order.shipping_method.tax_lines",
    ])

    expect(q).toEqual({
      order: {
        items: true,
        swaps: {
          additional_items: true,
        },
        discounts: {
          rule: true,
        },
        claims: {
          additional_items: true,
        },
      },
      additional_items: {
        variant: true,
      },
      return_order: {
        items: true,
        shipping_method: {
          tax_lines: true,
        },
      },
    })
  })
})
