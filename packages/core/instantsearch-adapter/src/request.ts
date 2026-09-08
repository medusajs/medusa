import {
  adaptFacetFilters,
  adaptNumericFilters,
  mergeFiltersAnd,
  withQuery,
} from "./filters"
import type {
  InstantSearchAdapterOptions,
  InstantSearchRequest,
  InstantSearchSearchParams,
  SearchFacetRequest,
  SearchHighlightOptions,
  SearchOptions,
  SearchOrderBy,
  SearchPagination,
  SearchQuery,
} from "./types"

const SORT_SUFFIX = /^(.*)\/sort\/(.+)$/

export function parseSearchParams(
  params?: InstantSearchSearchParams | string
): InstantSearchSearchParams {
  if (!params) {
    return {}
  }
  if (typeof params !== "string") {
    return params
  }

  const search = new URLSearchParams(params)
  const result: Record<string, unknown> = {}

  for (const [key, value] of search.entries()) {
    if (
      key === "page" ||
      key === "hitsPerPage" ||
      key === "maxValuesPerFacet" ||
      key === "maxFacetHits"
    ) {
      result[key] = Number(value)
      continue
    }

    if (key === "typoTolerance" || key === "distinct") {
      if (value === "true") {
        result[key] = true
      } else if (value === "false") {
        result[key] = false
      } else if (!Number.isNaN(Number(value)) && value !== "") {
        result[key] = Number(value)
      } else {
        result[key] = value
      }
      continue
    }

    if (
      key === "facetFilters" ||
      key === "numericFilters" ||
      key === "facets" ||
      key === "attributesToRetrieve" ||
      key === "attributesToHighlight" ||
      key === "attributesToSnippet" ||
      key === "restrictSearchableAttributes"
    ) {
      result[key] = parseMaybeJson(value)
      continue
    }

    result[key] = value
  }

  return result as InstantSearchSearchParams
}

function parseMaybeJson(value: string): unknown {
  try {
    return JSON.parse(value)
  } catch {
    return value
  }
}

export function stringifyParams(params: InstantSearchSearchParams): string {
  const search = new URLSearchParams()
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined) {
      continue
    }
    search.set(key, typeof value === "string" ? value : JSON.stringify(value))
  }
  return search.toString()
}

export function parseIndexName(indexName: string): {
  entity: string
  order?: Record<string, SearchOrderBy>
} {
  const match = indexName.match(SORT_SUFFIX)
  if (!match) {
    return { entity: indexName }
  }

  const entity = match[1]
  const order: Record<string, SearchOrderBy> = {}

  for (const part of match[2].split(",")) {
    if (!part) {
      continue
    }
    const separator = part.lastIndexOf(":")
    const field = separator === -1 ? part : part.slice(0, separator)
    const direction = separator === -1 ? "ASC" : part.slice(separator + 1)
    if (!field) {
      continue
    }
    order[field] = direction.toUpperCase() === "DESC" ? "DESC" : "ASC"
  }

  return {
    entity,
    order: Object.keys(order).length ? order : undefined,
  }
}

function parseSnippetAttribute(attribute: string): {
  field: string
  length?: number
} {
  const separator = attribute.lastIndexOf(":")
  if (separator <= 0) {
    return { field: attribute }
  }
  const field = attribute.slice(0, separator)
  const length = Number(attribute.slice(separator + 1))
  if (Number.isNaN(length)) {
    return { field: attribute }
  }
  return { field, length }
}

type MappingOptions = Pick<
  InstantSearchAdapterOptions,
  | "numericAttributes"
  | "distinctAttribute"
  | "additionalSearchParameters"
  | "indexSpecificSearchParameters"
>

function eachFacetName(
  facets: InstantSearchSearchParams["facets"],
  visit: (field: string) => void
): void {
  if (facets == null || facets === "") {
    return
  }

  if (Array.isArray(facets)) {
    for (const facet of facets) {
      if (facet && facet !== "*") {
        visit(facet)
      }
    }
    return
  }

  if (facets !== "*") {
    visit(facets)
  }
}

