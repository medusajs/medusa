import { buildOrder, buildSelects } from "../build-query"

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

describe("buildOrder", () => {
  it("builds a nested order object from dotted keys", () => {
    const q = buildOrder({
      id: "ASC",
      "items.title": "ASC",
      "items.variant.title": "DESC",
    })

    expect(q).toEqual({
      id: "ASC",
      items: {
        title: "ASC",
        variant: {
          title: "DESC",
        },
      },
    })
  })

  it("does not pollute the object prototype through a __proto__ order key", () => {
    expect(Object.prototype["ignoreExpiration"]).toBeUndefined()

    const q = buildOrder({ "__proto__.ignoreExpiration": "ASC" })

    expect(Object.prototype["ignoreExpiration"]).toBeUndefined()
    expect({}["ignoreExpiration"]).toBeUndefined()
    expect(q).toEqual({})
  })

  it("skips constructor and prototype keys", () => {
    const q = buildOrder({
      "constructor.prototype.polluted": "ASC",
      "items.prototype.polluted": "ASC",
      id: "ASC",
    })

    expect(Object.prototype["polluted"]).toBeUndefined()
    expect(q).toEqual({ id: "ASC" })
  })
})

describe("buildSelects prototype pollution", () => {
  it("does not pollute the object prototype through unsafe path segments", () => {
    expect(Object.prototype["polluted"]).toBeUndefined()

    const q = buildSelects([
      "__proto__.polluted",
      "order.__proto__.polluted",
      "order.items",
    ])

    expect(Object.prototype["polluted"]).toBeUndefined()
    expect({}["polluted"]).toBeUndefined()
    expect(q).toEqual({
      order: {
        items: true,
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
