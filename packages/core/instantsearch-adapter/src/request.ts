import {
  adaptFacetFilters,
  adaptNumericFilters,
  mergeFiltersAnd,
  withQuery,
} from "./filters"
import { DEFAULT_HITS_PER_PAGE } from "./types"
import type {
  InstantSearchAdapterOptions,
  InstantSearchRequest,
  InstantSearchSearchParams,
  SearchOptions,
  SearchOrderBy,
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

function asFacetNames(
  facets: InstantSearchSearchParams["facets"]
): string[] {
  if (facets == null || facets === "") {
    return []
  }
  const names = Array.isArray(facets) ? facets : [facets]
  return names.filter((facet) => facet && facet !== "*")
}

function buildSearchOptions(
  params: InstantSearchSearchParams,
  options: MappingOptions
): SearchOptions | undefined {
  const result: SearchOptions = {}
  const facetNames = asFacetNames(params.facets)
  const numericAttributes = new Set(options.numericAttributes ?? [])

  if (facetNames.length) {
    result.facets = facetNames.map((field) => {
      if (numericAttributes.has(field)) {
        return { field, type: "stats" as const }
      }

      return {
        field,
        type: "value" as const,
        ...(params.maxValuesPerFacet != null
          ? { limit: params.maxValuesPerFacet }
          : {}),
        ...(params.sortFacetValuesBy ? { sort: params.sortFacetValuesBy } : {}),
      }
    })
  }

  const highlightFields = (params.attributesToHighlight ?? []).filter(
    (field) => field !== "*"
  )
  const snippets = (params.attributesToSnippet ?? []).map(parseSnippetAttribute)
  const snippetFields = snippets.map((snippet) => snippet.field)
  const fields = Array.from(new Set([...highlightFields, ...snippetFields]))

  if (fields.length) {
    const snippetLength = snippets.find(
      (snippet) => snippet.length != null
    )?.length
    result.highlight = {
      fields,
      ...(params.highlightPreTag ? { pre_tag: params.highlightPreTag } : {}),
      ...(params.highlightPostTag ? { post_tag: params.highlightPostTag } : {}),
      ...(snippets.length
        ? { snippet: snippetLength != null ? { length: snippetLength } : true }
        : {}),
    }
  }

  if (params.restrictSearchableAttributes?.length) {
    result.attributes_to_search_on = params.restrictSearchableAttributes
  }

  if (params.typoTolerance === false) {
    result.typo_tolerance = false
  } else if (params.typoTolerance === true) {
    result.typo_tolerance = true
  }

  if (params.distinct && options.distinctAttribute) {
    result.distinct = options.distinctAttribute
  }

  return Object.keys(result).length ? result : undefined
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

function applyConfiguredParameters(
  adapted: SearchQuery,
  options: MappingOptions
): SearchQuery {
  const layers = [
    options.additionalSearchParameters,
    options.indexSpecificSearchParameters?.[adapted.entity],
  ].filter(Boolean) as Partial<SearchQuery>[]

  let filters = adapted.filters
  let fields = adapted.fields
  let pagination = { ...adapted.pagination }
  let searchOptions = adapted.search_options

  for (const layer of layers) {
    filters = mergeFiltersAnd(filters, layer.filters)
    fields = fields ?? layer.fields
    pagination = { ...layer.pagination, ...pagination }
    searchOptions = mergeSearchOptions(layer.search_options, searchOptions)
  }

  return {
    entity: adapted.entity,
    ...(fields ? { fields } : {}),
    ...(filters ? { filters } : {}),
    pagination,
    ...(searchOptions ? { search_options: searchOptions } : {}),
  }
}

function fromInstantSearch(
  request: InstantSearchRequest,
  options: MappingOptions
): SearchQuery {
  const params = parseSearchParams(request.params)
  const { entity, order } = parseIndexName(request.indexName)
  const hitsPerPage = params.hitsPerPage ?? DEFAULT_HITS_PER_PAGE
  const page = params.page ?? 0

  const query: SearchQuery = {
    entity,
    pagination: {
      skip: page * hitsPerPage,
      take: hitsPerPage,
      ...(order ? { order } : {}),
    },
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

  query.pagination = {
    ...query.pagination,
    skip: 0,
    take: 0,
  }
  query.search_options = {
    ...query.search_options,
    facets: [
      {
        field: params.facetName,
        type: "value",
        ...(params.facetQuery ? { query: params.facetQuery } : {}),
        limit: params.maxFacetHits ?? params.maxValuesPerFacet ?? 10,
      },
    ],
  }

  return query
}
