import { getRelationsDepth, validateRelationsLimit } from "../relations-limit"

describe("getRelationsDepth", () => {
  it("returns 0 for a property of the queried entity", () => {
    expect(getRelationsDepth("id")).toEqual(0)
  })

  it("doesn't count the last segment of a regular field", () => {
    expect(getRelationsDepth("variants.title")).toEqual(1)
    expect(getRelationsDepth("items.product.tags.id")).toEqual(3)
  })

  it("counts every segment of a star field", () => {
    expect(getRelationsDepth("*variants")).toEqual(1)
    expect(getRelationsDepth("variants.*")).toEqual(1)
    expect(getRelationsDepth("*items.variant.product")).toEqual(3)
    expect(getRelationsDepth("items.variant.product.*")).toEqual(3)
  })
})

describe("validateRelationsLimit", () => {
  it("doesn't throw when all fields are within the limit", () => {
    expect(() =>
      validateRelationsLimit(["id", "variants.options.*", "collection.id"], 2)
    ).not.toThrow()
  })

  it("throws and lists every field exceeding the limit", () => {
    expect(() =>
      validateRelationsLimit(
        ["id", "items.product.tags.id", "items.variant.product.*"],
        2
      )
    ).toThrow(
      "The following fields expand more than the maximum of 2 allowed relations: items.product.tags.id, items.variant.product.*"
    )
  })
})
