import { search } from "@medusajs/framework/utils"
import { translateGraphFilters } from "../translate-graph-filters"

const index = {
  fields: search
    .define({
      id: search.keyword().filterable(),
      status: search.keyword().filterable(),
      created_at: search.date().filterable(),
      variants: search
        .object({
          sku: search.keyword().filterable(),
          color: search.keyword().filterable(),
        })
        .array(),
      // Flat field standing in for a graph path that does not match its name.
      variant_titles: search
        .keyword()
        .array()
        .filterable()
        .graphPath("variants.title"),
    })
    .toFields(),
} as any

const translate = (filters: any) => translateGraphFilters({ filters, index })

describe("translateGraphFilters", () => {
  it("flattens a nested group into dotted paths", () => {
    expect(translate({ variants: { sku: "ZEPHYR-M" } })).toEqual({
      "variants.sku": "ZEPHYR-M",
    })
  })

  it("leaves flat paths and an already-dotted key alone", () => {
    expect(
      translate({ status: ["published"], "variants.sku": "ZEPHYR-M" })
    ).toEqual({ status: ["published"], "variants.sku": "ZEPHYR-M" })
  })

  it("keeps q at the root, and never treats it as a field", () => {
    expect(translate({ q: "shirt", variants: { sku: "A" } })).toEqual({
      q: "shirt",
      "variants.sku": "A",
    })
  })

  it("does not descend into an operator map", () => {
    expect(translate({ created_at: { $gte: "2020-01-01" } })).toEqual({
      created_at: { $gte: "2020-01-01" },
    })
  })

  it("leaves an operator with no index equivalent for validation to name", () => {
    // `$ilike` is not a `SearchOperatorMap` key. Mistaking it for a field group
    // would produce the path "status.$ilike" and a confusing error.
    expect(translate({ status: { $ilike: "pub%" } })).toEqual({
      status: { $ilike: "pub%" },
    })
  })

  it("applies graph_path in place of the field's own path", () => {
    expect(translate({ variants: { title: "M" } })).toEqual({
      variant_titles: "M",
    })
  })

  it("prefers a mapped path over descending, when both would apply", () => {
    // "variants.title" is mapped, so it is a leaf even though the value looks
    // like a group.
    expect(translate({ variants: { title: { $in: ["M", "L"] } } })).toEqual({
      variant_titles: { $in: ["M", "L"] },
    })
  })

  it("recurses through $and / $or / $not, scoping each branch", () => {
    expect(
      translate({
        $and: [{ variants: { sku: "A" } }, { status: "published" }],
      })
    ).toEqual({
      $and: [{ "variants.sku": "A" }, { status: "published" }],
    })

    expect(translate({ $not: { variants: { color: "red" } } })).toEqual({
      $not: { "variants.color": "red" },
    })
  })

  it("allows the same path in sibling branches but not within one", () => {
    expect(
      translate({
        $or: [{ variants: { sku: "A" } }, { variants: { sku: "B" } }],
      })
    ).toEqual({
      $or: [{ "variants.sku": "A" }, { "variants.sku": "B" }],
    })

    // Both spellings land on "variant_titles" in the same group.
    expect(() =>
      translate({ variant_titles: "M", variants: { title: "L" } })
    ).toThrow(/maps to "variant_titles"/)
  })

  it("passes through a path the index does not hold, rather than dropping it", () => {
    expect(translate({ collection_id: ["pcol_1"] })).toEqual({
      collection_id: ["pcol_1"],
    })
  })

  it("leaves values that are not field groups untouched", () => {
    const date = new Date("2020-01-01")
    expect(translate({ created_at: date, status: null, id: [] })).toEqual({
      created_at: date,
      status: null,
      id: [],
    })
  })
})
