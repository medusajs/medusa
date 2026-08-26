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
      () =>
        new MedusaSearchService(
          {},
          { api_key: "medusa_test" } as any
        )
    ).toThrow(/explicit "endpoint"/)
    expect(
      () =>
        new MedusaSearchService(
          {},
          {
            api_key: "medusa_test",
            endpoint: "https://search.medusa.example",
          } as any
        )
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
          aggregation_groups: [{ value: "published", count: 1 }],
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
    expect(sentQuery.compute_attributes).toHaveProperty(
      "__medusa_highlight_0__"
    )
  })
})
