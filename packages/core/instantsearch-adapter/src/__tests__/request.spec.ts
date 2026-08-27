import {
  adaptFacetSearchRequest,
  adaptSearchRequest,
  parseIndexName,
} from "../request"

describe("parseIndexName", () => {
  it("returns the entity when no sort suffix is present", () => {
    expect(parseIndexName("product")).toEqual({ entity: "product" })
  })

  it("parses a Typesense-style sort suffix", () => {
    expect(parseIndexName("product/sort/min_price:asc")).toEqual({
      entity: "product",
      order: { min_price: "ASC" },
    })
  })

  it("parses multiple sort fields and maps score to _score", () => {
    expect(parseIndexName("product/sort/min_price:desc,_score:desc")).toEqual({
      entity: "product",
      order: { min_price: "DESC", _score: "DESC" },
    })
  })
})

describe("adaptSearchRequest", () => {
  it("maps query, pagination, facets, and filters", () => {
    expect(
      adaptSearchRequest(
        {
          indexName: "product",
          params: {
            query: "shoes",
            page: 2,
            hitsPerPage: 10,
            facets: ["brand", "min_price"],
            maxValuesPerFacet: 20,
            facetFilters: [["brand:nike", "brand:adidas"]],
            numericFilters: ["min_price>=10", "min_price<=100"],
            attributesToRetrieve: ["title", "handle"],
            attributesToHighlight: ["title"],
            highlightPreTag: "__ais-highlight__",
            highlightPostTag: "__/ais-highlight__",
            restrictSearchableAttributes: ["title", "description"],
            typoTolerance: false,
          },
        },
        {
          numericAttributes: ["min_price"],
        }
      )
    ).toEqual({
      entity: "product",
      fields: ["title", "handle"],
      filters: {
        q: "shoes",
        $and: [
          { brand: { $in: ["nike", "adidas"] } },
          { min_price: { $gte: 10, $lte: 100 } },
        ],
      },
      pagination: {
        skip: 20,
        take: 10,
      },
      search_options: {
        facets: [
          { field: "brand", type: "value", limit: 20 },
          { field: "min_price", type: "stats" },
        ],
        highlight: {
          fields: ["title"],
          pre_tag: "__ais-highlight__",
          post_tag: "__/ais-highlight__",
        },
        attributes_to_search_on: ["title", "description"],
        typo_tolerance: false,
      },
    })
  })

  it("applies sort from the index name", () => {
    expect(
      adaptSearchRequest({
        indexName: "product/sort/min_price:asc",
        params: { query: "hat" },
      })
    ).toEqual({
      entity: "product",
      filters: { q: "hat" },
      pagination: {
        skip: 0,
        take: 20,
        order: { min_price: "ASC" },
      },
    })
  })

  it("ANDs additional and index-specific filters without overriding pagination", () => {
    expect(
      adaptSearchRequest(
        {
          indexName: "product",
          params: { query: "bag", page: 1, hitsPerPage: 8 },
        },
        {
          additionalSearchParameters: {
            filters: { status: { $eq: "published" } },
            pagination: { take: 50 },
            search_options: { match_strategy: "last" },
          },
          indexSpecificSearchParameters: {
            product: {
              filters: { sales_channel_id: { $eq: "sc_1" } },
            },
          },
        }
      )
    ).toEqual({
      entity: "product",
      filters: {
        q: "bag",
        $and: [
          { status: { $eq: "published" } },
          { sales_channel_id: { $eq: "sc_1" } },
        ],
      },
      pagination: {
        skip: 8,
        take: 8,
      },
      search_options: {
        match_strategy: "last",
      },
    })
  })

  it("parses URL-encoded InstantSearch params", () => {
    expect(
      adaptSearchRequest({
        indexName: "product",
        params: "query=coat&page=1&hitsPerPage=5&facets=%5B%22brand%22%5D",
      })
    ).toEqual({
      entity: "product",
      filters: { q: "coat" },
      pagination: { skip: 5, take: 5 },
      search_options: {
        facets: [{ field: "brand", type: "value" }],
      },
    })
  })

  it("maps InstantSearch's string facets param to a stats request", () => {
    expect(
      adaptSearchRequest(
        {
          indexName: "product",
          params: {
            query: "shoes",
            facets: "min_price",
            hitsPerPage: 0,
            page: 0,
          },
        },
        { numericAttributes: ["min_price"] }
      )
    ).toEqual({
      entity: "product",
      filters: { q: "shoes" },
      pagination: { skip: 0, take: 0 },
      search_options: {
        facets: [{ field: "min_price", type: "stats" }],
      },
    })
  })

  it("sets distinct from the configured attribute", () => {
    expect(
      adaptSearchRequest(
        {
          indexName: "product",
          params: { distinct: true },
        },
        { distinctAttribute: "handle" }
      ).search_options
    ).toEqual({ distinct: "handle" })
  })
})

describe("adaptFacetSearchRequest", () => {
  it("requests a value facet with the typed query and no hits", () => {
    expect(
      adaptFacetSearchRequest({
        indexName: "product",
        params: {
          query: "shoe",
          facetName: "brand",
          facetQuery: "ni",
          maxFacetHits: 7,
          facetFilters: ["color:red"],
        },
      })
    ).toEqual({
      entity: "product",
      filters: {
        q: "shoe",
        color: { $eq: "red" },
      },
      pagination: { skip: 0, take: 0 },
      search_options: {
        facets: [{ field: "brand", type: "value", query: "ni", limit: 7 }],
      },
    })
  })
})
