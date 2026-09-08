import { DisallowedFieldFilter } from "../field-validator"

const contextFor = (fields: string[], starFields: string[] = []) => ({
  entity: "product",
  parsedFields: {
    fields: new Set(fields),
    starFields: new Set(starFields),
  },
})

describe("DisallowedFieldFilter", () => {
  it("matches an exact segment anywhere in the path", () => {
    const filter = new DisallowedFieldFilter({ disallowed: ["orders"] })

    expect(
      filter.getNotAllowedFields(
        contextFor(["id", "orders.customer.email", "collection.orders"])
      )
    ).toEqual(["orders.customer.email", "collection.orders"])
  })

  it("doesn't match a segment that merely contains a disallowed segment", () => {
    const filter = new DisallowedFieldFilter({ disallowed: ["order"] })

    expect(filter.getNotAllowedFields(contextFor(["order_id"]))).toEqual([])
  })

  it("matches every link entity through a regex entry", () => {
    const filter = new DisallowedFieldFilter({ disallowed: [/_link$/] })

    expect(
      filter.getNotAllowedFields(
        contextFor([
          "id",
          "order_link.order.email",
          "payment_collection_link.payment_collection.amount",
        ])
      )
    ).toEqual([
      "order_link.order.email",
      "payment_collection_link.payment_collection.amount",
    ])
  })

  it("applies regex entries to star fields as well", () => {
    const filter = new DisallowedFieldFilter({ disallowed: [/_link$/] })

    expect(
      filter.getNotAllowedFields(contextFor(["id"], ["cart_link.cart"]))
    ).toEqual(["cart_link.cart"])
  })

  it("tests a regex entry against each segment on its own", () => {
    const filter = new DisallowedFieldFilter({ disallowed: [/_link$/] })

    expect(
      filter.getNotAllowedFields(contextFor(["order.link", "linked_items"]))
    ).toEqual([])
  })

  it("mixes string and regex entries", () => {
    const filter = new DisallowedFieldFilter({
      disallowed: ["orders", /^inventory/],
    })

    expect(
      filter.getNotAllowedFields(
        contextFor(["id", "orders.id", "variants.inventory_items.id", "title"])
      )
    ).toEqual(["orders.id", "variants.inventory_items.id"])
  })

  it("tests a regex entry against the full path so a relation's position is expressible", () => {
    const filter = new DisallowedFieldFilter({
      disallowed: [/\.orders(?:\.|$)/],
    })

    expect(
      filter.getNotAllowedFields(
        contextFor([
          "orders.id",
          "orders.region.orders.email",
          "orders.customer.orders",
        ])
      )
    ).toEqual(["orders.region.orders.email", "orders.customer.orders"])
  })

  it("leaves a root segment untouched when the regex requires a preceding separator", () => {
    const filter = new DisallowedFieldFilter({
      disallowed: [/\.orders(?:\.|$)/],
    })

    expect(
      filter.getNotAllowedFields(contextFor(["orders"], ["orders.items"]))
    ).toEqual([])
  })

  it("matches regardless of casing", () => {
    const filter = new DisallowedFieldFilter({
      disallowed: ["orders", /_link$/],
    })

    expect(
      filter.getNotAllowedFields(
        contextFor(["Orders.customer.email", "order_Link.order"], ["ORDERS"])
      )
    ).toEqual(["Orders.customer.email", "order_Link.order", "ORDERS"])
  })

  it("matches through compatibility characters and stray whitespace", () => {
    const filter = new DisallowedFieldFilter({ disallowed: ["orders"] })

    expect(
      filter.getNotAllowedFields(
        // U+FF4F FULLWIDTH LATIN SMALL LETTER O, and a tab around a segment
        contextFor(["\uFF4Frders.customer.email", "region.\torders\t.email"])
      )
    ).toEqual(["\uFF4Frders.customer.email", "region.\torders\t.email"])
  })

  it("doesn't let a stateful regex change a field's outcome", () => {
    const filter = new DisallowedFieldFilter({ disallowed: [/_link$/g] })

    expect(
      filter.getNotAllowedFields(
        contextFor(["order_link.order", "cart_link.cart"])
      )
    ).toEqual(["order_link.order", "cart_link.cart"])
  })
})
