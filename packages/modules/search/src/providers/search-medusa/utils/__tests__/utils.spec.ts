import { SearchTypes } from "@medusajs/framework/types"
import {
  buildFacetQueries,
  buildIndexPlan,
  buildQueryPlan,
  fromSearchDocument,
  parseFacetResults,
  toSearchDocument,
  toSearchFilter,
} from ".."

const definition: SearchTypes.ResolvedSearchIndexDefinition = {
  name: "product",
  entity: "product",
  provider: "search-medusa",
  primary_key: "id",
  physical_name: "product",
  definition_hash: "hash",
  settings: {},
  fields: {
    id: { type: "keyword", filterable: true },
    title: { type: "text", searchable: { weight: 3 } },
    status: { type: "keyword", filterable: true, facetable: true },
    price: {
      type: "float",
      filterable: true,
      facetable: { types: ["range"] },
    },
    tags: { type: "keyword", array: true, filterable: true, facetable: true },
    created_at: { type: "date", filterable: true },
    variants: {
      type: "object",
      array: true,
      fields: {
        sku: { type: "keyword", filterable: true },
      },
    },
    embedding: { type: "vector", dimensions: 3 },
  },
  seed: async function* () {
    yield []
  },
}

describe("Medusa search utilities", () => {
  const plan = buildIndexPlan(definition)

  it("builds an explicit search schema", () => {
    expect(plan.schema).toMatchObject({
      id: { type: "string", filterable: true },
      title: { type: "string", full_text_search: true },
      status: { type: "string", filterable: true, glob: true },
      price: { type: "float", filterable: true },
      tags: { type: "[]string", filterable: true, glob: true },
      created_at: { type: "datetime", filterable: true },
      "variants.sku": { type: "[]string", filterable: true, glob: true },
      embedding: { type: "[3]f32", ann: true },
    })
    expect(plan.schema.id).not.toHaveProperty("glob")
    expect(plan.schema.title).not.toHaveProperty("glob")
  })

  it("does not put glob on text fields unless they opt in", () => {
    const filterableText = buildIndexPlan({
      ...definition,
      fields: {
        ...definition.fields,
        title: { type: "text", searchable: true, filterable: true, sortable: true },
      },
    })
    expect(filterableText.schema.title).not.toHaveProperty("glob")

    const optedIn = buildIndexPlan({
      ...definition,
      fields: {
        ...definition.fields,
        title: {
          type: "text",
          searchable: true,
          provider_options: { "search-medusa": { glob: true } },
        },
      },
    })
    expect(optedIn.schema.title).toMatchObject({ glob: true })
  })

  it("skips glob on the document id even when requested", () => {
    const withGlob = buildIndexPlan({
      ...definition,
      fields: {
        ...definition.fields,
        id: {
          type: "keyword",
          filterable: true,
          provider_options: { "search-medusa": { glob: true } },
        },
      },
    })

    expect(withGlob.schema.id).not.toHaveProperty("glob")
  })

  it("lets a field opt out of glob", () => {
    const withoutGlob = buildIndexPlan({
      ...definition,
      fields: {
        ...definition.fields,
        status: {
          type: "keyword",
          filterable: true,
          provider_options: { "search-medusa": { glob: false } },
        },
      },
    })

    expect(withoutGlob.schema.status).toMatchObject({ glob: false })
  })

  it("flattens documents and restores projected nested fields", () => {
    const row = toSearchDocument(
      {
        id: "prod_1",
        title: "Red shoe",
        created_at: new Date("2026-01-01T00:00:00.000Z"),
        variants: [{ sku: "red-41" }, { sku: "red-42" }],
        embedding: [0.1, 0.2, 0.3],
      },
      plan
    )

    expect(row).toMatchObject({
      id: "prod_1",
      created_at: "2026-01-01T00:00:00.000Z",
      "variants.sku": ["red-41", "red-42"],
    })
    expect(fromSearchDocument(row, ["title", "variants.sku"])).toEqual({
      title: "Red shoe",
      variants: { sku: ["red-41", "red-42"] },
    })
  })

  it("compiles logical, array and date filters", () => {
    expect(
      toSearchFilter(
        {
          $or: [{ status: "draft" }, { status: "published" }],
          tags: { $contains: ["shoe", "sale"] },
          created_at: { $gte: new Date("2026-01-01") },
        },
        plan
      )
    ).toEqual([
      "And",
      [
        [
          "Or",
          [
            ["status", "Eq", "draft"],
            ["status", "Eq", "published"],
          ],
        ],
        [
          "And",
          [
            ["tags", "Contains", "shoe"],
            ["tags", "Contains", "sale"],
          ],
        ],
        ["created_at", "Gte", "2026-01-01T00:00:00.000Z"],
      ],
    ])
  })

  it("builds weighted BM25 and offset over-fetching", () => {
    const query = buildQueryPlan(
      {
        index: definition,
        q: "red shoe",
        attributes_to_retrieve: ["title"],
        pagination: { skip: 10, take: 5 },
      },
      plan
    )

    expect(query.query.rank_by).toEqual([
      "Product",
      3,
      ["title", "BM25", "red shoe"],
    ])
    expect(query.query.limit).toBe(15)
  })

  it("passes last_as_prefix for match_strategy last", () => {
    const query = buildQueryPlan(
      {
        index: definition,
        q: "dtc sta",
        attributes_to_retrieve: ["title"],
        search_options: { match_strategy: "last" },
      },
      plan
    )

    expect(query.query.rank_by).toEqual([
      "Product",
      3,
      ["title", "BM25", "dtc sta", { last_as_prefix: true }],
    ])
  })

  it("builds and parses value and range facet queries", () => {
    const input: SearchTypes.ProviderSearchQuery = {
      index: definition,
      attributes_to_retrieve: ["title"],
      search_options: {
        facets: [
          { field: "tags", limit: 2 },
          {
            field: "price",
            type: "range",
            ranges: [{ key: "cheap", to: 100 }],
          },
        ],
      },
    }
    const queries = buildFacetQueries(input, plan)

    expect(queries).toHaveLength(2)
    expect(queries[0].query.group_by).toEqual([
      { value: ["ForEachUnique", "tags"] },
    ])
    expect(
      parseFacetResults(queries, [
        {
          aggregation_groups: [
            { value: "shoe", count: 3 },
            { value: "sale", count: 1 },
          ],
        },
        { aggregations: { count: 2 } },
      ])
    ).toEqual({
      tags: {
        type: "value",
        values: [
          { value: "shoe", count: 3 },
          { value: "sale", count: 1 },
        ],
      },
      price: {
        type: "range",
        ranges: [{ key: "cheap", from: undefined, to: 100, count: 2 }],
      },
    })
  })
})
