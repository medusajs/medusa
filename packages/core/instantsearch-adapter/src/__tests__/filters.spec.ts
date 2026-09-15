import {
  adaptFacetFilters,
  adaptNumericFilters,
  mergeFiltersAnd,
} from "../filters"

describe("adaptFacetFilters", () => {
  it("returns undefined for empty input", () => {
    expect(adaptFacetFilters(undefined)).toBeUndefined()
    expect(adaptFacetFilters([])).toBeUndefined()
  })

  it("maps a single equality filter", () => {
    expect(adaptFacetFilters("color:red")).toEqual({
      color: { $eq: "red" },
    })
  })

  it("ANDs sibling facet filters", () => {
    expect(adaptFacetFilters(["color:red", "brand:nike"])).toEqual({
      $and: [{ color: { $eq: "red" } }, { brand: { $eq: "nike" } }],
    })
  })

  it("ORs values in a nested group as $in when they share a field", () => {
    expect(
      adaptFacetFilters([["brand:nike", "brand:adidas"], "color:red"])
    ).toEqual({
      $and: [{ brand: { $in: ["nike", "adidas"] } }, { color: { $eq: "red" } }],
    })
  })

  it("maps excluded values to $ne / $nin", () => {
    expect(adaptFacetFilters("color:-red")).toEqual({
      color: { $ne: "red" },
    })
    expect(adaptFacetFilters([["brand:-nike", "brand:-adidas"]])).toEqual({
      brand: { $nin: ["nike", "adidas"] },
    })
  })

  it("does not treat numeric negatives as exclusions", () => {
    expect(adaptFacetFilters("rating:-1")).toEqual({
      rating: { $eq: -1 },
    })
  })

  it("ORs values across different fields", () => {
    expect(adaptFacetFilters([["color:red", "brand:nike"]])).toEqual({
      $or: [{ color: { $eq: "red" } }, { brand: { $eq: "nike" } }],
    })
  })

  it("splits on the first colon so values may contain colons", () => {
    expect(adaptFacetFilters("url:https://example.com")).toEqual({
      url: { $eq: "https://example.com" },
    })
  })
})

describe("adaptNumericFilters", () => {
  it("maps comparison operators", () => {
    expect(
      adaptNumericFilters(["price>=10", "price<=100", "rating>3"])
    ).toEqual({
      price: { $gte: 10, $lte: 100 },
      rating: { $gt: 3 },
    })
  })

  it("ORs nested numeric filters", () => {
    expect(adaptNumericFilters([["rating>=4", "rating=5"]])).toEqual({
      $or: [{ rating: { $gte: 4 } }, { rating: { $eq: 5 } }],
    })
  })

  it("throws on an invalid numeric filter", () => {
    expect(() => adaptNumericFilters("price")).toThrow(/invalid numeric filter/)
  })
})

describe("mergeFiltersAnd", () => {
  it("ANDs constraints and keeps the free-text query", () => {
    expect(
      mergeFiltersAnd(
        { q: "shoes", color: { $eq: "red" } },
        { sales_channel_id: { $eq: "sc_1" } }
      )
    ).toEqual({
      q: "shoes",
      $and: [{ color: { $eq: "red" } }, { sales_channel_id: { $eq: "sc_1" } }],
    })
  })
})