function buildSearchOptions(
  params: InstantSearchSearchParams,
  options: MappingOptions
): SearchOptions | undefined {
  let result: SearchOptions | undefined
  const numericAttributes = options.numericAttributes

  eachFacetName(params.facets, (field) => {
    result ??= {}
    const facets = (result.facets ??= [])

    if (numericAttributes?.includes(field)) {
      facets.push({ field, type: "stats" })
      return
    }

    const facet: SearchFacetRequest = { field, type: "value" }
    if (params.maxValuesPerFacet != null) {
      facet.limit = params.maxValuesPerFacet
    }
    if (params.sortFacetValuesBy) {
      facet.sort = params.sortFacetValuesBy
    }
    facets.push(facet)
  })

  const highlightFields: string[] = []
  let snippetConfigured = false
  let snippetLength: number | undefined

  const addHighlightField = (field: string) => {
    if (!field || field === "*" || highlightFields.includes(field)) {
      return
    }
    highlightFields.push(field)
  }

  if (params.attributesToHighlight) {
    for (const field of params.attributesToHighlight) {
      addHighlightField(field)
    }
  }

  if (params.attributesToSnippet) {
    for (const attribute of params.attributesToSnippet) {
      snippetConfigured = true
      const snippet = parseSnippetAttribute(attribute)
      addHighlightField(snippet.field)
      if (snippetLength == null && snippet.length != null) {
        snippetLength = snippet.length
      }
    }
  }

  if (highlightFields.length) {
    const highlight: SearchHighlightOptions = { fields: highlightFields }
    if (params.highlightPreTag) {
      highlight.pre_tag = params.highlightPreTag
    }
    if (params.highlightPostTag) {
      highlight.post_tag = params.highlightPostTag
    }
    if (snippetConfigured) {
      highlight.snippet =
        snippetLength != null ? { length: snippetLength } : true
    }
    result ??= {}
    result.highlight = highlight
  }

  if (params.restrictSearchableAttributes?.length) {
    result ??= {}
    result.attributes_to_search_on = params.restrictSearchableAttributes
  }

  if (params.typoTolerance === false || params.typoTolerance === true) {
    result ??= {}
    result.typo_tolerance = params.typoTolerance
  }

  if (params.distinct && options.distinctAttribute) {
    result ??= {}
    result.distinct = options.distinctAttribute
  }

  return result
}

function mergeSearchOptions(
  base?: SearchOptions,
  overlay?: SearchOptions
): SearchOptions | undefined {
  if (!base) {
    return overlay
  }
  if (!overlay) {
    return base
  }

  return {
    ...base,
    ...overlay,
    facets: overlay.facets ?? base.facets,
    highlight: overlay.highlight ?? base.highlight,
  }
}

function applyLayer(
  query: SearchQuery,
  layer?: Partial<Omit<SearchQuery, "entity">>
): void {
  if (!layer) {
    return
  }

  const filters = mergeFiltersAnd(query.filters, layer.filters)
  if (filters) {
    query.filters = filters
  }

  query.fields ??= layer.fields

  if (layer.pagination) {
    const pagination = (query.pagination ??= {})
    pagination.skip ??= layer.pagination.skip
    pagination.take ??= layer.pagination.take
    pagination.order ??= layer.pagination.order
    pagination.cursor ??= layer.pagination.cursor
  }

  query.search_options = mergeSearchOptions(
    layer.search_options,
    query.search_options
  )
}

function applyConfiguredParameters(
  query: SearchQuery,
  options: MappingOptions
): SearchQuery {
  applyLayer(query, options.additionalSearchParameters)
  applyLayer(query, options.indexSpecificSearchParameters?.[query.entity])
  return query
}

function fromInstantSearch(
  request: InstantSearchRequest,
  options: MappingOptions
): SearchQuery {
  const params = parseSearchParams(request.params)
  const { entity, order } = parseIndexName(request.indexName)
  const query: SearchQuery = { entity }

  if (params.hitsPerPage != null || order) {
    const pagination: SearchPagination = {}
    if (params.hitsPerPage != null) {
      pagination.take = params.hitsPerPage
      pagination.skip = (params.page ?? 0) * params.hitsPerPage
    }
    if (order) {
      pagination.order = order
    }
    query.pagination = pagination
  }

  const filters = withQuery(
    params.query,
    mergeFiltersAnd(
      adaptFacetFilters(params.facetFilters),
      adaptNumericFilters(params.numericFilters)
    )
  )
  if (filters) {
    query.filters = filters
  }

  if (params.attributesToRetrieve?.length) {
    query.fields = params.attributesToRetrieve
  }

  const searchOptions = buildSearchOptions(params, options)
  if (searchOptions) {
    query.search_options = searchOptions
  }

  return query
}

export function adaptSearchRequest(
  request: InstantSearchRequest,
  options: MappingOptions = {}
): SearchQuery {
  return applyConfiguredParameters(fromInstantSearch(request, options), options)
}

export function adaptFacetSearchRequest(
  request: InstantSearchRequest,
  options: MappingOptions = {}
): SearchQuery {
  const query = adaptSearchRequest(request, options)
  const params = parseSearchParams(request.params)

  if (!params.facetName) {
    throw new Error(
      "@medusajs/instantsearch-adapter: searchForFacetValues requires params.facetName"
    )
  }

  const pagination = (query.pagination ??= {})
  pagination.skip = 0
  pagination.take = 0

  const facet: SearchFacetRequest = {
    field: params.facetName,
    type: "value",
    limit: params.maxFacetHits ?? params.maxValuesPerFacet ?? 10,
  }
  if (params.facetQuery) {
    facet.query = params.facetQuery
  }

  const searchOptions = (query.search_options ??= {})
  searchOptions.facets = [facet]

  return query
}
