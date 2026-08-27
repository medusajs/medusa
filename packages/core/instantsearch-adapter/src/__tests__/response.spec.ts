import { adaptFacetSearchResponse, adaptSearchResponse } from "../response"
import type { SearchResult } from "../types"

const result = (overrides: Partial<SearchResult> = {}): SearchResult => ({
  hits: [],
  metadata: { skip: 0, take: 20, count: 0 },
  ...overrides,
})

describe("adaptSearchResponse", () => {
  it("flattens documents and maps pagination, facets, and highlights", () => {
    const adapted = adaptSearchResponse(
      result({
        hits: [
          {
            id: "prod_1",
            score: 12,
            document: { title: "Red shoes", handle: "red-shoes" },
            highlights: { title: ["<mark>Red</mark> shoes"] },
          },
        ],
        facets: {
          brand: {
            type: "value",
            values: [
              { value: "nike", count: 4 },
              { value: "adidas", count: 2 },
            ],
          },
          min_price: {
            type: "stats",
            min: 10,
            max: 80,
            avg: 30,
            sum: 90,
            count: 3,
          },
        },
        metadata: {
          skip: 20,
          take: 10,
          count: 35,
          query: "red",
          processing_time_ms: 8,
        },
      }),
      {
        indexName: "product",
        params: {
          page: 2,
          hitsPerPage: 10,
          query: "red",
          highlightPreTag: "__ais-highlight__",
          highlightPostTag: "__/ais-highlight__",
        },
      }
    )

    expect(adapted).toMatchObject({
      hits: [
        {
          objectID: "prod_1",
          title: "Red shoes",
          handle: "red-shoes",
          _score: 12,
          _highlightResult: {
            title: {
              value: "__ais-highlight__Red__/ais-highlight__ shoes",
              matchLevel: "full",
              matchedWords: ["Red"],
            },
          },
        },
      ],
      nbHits: 35,
      page: 2,
      nbPages: 4,
      hitsPerPage: 10,
      processingTimeMS: 8,
      query: "red",
      index: "product",
      exhaustiveNbHits: true,
      facets: {
        brand: { nike: 4, adidas: 2 },
        min_price: {},
      },
      facets_stats: {
        min_price: { min: 10, max: 80, avg: 30, sum: 90 },
      },
    })
    expect(adapted.hits[0].objectID).toEqual("prod_1")
  })

  it("exposes stats facets under both facets and facets_stats for InstantSearch range widgets", () => {
    const adapted = adaptSearchResponse(
      result({
        facets: {
          min_price: {
            type: "stats",
            min: 50,
            max: 200,
            sum: 350,
            count: 3,
          },
        },
        metadata: { skip: 0, take: 0, count: 3 },
      }),
      {
        indexName: "product",
        params: { facets: "min_price", hitsPerPage: 0 },
      }
    )

    expect(adapted.facets).toEqual({ min_price: {} })
    expect(adapted.facets_stats).toEqual({
      min_price: { min: 50, max: 200, sum: 350 },
    })
  })

  it("nests dotted highlight paths", () => {
    const adapted = adaptSearchResponse(
      result({
        hits: [
          {
            id: "prod_1",
            document: {},
            highlights: { "variants.sku": ["<mark>SKU</mark>"] },
          },
        ],
        metadata: { skip: 0, take: 20, count: 1 },
      }),
      { indexName: "product", params: {} }
    )

    expect(adapted.hits[0]._highlightResult).toEqual({
      variants: {
        sku: {
          value: "<mark>SKU</mark>",
          matchLevel: "full",
          matchedWords: ["SKU"],
        },
      },
    })
  })

  it("puts highlights on _snippetResult when snippets were requested", () => {
    const adapted = adaptSearchResponse(
      result({
        hits: [
          {
            id: "prod_1",
            document: {},
            highlights: { description: ["a <mark>red</mark> shoe"] },
          },
        ],
        metadata: { skip: 0, take: 20, count: 1 },
      }),
      {
        indexName: "product",
        params: { attributesToSnippet: ["description:20"] },
      }
    )

    expect(adapted.hits[0]._snippetResult).toBeDefined()
    expect(adapted.hits[0]._highlightResult).toBeUndefined()
  })
})

describe("adaptFacetSearchResponse", () => {
  it("maps value facets to InstantSearch facet hits", () => {
    expect(
      adaptFacetSearchResponse(
        result({
          facets: {
            brand: {
              type: "value",
              values: [
                { value: "Nike", count: 3 },
                { value: "Adidas", count: 1 },
              ],
            },
          },
          metadata: { skip: 0, take: 0, count: 0, processing_time_ms: 2 },
        }),
        {
          indexName: "product",
          params: { facetName: "brand", facetQuery: "ni" },
        }
      )
    ).toEqual({
      facetHits: [
        { value: "Nike", highlighted: "<mark>Ni</mark>ke", count: 3 },
        { value: "Adidas", highlighted: "Adidas", count: 1 },
      ],
      exhaustiveFacetsCount: true,
      processingTimeMS: 2,
    })
  })
})
