import { SearchTypes } from "@medusajs/framework/types"
import {
  buildFacetQueries,
  buildIndexPlan,
  buildQueryPlan,
  fromSearchDocument,
  parseFacetResults,
  parseHighlights,
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
      facetable: { types: ["range", "stats"] },
    },
    tags: { type: "keyword", array: true, filterable: true, facetable: true },
    created_at: {
      type: "date",
      filterable: true,
      facetable: { types: ["stats"] },
    },
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

  it("builds a fuzzy index on searchable fields by default", () => {
    expect(plan.schema.title).toMatchObject({ fuzzy: true })
  })

  it("does not put glob on text fields unless they opt in", () => {
    const filterableText = buildIndexPlan({
      ...definition,
      fields: {
        ...definition.fields,
        title: {
          type: "text",
          searchable: true,
          filterable: true,
          sortable: true,
        },
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
      embedding: [0.1, 0.2, 0.3],
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
    expect(query.query.filters).toEqual([
      "title",
      "ContainsAllTokens",
      "red shoe",
    ])
    expect(query.query.limit).toBe(15)
  })

  it("ANDs the text match filter with attribute filters", () => {
    const query = buildQueryPlan(
      {
        index: definition,
        q: "chair",
        attributes_to_retrieve: ["title"],
        filters: { status: "published" },
      },
      plan
    )

    expect(query.query.filters).toEqual([
      "And",
      [
        ["status", "Eq", "published"],
        ["title", "ContainsAllTokens", "chair"],
      ],
    ])
  })

  it("uses ContainsAnyToken when match_strategy is any", () => {
    const query = buildQueryPlan(
      {
        index: definition,
        q: "red shoe",
        attributes_to_retrieve: ["title"],
        search_options: { match_strategy: "any" },
      },
      plan
    )

    expect(query.query.filters).toEqual([
      "title",
      "ContainsAnyToken",
      "red shoe",
    ])
  })

  it("sorts text matches by an attribute instead of BM25", () => {
    const query = buildQueryPlan(
      {
        index: definition,
        q: "chair",
        attributes_to_retrieve: ["title"],
        pagination: { order: { price: "ASC" } },
      },
      plan
    )

    expect(query.query.filters).toEqual(["title", "ContainsAllTokens", "chair"])
    expect(query.query.rank_by).toEqual(["price", "asc"])
  })

  it("keeps BM25 ranking when order is only _score", () => {
    const query = buildQueryPlan(
      {
        index: definition,
        q: "chair",
        attributes_to_retrieve: ["title"],
        pagination: { order: { _score: "DESC" } },
      },
      plan
    )

    expect(query.query.rank_by).toEqual([
      "Product",
      3,
      ["title", "BM25", "chair"],
    ])
  })

  it("ORs ContainsAllTokens across searchable fields for match_strategy all", () => {
    const multi = buildIndexPlan({
      ...definition,
      fields: {
        ...definition.fields,
        description: { type: "text", searchable: true },
      },
    })
    const query = buildQueryPlan(
      {
        index: definition,
        q: "red chair",
        attributes_to_retrieve: ["title"],
        search_options: { match_strategy: "all" },
      },
      multi
    )

    expect(query.query.filters).toEqual([
      "Or",
      [
        ["title", "ContainsAllTokens", "red chair"],
        ["description", "ContainsAllTokens", "red chair"],
      ],
    ])
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
    expect(query.query.filters).toEqual([
      "title",
      "ContainsAllTokens",
      "dtc sta",
      { last_as_prefix: true },
    ])
  })

  it("builds and parses value and range facet queries", () => {
    const input: SearchTypes.ProviderSearchQuery = {
      index: definition,
      attributes_to_retrieve: ["title"],
      search_options: {
        facets: [
          { field: "status", limit: 5 },
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

    expect(queries).toHaveLength(3)
    expect(queries[0].query.group_by).toEqual(["status"])
    expect(queries[0].query.top_k).toBe(10000)
    expect(queries[0].query).not.toHaveProperty("limit")
    expect(queries[1].query.group_by).toEqual([
      { value: ["ForEachUnique", "tags"] },
    ])
    expect(queries[1].query.top_k).toBe(10000)
    expect(queries[1].query).not.toHaveProperty("limit")
    expect(queries[0].query.filters).toBeUndefined()
    expect(
      parseFacetResults(queries, [
        {
          aggregation_groups: [
            { status: "published", count: 2 },
            { status: ["draft"], count: 1 },
          ],
        },
        {
          aggregation_groups: [
            { value: "shoe", count: 3 },
            { tags: ["sale"], count: 1 },
          ],
        },
        { aggregations: { count: 2 } },
      ])
    ).toEqual({
      status: {
        type: "value",
        values: [
          { value: "published", count: 2 },
          { value: "draft", count: 1 },
        ],
      },
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

  it("caps alphabetically sorted facet groups with top_k", () => {
    const queries = buildFacetQueries(
      {
        index: definition,
        attributes_to_retrieve: ["title"],
        search_options: {
          facets: [{ field: "status", sort: "alpha", limit: 5 }],
        },
      },
      plan
    )

    expect(queries[0].query.top_k).toBe(5)
    expect(queries[0].query).not.toHaveProperty("limit")
  })

  it("applies the text match filter to value and range facet queries", () => {
    const queries = buildFacetQueries(
      {
        index: definition,
        q: "chair",
        filters: { status: "published" },
        attributes_to_retrieve: ["title"],
        search_options: {
          facets: [
            { field: "tags" },
            {
              field: "price",
              type: "range",
              ranges: [{ key: "cheap", to: 100 }],
            },
          ],
        },
      },
      plan
    )

    const textAndStatus: unknown = [
      "And",
      [
        ["status", "Eq", "published"],
        ["title", "ContainsAllTokens", "chair"],
      ],
    ]

    expect(queries[0].query.filters).toEqual(textAndStatus)
    expect(queries[1].query.filters).toEqual([
      "And",
      [textAndStatus, ["price", "Lt", 100]],
    ])
  })

  it("builds stats facets as min/max rank queries plus a Count/Sum aggregation", () => {
    const queries = buildFacetQueries(
      {
        index: definition,
        q: "chair",
        attributes_to_retrieve: ["title"],
        search_options: {
          facets: [{ field: "price", type: "stats" }],
        },
      },
      plan
    )

    expect(queries).toHaveLength(3)
    expect(queries.map((query) => query.stats)).toEqual(["min", "max", "agg"])

    const present: unknown = [
      "And",
      [
        ["title", "ContainsAllTokens", "chair"],
        ["price", "NotEq", null],
      ],
    ]

    expect(queries[0].query).toEqual({
      rank_by: ["price", "asc"],
      limit: 1,
      include_attributes: ["price"],
      filters: present,
    })
    expect(queries[1].query).toEqual({
      rank_by: ["price", "desc"],
      limit: 1,
      include_attributes: ["price"],
      filters: present,
    })
    expect(queries[2].query).toEqual({
      aggregate_by: { count: ["Count"], sum: ["Sum", "price"] },
      filters: ["title", "ContainsAllTokens", "chair"],
    })
  })

  it("parses numeric stats facets and converts date min/max to epoch milliseconds", () => {
    const numeric = buildFacetQueries(
      {
        index: definition,
        attributes_to_retrieve: ["title"],
        search_options: { facets: [{ field: "price", type: "stats" }] },
      },
      plan
    )
    const dated = buildFacetQueries(
      {
        index: definition,
        attributes_to_retrieve: ["title"],
        search_options: { facets: [{ field: "created_at", type: "stats" }] },
      },
      plan
    )

    expect(dated[2].query.aggregate_by).toEqual({ count: ["Count"] })
    expect(
      parseFacetResults(numeric, [
        { rows: [{ id: "prod_1", price: 10 }] },
        { rows: [{ id: "prod_2", price: 80 }] },
        { aggregations: { count: 3, sum: 90 } },
      ])
    ).toEqual({
      price: { type: "stats", min: 10, max: 80, count: 3, sum: 90 },
    })
    expect(
      parseFacetResults(dated, [
        { rows: [{ id: "prod_1", created_at: "2024-01-15T00:00:00.000Z" }] },
        { rows: [{ id: "prod_2", created_at: "2024-06-01T00:00:00.000Z" }] },
        { aggregations: { count: 2 } },
      ])
    ).toEqual({
      created_at: {
        type: "stats",
        min: Date.parse("2024-01-15T00:00:00.000Z"),
        max: Date.parse("2024-06-01T00:00:00.000Z"),
        count: 2,
      },
    })
  })

  it("treats missing min/max rows as zero", () => {
    const queries = buildFacetQueries(
      {
        index: definition,
        attributes_to_retrieve: ["title"],
        search_options: { facets: [{ field: "price", type: "stats" }] },
      },
      plan
    )

    expect(
      parseFacetResults(queries, [
        { rows: [] },
        { rows: [] },
        { aggregations: { count: 0 } },
      ])
    ).toEqual({
      price: { type: "stats", min: 0, max: 0, count: 0 },
    })
  })

  it("rejects stats facets on non-numeric or array fields", () => {
    expect(() =>
      buildFacetQueries(
        {
          index: definition,
          attributes_to_retrieve: ["title"],
          search_options: { facets: [{ field: "status", type: "stats" }] },
        },
        plan
      )
    ).toThrow(/scalar numeric field/)
    expect(() =>
      buildFacetQueries(
        {
          index: definition,
          attributes_to_retrieve: ["title"],
          search_options: { facets: [{ field: "tags", type: "stats" }] },
        },
        plan
      )
    ).toThrow(/scalar numeric field/)
  })

  describe("typo tolerance", () => {
    it("disables the fuzzy index for attributes opted out at the index level", () => {
      const disabled = buildIndexPlan({
        ...definition,
        settings: {
          typo_tolerance: { disabled_on_attributes: ["title"] },
        },
      })
      expect(disabled.schema.title).not.toHaveProperty("fuzzy")
    })

    it("disables the fuzzy index entirely when typo tolerance is off", () => {
      const disabled = buildIndexPlan({
        ...definition,
        settings: { typo_tolerance: { enabled: false } },
      })
      expect(disabled.schema.title).not.toHaveProperty("fuzzy")
    })

    it("lets a field explicitly opt out of the fuzzy index", () => {
      const disabled = buildIndexPlan({
        ...definition,
        fields: {
          ...definition.fields,
          title: {
            type: "text",
            searchable: true,
            provider_options: { "search-medusa": { fuzzy: false } },
          },
        },
      })
      expect(disabled.schema.title).toMatchObject({ fuzzy: false })
    })

    it("boosts BM25 rank_by with a Fuzzy filter using the default edit-distance thresholds", () => {
      const query = buildQueryPlan(
        {
          index: definition,
          q: "shoo",
          attributes_to_retrieve: ["title"],
          search_options: { typo_tolerance: true },
        },
        plan
      )

      expect(query.query.rank_by).toEqual([
        "Sum",
        [
          ["Product", 3, ["title", "BM25", "shoo"]],
          [
            "Product",
            0.01,
            [
              "title",
              "Fuzzy",
              "shoo",
              {
                max_edit_distance: [
                  { min_query_chars: 6, distance: 1 },
                  { min_query_chars: 9, distance: 2 },
                ],
                case_sensitive: false,
              },
            ],
          ],
        ],
      ])
      expect(query.query.filters).toEqual([
        "Or",
        [
          ["title", "ContainsAllTokens", "shoo"],
          [
            "title",
            "Fuzzy",
            "shoo",
            {
              max_edit_distance: [
                { min_query_chars: 6, distance: 1 },
                { min_query_chars: 9, distance: 2 },
              ],
              case_sensitive: false,
            },
          ],
        ],
      ])
    })

    it("honors custom index-level edit-distance thresholds and requires every word to match", () => {
      const custom = buildIndexPlan({
        ...definition,
        settings: {
          typo_tolerance: {
            min_word_size_for_one_typo: 8,
            min_word_size_for_two_typos: 12,
          },
        },
      })

      const query = buildQueryPlan(
        {
          index: definition,
          q: "red shoo",
          attributes_to_retrieve: ["title"],
          search_options: { typo_tolerance: true },
        },
        custom
      )

      expect(query.query.rank_by).toEqual([
        "Sum",
        [
          ["Product", 3, ["title", "BM25", "red shoo"]],
          [
            "Product",
            0.01,
            [
              "And",
              [
                [
                  "title",
                  "Fuzzy",
                  "red",
                  {
                    max_edit_distance: [
                      { min_query_chars: 8, distance: 1 },
                      { min_query_chars: 12, distance: 2 },
                    ],
                    case_sensitive: false,
                  },
                ],
                [
                  "title",
                  "Fuzzy",
                  "shoo",
                  {
                    max_edit_distance: [
                      { min_query_chars: 8, distance: 1 },
                      { min_query_chars: 12, distance: 2 },
                    ],
                    case_sensitive: false,
                  },
                ],
              ],
            ],
          ],
        ],
      ])
    })

    it("clamps Fuzzy min_query_chars to Cloud's 3 * (distance + 1) floor", () => {
      const custom = buildIndexPlan({
        ...definition,
        settings: {
          typo_tolerance: {
            min_word_size_for_one_typo: 3,
            min_word_size_for_two_typos: 6,
          },
        },
      })

      const query = buildQueryPlan(
        {
          index: definition,
          q: "shoo",
          attributes_to_retrieve: ["title"],
          search_options: { typo_tolerance: true },
        },
        custom
      )

      const fuzzyClause = (query.query.rank_by as any)[1][1][2]
      expect(fuzzyClause[3].max_edit_distance).toEqual([
        { min_query_chars: 6, distance: 1 },
        { min_query_chars: 9, distance: 2 },
      ])
    })

    it("requires only one word to match when match_strategy is any", () => {
      const query = buildQueryPlan(
        {
          index: definition,
          q: "red shoo",
          attributes_to_retrieve: ["title"],
          search_options: { typo_tolerance: true, match_strategy: "any" },
        },
        plan
      )

      const fuzzyClause = (query.query.rank_by as any)[1][1][2]
      expect(fuzzyClause[0]).toBe("Or")
    })

    it("rejects typo tolerance when no searchable field has a fuzzy index", () => {
      const noFuzzy = buildIndexPlan({
        ...definition,
        settings: { typo_tolerance: { enabled: false } },
      })

      expect(() =>
        buildQueryPlan(
          {
            index: definition,
            q: "shoo",
            attributes_to_retrieve: ["title"],
            search_options: { typo_tolerance: true },
          },
          noFuzzy
        )
      ).toThrow(/no fuzzy-enabled fields/)
    })

    it("rejects typo tolerance without a text query", () => {
      expect(() =>
        buildQueryPlan(
          {
            index: definition,
            attributes_to_retrieve: ["title"],
            search_options: { typo_tolerance: true },
          },
          plan
        )
      ).toThrow(/require a text query/)
    })
  })

  describe("highlighting", () => {
    it("builds a Highlight compute_attributes expression with default tags", () => {
      const query = buildQueryPlan(
        {
          index: definition,
          q: "red",
          attributes_to_retrieve: ["title"],
          search_options: { highlight: { fields: ["title"] } },
        },
        plan
      )

      expect(query.query.compute_attributes).toEqual({
        __medusa_highlight_0__: [
          "Highlight",
          "title",
          {
            fragment_by: "none",
            rank_fragments_by: ["$fragment", "BM25", "red"],
            fragment_limit: 1,
            include_offsets: "utf-16",
          },
        ],
      })
      expect(query.highlight).toEqual({
        pre_tag: "<mark>",
        post_tag: "</mark>",
        fields: [{ path: "title", key: "__medusa_highlight_0__" }],
      })
    })

    it("crops fragments and honors custom tags when snippet is requested", () => {
      const query = buildQueryPlan(
        {
          index: definition,
          q: "red",
          attributes_to_retrieve: ["title"],
          search_options: {
            highlight: {
              fields: ["title"],
              pre_tag: "<b>",
              post_tag: "</b>",
              snippet: true,
            },
          },
        },
        plan
      )

      expect(query.query.compute_attributes?.__medusa_highlight_0__).toEqual([
        "Highlight",
        "title",
        {
          fragment_by: "sentence",
          rank_fragments_by: ["$fragment", "BM25", "red"],
          fragment_limit: 3,
          include_offsets: "utf-16",
        },
      ])
      expect(query.highlight).toMatchObject({
        pre_tag: "<b>",
        post_tag: "</b>",
      })
    })

    it("rejects highlighting a field that is not searchable", () => {
      expect(() =>
        buildQueryPlan(
          {
            index: definition,
            q: "red",
            attributes_to_retrieve: ["status"],
            search_options: { highlight: { fields: ["status"] } },
          },
          plan
        )
      ).toThrow(/not searchable/)
    })

    it("rejects highlighting without a text query", () => {
      expect(() =>
        buildQueryPlan(
          {
            index: definition,
            attributes_to_retrieve: ["title"],
            search_options: { highlight: { fields: ["title"] } },
          },
          plan
        )
      ).toThrow(/require a text query/)
    })

    it("tags matched ranges in returned fragments, applied back to front", () => {
      const highlighted = parseHighlights(
        {
          id: "prod_1",
          __medusa_highlight_0__: [
            {
              text: "Red running shoe",
              fragment_range: [0, 17],
              match_ranges: [
                [4, 11],
                [0, 3],
              ],
            },
          ],
        },
        {
          pre_tag: "<mark>",
          post_tag: "</mark>",
          fields: [{ path: "title", key: "__medusa_highlight_0__" }],
        }
      )

      expect(highlighted).toEqual({
        title: ["<mark>Red</mark> <mark>running</mark> shoe"],
      })
    })

    it("omits fields with no highlight fragments", () => {
      expect(
        parseHighlights(
          { id: "prod_1" },
          {
            pre_tag: "<mark>",
            post_tag: "</mark>",
            fields: [{ path: "title", key: "__medusa_highlight_0__" }],
          }
        )
      ).toBeUndefined()
    })
  })

  describe("vector search", () => {
    it("ranks by a client-supplied embedding", () => {
      const query = buildQueryPlan(
        {
          index: definition,
          attributes_to_retrieve: ["title"],
          search_options: {
            vector: { field: "embedding", value: [0.1, 0.2, 0.3] },
          },
        },
        plan
      )

      expect(query.query.rank_by).toEqual(["embedding", "ANN", [0.1, 0.2, 0.3]])
    })

    it("infers the vector field when the index has exactly one", () => {
      const query = buildQueryPlan(
        {
          index: definition,
          attributes_to_retrieve: ["title"],
          search_options: {
            vector: { value: [0.1, 0.2, 0.3] },
          },
        },
        plan
      )

      expect(query.query.rank_by).toEqual(["embedding", "ANN", [0.1, 0.2, 0.3]])
    })

    it("rejects vector.query when the field does not declare embed", () => {
      expect(() =>
        buildQueryPlan(
          {
            index: definition,
            attributes_to_retrieve: ["title"],
            search_options: {
              vector: { field: "embedding", query: "red shoes" },
            },
          },
          plan
        )
      ).toThrow(/declare "embed"/)
    })

    it("hybrids BM25 and ANN when a text query is also present", () => {
      const query = buildQueryPlan(
        {
          index: definition,
          q: "red shoe",
          attributes_to_retrieve: ["title"],
          search_options: {
            vector: { field: "embedding", value: [0.1, 0.2, 0.3] },
          },
        },
        plan
      )

      expect(query.query.rank_by).toEqual([
        "Sum",
        [
          ["Product", 0.5, ["Product", 3, ["title", "BM25", "red shoe"]]],
          ["Product", 0.5, ["embedding", "ANN", [0.1, 0.2, 0.3]]],
        ],
      ])
      expect(query.query.filters).toBeUndefined()
    })

    it("puts embed on the source field and omits the vector column", () => {
      const embedded = buildIndexPlan({
        ...definition,
        fields: {
          ...definition.fields,
          embedding: {
            type: "vector",
            dimensions: 3,
            embed: "title",
          },
        },
      })

      expect(embedded.schema.embedding).toBeUndefined()
      expect(embedded.schema.title).toEqual(
        expect.objectContaining({
          embed: { dims: 3 },
        })
      )

      const query = buildQueryPlan(
        {
          index: definition,
          attributes_to_retrieve: ["title"],
          search_options: {
            vector: { field: "embedding", query: "red shoes" },
          },
        },
        embedded
      )

      expect(query.query.rank_by).toEqual([
        "title",
        "ANN",
        ["Embed", "red shoes"],
      ])
    })

    it("ranks by a client-supplied embedding against an engine-embedded field", () => {
      const embedded = buildIndexPlan({
        ...definition,
        fields: {
          ...definition.fields,
          embedding: {
            type: "vector",
            dimensions: 3,
            embed: "title",
          },
        },
      })

      const query = buildQueryPlan(
        {
          index: definition,
          attributes_to_retrieve: ["title"],
          search_options: {
            vector: { field: "embedding", value: [0.1, 0.2, 0.3] },
          },
        },
        embedded
      )

      expect(query.query.rank_by).toEqual(["title", "ANN", [0.1, 0.2, 0.3]])
    })

    it("does not write client embeddings for engine-embedded fields", () => {
      const embedded = buildIndexPlan({
        ...definition,
        fields: {
          ...definition.fields,
          embedding: {
            type: "vector",
            dimensions: 3,
            embed: "title",
          },
        },
      })

      expect(
        toSearchDocument(
          {
            id: "prod_1",
            title: "Red shoe",
            embedding: [0.1, 0.2, 0.3],
          },
          embedded
        )
      ).not.toHaveProperty("embedding")
    })

    it("rejects client embeddings whose dimensions do not match", () => {
      expect(() =>
        toSearchDocument(
          {
            id: "prod_1",
            title: "Red shoe",
            embedding: [0.1, 0.2],
          },
          plan
        )
      ).toThrow(/expected 3 dimensions/)
    })
  })
})
