import { SearchTypes } from "@medusajs/framework/types"
import { CloudServiceError } from "../../utils"
import { MedusaSearchService } from "../medusa-search"

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
    title: { type: "text", searchable: true },
    status: { type: "keyword", filterable: true, facetable: true },
  },
  seed: async function* () {
    yield []
  },
}

const createService = () =>
  new MedusaSearchService(
    {},
    {
      api_key: "medusa_test",
      endpoint: "https://search.medusa.example",
      environment_handle: "test-env",
    }
  )

describe("MedusaSearchService", () => {
  it("requires Cloud credentials from provider options", () => {
    expect(() => new MedusaSearchService({}, {} as any)).toThrow(
      /explicit "api_key"/
    )
    expect(
      () => new MedusaSearchService({}, { api_key: "medusa_test" } as any)
    ).toThrow(/explicit "endpoint"/)
    expect(
      () =>
        new MedusaSearchService({}, {
          api_key: "medusa_test",
          endpoint: "https://search.medusa.example",
        } as any)
    ).toThrow(/environment_handle/)
  })

  it("creates missing indexes through the explicit create endpoint", async () => {
    const service = createService()
    const metadata = jest
      .fn()
      .mockRejectedValue(
        new CloudServiceError(
          "not_found",
          "not_found",
          {},
          "Index not found",
          404
        )
      )
    const createIndex = jest.fn().mockResolvedValue(undefined)
    const index = jest.fn(() => ({ metadata }))
    ;(service as any).client_ = { createIndex, index }

    await expect(service.upsertIndex({ index: definition })).resolves.toEqual({
      index: "product",
      status: "succeeded",
    })

    expect(createIndex).toHaveBeenCalledWith({
      name: "product",
      schema: expect.objectContaining({
        title: expect.objectContaining({ full_text_search: true }),
      }),
      distance_metric: undefined,
      sharding: undefined,
    })
  })

  it("recreates indexes when a vector attribute is added", async () => {
    const service = createService()
    const withEmbedding: SearchTypes.ResolvedSearchIndexDefinition = {
      ...definition,
      fields: {
        ...definition.fields,
        embedding: { type: "vector", dimensions: 768, embed: true },
      },
    }
    const metadata = jest.fn().mockResolvedValue({
      schema: {
        id: { type: "string" },
        title: { type: "string" },
        status: { type: "string" },
      },
    })
    const deleteAll = jest.fn().mockResolvedValue(undefined)
    const updateSchema = jest.fn()
    const createIndex = jest.fn().mockResolvedValue(undefined)
    const index = jest.fn(() => ({ deleteAll, metadata, updateSchema }))
    ;(service as any).client_ = { createIndex, index }

    await service.upsertIndex({ index: withEmbedding })

    expect(deleteAll).toHaveBeenCalledTimes(1)
    expect(updateSchema).not.toHaveBeenCalled()
    expect(createIndex).toHaveBeenCalledWith(
      expect.objectContaining({
        name: "product",
        schema: expect.objectContaining({
          embedding: expect.objectContaining({ type: "[768]f32" }),
        }),
      })
    )
  })

  it("recreates indexes with incompatible schemas through the create endpoint", async () => {
    const service = createService()
    const metadata = jest.fn().mockResolvedValue({
      schema: {
        id: { type: "string" },
        title: { type: "int" },
        status: { type: "string" },
      },
    })
    const deleteAll = jest.fn().mockResolvedValue(undefined)
    const createIndex = jest.fn().mockResolvedValue(undefined)
    const index = jest.fn(() => ({ deleteAll, metadata }))
    ;(service as any).client_ = { createIndex, index }

    await service.upsertIndex({ index: definition })

    expect(deleteAll).toHaveBeenCalledTimes(1)
    expect(createIndex).toHaveBeenCalledWith(
      expect.objectContaining({
        name: "product",
        schema: expect.objectContaining({
          title: expect.objectContaining({ type: "string" }),
        }),
      })
    )
  })

  it("passes Medusa index names through unchanged", async () => {
    const service = createService()
    const write = jest.fn().mockResolvedValue({ status: "OK" })
    const multiQuery = jest.fn().mockResolvedValue({
      results: [{ rows: [] }, { aggregations: { count: 0 } }],
      billing: {},
      performance: { server_total_ms: 1 },
    })
    const deleteAll = jest.fn().mockResolvedValue(undefined)
    const index = jest.fn(() => ({ write, multiQuery, deleteAll }))
    ;(service as any).client_ = { index }

    await service.upsertDocuments({
      index: "product",
      definition,
      documents: [{ id: "prod_1", title: "Red shoe", status: "published" }],
    })
    await service.search({
      index: definition,
      attributes_to_retrieve: ["title"],
    })
    await service.deleteIndex({ index: "product" })

    expect(index).toHaveBeenNthCalledWith(1, "product")
    expect(index).toHaveBeenNthCalledWith(2, "product")
    expect(index).toHaveBeenNthCalledWith(3, "product")
  })

  it("lists indexes from metadata without per-index Count queries", async () => {
    const service = createService()
    const metadata = jest
      .fn()
      .mockResolvedValueOnce({
        approx_row_count: 12,
        created_at: "2026-01-01T00:00:00.000Z",
        updated_at: "2026-01-02T00:00:00.000Z",
      })
      .mockResolvedValueOnce({
        approx_row_count: 0,
        created_at: "2026-01-03T00:00:00.000Z",
        updated_at: "2026-01-04T00:00:00.000Z",
      })
    const query = jest.fn()
    const index = jest.fn(() => ({ metadata, query }))
    const indexes = jest.fn(async function* () {
      yield { id: "product" }
      yield { id: "order" }
    })

    ;(service as any).client_ = { indexes, index }

    await expect(service.listIndexes()).resolves.toEqual([
      {
        name: "product",
        provider: "search-medusa",
        document_count: 12,
        created_at: new Date("2026-01-01T00:00:00.000Z"),
        updated_at: new Date("2026-01-02T00:00:00.000Z"),
      },
      {
        name: "order",
        provider: "search-medusa",
        document_count: 0,
        created_at: new Date("2026-01-03T00:00:00.000Z"),
        updated_at: new Date("2026-01-04T00:00:00.000Z"),
      },
    ])
    expect(indexes).toHaveBeenCalledWith()
    expect(metadata).toHaveBeenCalledTimes(2)
    expect(query).not.toHaveBeenCalled()
  })

  it("sends the schema on document writes", async () => {
    const service = createService()
    const write = jest.fn().mockResolvedValue({ status: "OK" })
    ;(service as any).client_ = {
      index: jest.fn(() => ({ write })),
    }

    await service.upsertDocuments({
      index: "product",
      definition,
      documents: [{ id: "prod_1", title: "Red shoe", status: "published" }],
    })

    expect(write).toHaveBeenCalledWith(
      expect.objectContaining({
        upsert_rows: [
          expect.objectContaining({ id: "prod_1", title: "Red shoe" }),
        ],
        schema: expect.objectContaining({
          title: expect.objectContaining({ full_text_search: true }),
        }),
      })
    )
  })

  it("maps multi-query hits, counts and value facets", async () => {
    const service = createService()
    const multiQuery = jest.fn().mockResolvedValue({
      results: [
        { rows: [{ id: "prod_1", title: "Red shoe", $dist: 1.5 }] },
        { aggregations: { count: 1 } },
        {
          aggregation_groups: [{ status: "published", count: 1 }],
        },
      ],
      billing: {},
      performance: { server_total_ms: 4 },
    })
    ;(service as any).client_ = {
      index: jest.fn(() => ({ multiQuery })),
    }

    await expect(
      service.search({
        index: definition,
        q: "red",
        attributes_to_retrieve: ["title"],
        search_options: {
          include_score: true,
          facets: [{ field: "status" }],
        },
      })
    ).resolves.toMatchObject({
      hits: [
        {
          id: "prod_1",
          score: 1.5,
          document: { title: "Red shoe" },
        },
      ],
      facets: {
        status: {
          type: "value",
          values: [{ value: "published", count: 1 }],
        },
      },
      metadata: { count: 1, processing_time_ms: 4 },
    })

    const [hitsQuery, countQuery, facetQuery] =
      multiQuery.mock.calls[0][0].queries
    const textFilter = ["title", "ContainsAllTokens", "red"]
    expect(hitsQuery.filters).toEqual(textFilter)
    expect(countQuery.filters).toEqual(textFilter)
    expect(facetQuery.filters).toEqual(textFilter)
    expect(facetQuery.group_by).toEqual(["status"])
    expect(facetQuery.top_k).toBe(10000)
    expect(facetQuery).not.toHaveProperty("limit")
  })

  it("boosts typo-tolerant matches into rank_by and surfaces highlighted fragments", async () => {
    const service = createService()
    const multiQuery = jest.fn().mockResolvedValue({
      results: [
        {
          rows: [
            {
              id: "prod_1",
              title: "Red running shoe",
              __medusa_highlight_0__: [
                {
                  text: "Red running shoe",
                  match_ranges: [[4, 11]],
                },
              ],
            },
          ],
        },
        { aggregations: { count: 1 } },
      ],
      billing: {},
      performance: { server_total_ms: 2 },
    })
    ;(service as any).client_ = {
      index: jest.fn(() => ({ multiQuery })),
    }

    const result = await service.search({
      index: definition,
      q: "runing",
      attributes_to_retrieve: ["title"],
      search_options: {
        typo_tolerance: true,
        highlight: { fields: ["title"] },
      },
    })

    expect(result.hits).toEqual([
      {
        id: "prod_1",
        score: undefined,
        document: { title: "Red running shoe" },
        highlights: { title: ["Red <mark>running</mark> shoe"] },
      },
    ])

    const sentQuery = multiQuery.mock.calls[0][0].queries[0]
    expect(sentQuery.rank_by[0]).toBe("Sum")
    expect(sentQuery.rank_by[1][1][2][3].max_edit_distance).toEqual([
      { min_query_chars: 6, distance: 1 },
      { min_query_chars: 9, distance: 2 },
    ])
    expect(sentQuery.compute_attributes).toHaveProperty(
      "__medusa_highlight_0__"
    )
  })

  it("maps stats facets from min/max rank queries and separate Count and Sum aggregations", async () => {
    const service = createService()
    const priced: SearchTypes.ResolvedSearchIndexDefinition = {
      ...definition,
      fields: {
        ...definition.fields,
        price: {
          type: "float",
          filterable: true,
          facetable: { types: ["stats"] },
        },
      },
    }
    const multiQuery = jest.fn().mockResolvedValue({
      results: [
        { rows: [{ id: "prod_1", title: "Red shoe", price: 20 }] },
        { aggregations: { count: 2 } },
        { rows: [{ id: "prod_1", price: 10 }] },
        { rows: [{ id: "prod_2", price: 40 }] },
        { aggregations: { count: 2 } },
        { aggregations: { sum: 50 } },
      ],
      billing: {},
      performance: { server_total_ms: 5 },
    })
    ;(service as any).client_ = {
      index: jest.fn(() => ({ multiQuery })),
    }

    await expect(
      service.search({
        index: priced,
        attributes_to_retrieve: ["title", "price"],
        search_options: {
          facets: [{ field: "price", type: "stats" }],
        },
      })
    ).resolves.toMatchObject({
      facets: {
        price: { type: "stats", min: 10, max: 40, count: 2, sum: 50 },
      },
      metadata: { count: 2, processing_time_ms: 5 },
    })

    const queries = multiQuery.mock.calls[0][0].queries
    expect(queries).toHaveLength(6)
    expect(queries[2]).toMatchObject({
      rank_by: ["price", "asc"],
      limit: 1,
      include_attributes: ["price"],
    })
    expect(queries[2].filters).toEqual(["price", "NotEq", null])
    expect(queries[3]).toMatchObject({
      rank_by: ["price", "desc"],
      limit: 1,
    })
    expect(queries[4].aggregate_by).toEqual({ count: ["Count"] })
    expect(queries[5].aggregate_by).toEqual({ sum: ["Sum", "price"] })
  })

  it("packs searchMany into one multiQuery per index", async () => {
    const service = createService()
    const multiQuery = jest.fn().mockResolvedValue({
      results: [
        { rows: [{ id: "prod_1", title: "Red shoe" }] },
        { aggregations: { count: 1 } },
        { rows: [{ id: "prod_2", title: "Blue shirt" }] },
        { aggregations: { count: 1 } },
      ],
      billing: {},
      performance: { server_total_ms: 3 },
    })
    ;(service as any).client_ = {
      index: jest.fn(() => ({ multiQuery })),
    }

    const results = await service.searchMany([
      {
        index: definition,
        q: "red",
        attributes_to_retrieve: ["title"],
      },
      {
        index: definition,
        q: "blue",
        attributes_to_retrieve: ["title"],
      },
    ])

    expect(multiQuery).toHaveBeenCalledTimes(1)
    expect(multiQuery.mock.calls[0][0].queries).toHaveLength(4)
    expect(results).toHaveLength(2)
    expect(results[0].hits[0]).toMatchObject({ id: "prod_1" })
    expect(results[1].hits[0]).toMatchObject({ id: "prod_2" })
    expect(results[0].metadata.count).toBe(1)
    expect(results[1].metadata.count).toBe(1)
  })

  it("skips hits and count for facet-only searchMany extras", async () => {
    const service = createService()
    const multiQuery = jest.fn().mockResolvedValue({
      results: [
        { rows: [{ id: "prod_1", title: "Red shoe" }] },
        { aggregations: { count: 1 } },
        {
          aggregation_groups: [{ status: "published", count: 2 }],
        },
      ],
      billing: {},
      performance: { server_total_ms: 2 },
    })
    ;(service as any).client_ = {
      index: jest.fn(() => ({ multiQuery })),
    }

    const results = await service.searchMany([
      {
        index: definition,
        q: "red",
        attributes_to_retrieve: ["title"],
      },
      {
        index: definition,
        attributes_to_retrieve: ["title"],
        pagination: { skip: 0, take: 0 },
        search_options: {
          count: "none",
          facets: [{ field: "status" }],
        },
      },
    ])

    expect(multiQuery).toHaveBeenCalledTimes(1)
    // hits + count for the first query, facet only for the second
    expect(multiQuery.mock.calls[0][0].queries).toHaveLength(3)
    expect(results[0].hits).toHaveLength(1)
    expect(results[1].hits).toEqual([])
    expect(results[1].metadata.count).toBeNull()
    expect(results[1].facets).toMatchObject({
      status: { type: "value" },
    })
  })
})
