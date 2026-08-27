import { createInstantSearchAdapter } from "../adapter"
import { PUBLISHABLE_KEY_HEADER } from "../types"
import type { SearchQuery, SearchResult } from "../types"

const emptyResult = (overrides: Partial<SearchResult> = {}): SearchResult => ({
  hits: [],
  metadata: { skip: 0, take: 20, count: 0, query: "" },
  ...overrides,
})

describe("createInstantSearchAdapter", () => {
  it("requires a transport option", () => {
    expect(() => createInstantSearchAdapter({})).toThrow(
      /provide `sdk`, `requester`, or `baseUrl`/
    )
  })

  it("translates InstantSearch requests and returns adapted results", async () => {
    const requester = jest.fn(async (queries: SearchQuery[]) => {
      expect(queries).toEqual([
        {
          entity: "product",
          filters: { q: "shoe" },
          pagination: { skip: 0, take: 20 },
        },
      ])
      return [
        emptyResult({
          hits: [
            {
              id: "prod_1",
              document: { title: "Trail shoe" },
            },
          ],
          metadata: { skip: 0, take: 20, count: 1, query: "shoe" },
        }),
      ]
    })

    const { searchClient } = createInstantSearchAdapter({ requester })
    const { results } = await searchClient.search([
      { indexName: "product", params: { query: "shoe" } },
    ])

    expect(results).toHaveLength(1)
    expect(results[0].hits[0]).toMatchObject({
      objectID: "prod_1",
      title: "Trail shoe",
    })
    expect(results[0].nbHits).toEqual(1)
  })

  it("skips the backend for empty queries when placeholderSearch is false", async () => {
    const requester = jest.fn(async () => [emptyResult()])
    const { searchClient } = createInstantSearchAdapter({
      requester,
      placeholderSearch: false,
    })

    const { results } = await searchClient.search([
      { indexName: "product", params: { query: "" } },
    ])

    expect(requester).not.toHaveBeenCalled()
    expect(results[0].hits).toEqual([])
    expect(results[0].nbHits).toEqual(0)
  })

  it("applies transformQuery and transformResponse", async () => {
    const requester = jest.fn(async (queries: SearchQuery[]) => {
      expect(queries[0].search_options).toEqual({ include_score: true })
      return [
        emptyResult({
          hits: [{ id: "prod_1", document: { title: "Hat" } }],
          metadata: { skip: 0, take: 20, count: 1 },
        }),
      ]
    })

    const { searchClient } = createInstantSearchAdapter({
      requester,
      transformQuery: (query) => ({
        ...query,
        search_options: { ...query.search_options, include_score: true },
      }),
      transformResponse: (response) => ({
        ...response,
        userData: [{ banner: true }],
      }),
    })

    const { results } = await searchClient.search([
      { indexName: "product", params: { query: "hat" } },
    ])

    expect((results[0] as { userData?: unknown }).userData).toEqual([
      { banner: true },
    ])
  })

  it("batches multi-index InstantSearch requests", async () => {
    const requester = jest.fn(async (queries: SearchQuery[]) => {
      expect(queries.map((query) => query.entity)).toEqual([
        "product",
        "category",
      ])
      return [
        emptyResult({
          hits: [{ id: "prod_1", document: { title: "A" } }],
          metadata: { skip: 0, take: 20, count: 1 },
        }),
        emptyResult({
          hits: [{ id: "cat_1", document: { name: "B" } }],
          metadata: { skip: 0, take: 20, count: 1 },
        }),
      ]
    })

    const { searchClient } = createInstantSearchAdapter({ requester })
    const { results } = await searchClient.search([
      { indexName: "product", params: { query: "a" } },
      { indexName: "category", params: { query: "a" } },
    ])

    expect(results[0].hits[0].objectID).toEqual("prod_1")
    expect(results[1].hits[0].objectID).toEqual("cat_1")
  })

  it("maps InstantSearch range widget hits and disjunctive stats queries", async () => {
    const requester = jest.fn(async (queries: SearchQuery[]) => {
      expect(queries).toEqual([
        {
          entity: "product",
          filters: { min_price: { $gte: 10, $lte: 50 } },
          pagination: { skip: 0, take: 20 },
          search_options: {
            facets: [{ field: "min_price", type: "stats" }],
          },
        },
        {
          entity: "product",
          pagination: { skip: 0, take: 0 },
          search_options: {
            facets: [{ field: "min_price", type: "stats" }],
          },
        },
      ])
      return [
        emptyResult({
          hits: [{ id: "prod_1", document: { title: "Shoe" } }],
          facets: {
            min_price: { type: "stats", min: 10, max: 50, count: 1, sum: 40 },
          },
          metadata: { skip: 0, take: 20, count: 1 },
        }),
        emptyResult({
          facets: {
            min_price: { type: "stats", min: 10, max: 80, count: 3, sum: 140 },
          },
          metadata: { skip: 0, take: 0, count: 3 },
        }),
      ]
    })

    const { searchClient } = createInstantSearchAdapter({
      requester,
      numericAttributes: ["min_price"],
    })

    const { results } = await searchClient.search([
      {
        indexName: "product",
        params: {
          facets: ["min_price"],
          numericFilters: ["min_price>=10", "min_price<=50"],
        },
      },
      {
        indexName: "product",
        params: {
          facets: "min_price",
          hitsPerPage: 0,
          page: 0,
        },
      },
    ])

    expect(results[0].nbHits).toEqual(1)
    expect(results[0].facets_stats).toEqual({
      min_price: { min: 10, max: 50, sum: 40 },
    })
    expect(results[1].facets).toEqual({ min_price: {} })
    expect(results[1].facets_stats).toEqual({
      min_price: { min: 10, max: 80, sum: 140 },
    })
  })

  it("maps searchForFacetValues", async () => {
    const requester = jest.fn(async (queries: SearchQuery[]) => {
      expect(queries[0].search_options?.facets).toEqual([
        { field: "brand", type: "value", query: "ni", limit: 10 },
      ])
      return [
        emptyResult({
          facets: {
            brand: {
              type: "value",
              values: [{ value: "Nike", count: 4 }],
            },
          },
        }),
      ]
    })

    const { searchClient } = createInstantSearchAdapter({ requester })
    const results = await searchClient.searchForFacetValues([
      {
        indexName: "product",
        params: { facetName: "brand", facetQuery: "ni" },
      },
    ])

    expect(results[0].facetHits).toEqual([
      { value: "Nike", highlighted: "<mark>Ni</mark>ke", count: 4 },
    ])
  })

  it("caches repeated search requests until clearCache", async () => {
    const requester = jest.fn(async () => [
      emptyResult({
        hits: [{ id: "prod_1", document: {} }],
        metadata: { skip: 0, take: 20, count: 1 },
      }),
    ])
    const { searchClient } = createInstantSearchAdapter({
      requester,
      cacheSearchResultsForSeconds: 60,
    })
    const request = [{ indexName: "product", params: { query: "cached" } }]

    await searchClient.search(request)
    await searchClient.search(request)
    expect(requester).toHaveBeenCalledTimes(1)

    searchClient.clearCache()
    await searchClient.search(request)
    expect(requester).toHaveBeenCalledTimes(2)
  })

  it("posts { queries } through the JS SDK client", async () => {
    const fetch = jest.fn(async () => ({
      results: [
        emptyResult({
          hits: [{ id: "prod_1", document: { title: "SDK" } }],
          metadata: { skip: 0, take: 20, count: 1 },
        }),
      ],
    }))

    const { searchClient } = createInstantSearchAdapter({
      sdk: { client: { fetch } },
      headers: { "x-custom": "1" },
    })

    await searchClient.search([
      { indexName: "product", params: { query: "sdk" } },
    ])

    expect(fetch).toHaveBeenCalledWith("/store/search", {
      method: "POST",
      body: {
        queries: [
          {
            entity: "product",
            filters: { q: "sdk" },
            pagination: { skip: 0, take: 20 },
          },
        ],
      },
      headers: { "x-custom": "1" },
    })
  })

  it("posts with a publishable API key when using native fetch", async () => {
    const fetchMock = jest.fn(async () => ({
      ok: true,
      json: async () => ({
        results: [
          emptyResult({
            hits: [{ id: "prod_1", document: {} }],
            metadata: { skip: 0, take: 20, count: 1 },
          }),
        ],
      }),
    }))
    const originalFetch = global.fetch
    global.fetch = fetchMock as unknown as typeof fetch

    try {
      const { searchClient } = createInstantSearchAdapter({
        baseUrl: "http://localhost:9000",
        publishableApiKey: "pk_test",
      })

      await searchClient.search([
        { indexName: "product", params: { query: "fetch" } },
      ])

      expect(fetchMock).toHaveBeenCalledWith(
        "http://localhost:9000/store/search",
        expect.objectContaining({
          method: "POST",
          headers: expect.objectContaining({
            [PUBLISHABLE_KEY_HEADER]: "pk_test",
          }),
        })
      )
    } finally {
      global.fetch = originalFetch
    }
  })
})
