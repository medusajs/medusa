import { FieldParser } from "../field-parser"

describe("FieldParser", () => {
  it("strips whitespace left behind by a modifier", () => {
    // `?fields=%2B%20orders.customer.email` reaches the parser as
    // `+ orders.customer.email`. Leaving the space in would produce the field
    // ` orders.customer.email`, which the disallow filters no longer recognise.
    const { fields } = FieldParser.parse("+ orders.customer.email", ["title"])

    expect(Array.from(fields)).toEqual(["title", "orders.customer.email", "id"])
  })

  it("strips whitespace left behind by a modifier when replacing defaults", () => {
    const { fields } = FieldParser.parse("+ orders.id,title", ["handle"])

    expect(Array.from(fields)).toEqual(["orders.id", "title", "id"])
  })

  it("still removes a field through a spaced out minus modifier", () => {
    const { fields } = FieldParser.parse("- orders", ["title", "orders"])

    expect(Array.from(fields)).toEqual(["title", "id"])
  })

  it("drops field paths with unsafe prototype-pollution segments", () => {
    const protoFn = Object.prototype.toString

    const { fields } = FieldParser.parse(
      "__proto__.allowUnauthenticated.id,constructor.prototype.polluted,countries.iso_2",
      ["title"]
    )

    expect(Array.from(fields)).toEqual(["countries.iso_2", "id"])
    expect(Object.prototype["allowUnauthenticated"]).toBeUndefined()
    expect(Object.prototype["polluted"]).toBeUndefined()
    expect(Object.prototype.toString).toBe(protoFn)
  })
})
