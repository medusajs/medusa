import { parseSearchParams, stringifyParams } from "./request"
import {
  DEFAULT_HITS_PER_PAGE,
  HighlightResultNode,
  InstantSearchFacetHit,
  InstantSearchFacetSearchResponse,
  InstantSearchHighlightResult,
  InstantSearchHit,
  InstantSearchRequest,
  InstantSearchSearchResponse,
  SearchFacetResult,
  SearchHit,
  SearchResult,
} from "./types"

const DEFAULT_PRE_TAG = "<mark>"
const DEFAULT_POST_TAG = "</mark>"

function setByPath(
  target: Record<string, HighlightResultNode>,
  path: string,
  value: InstantSearchHighlightResult
): void {
  const parts = path.split(".")
  let current: Record<string, HighlightResultNode> = target

  for (let i = 0; i < parts.length - 1; i++) {
    const part = parts[i]
    const existing = current[part]
    if (!existing || typeof existing !== "object" || "value" in existing) {
      current[part] = {}
    }
    current = current[part] as Record<string, HighlightResultNode>
  }

  current[parts[parts.length - 1]] = value
}

function extractMatchedWords(
  value: string,
  preTag: string,
  postTag: string
): string[] {
  const words: string[] = []
  let remaining = value

  while (remaining.length) {
    const start = remaining.indexOf(preTag)
    if (start === -1) {
      break
    }
    const after = remaining.slice(start + preTag.length)
    const end = after.indexOf(postTag)
    if (end === -1) {
      break
    }
    const word = after.slice(0, end)
    if (word) {
      words.push(word)
    }
    remaining = after.slice(end + postTag.length)
  }

  return words
}

function adaptHighlightValue(
  value: string,
  preTag: string,
  postTag: string
): string {
  if (preTag === DEFAULT_PRE_TAG && postTag === DEFAULT_POST_TAG) {
    return value
  }
  return value
    .split(DEFAULT_PRE_TAG)
    .join(preTag)
    .split(DEFAULT_POST_TAG)
    .join(postTag)
}

function toHighlightResult(
  fragments: string[],
  preTag: string,
  postTag: string
): InstantSearchHighlightResult {
  const value = adaptHighlightValue(fragments.join(" … "), preTag, postTag)
  const matchedWords = extractMatchedWords(value, preTag, postTag)

  return {
    value,
    matchLevel: matchedWords.length ? "full" : "none",
    matchedWords,
  }
}

function adaptHighlights(
  highlights: Record<string, string[]> | undefined,
  preTag: string,
  postTag: string
): Record<string, HighlightResultNode> | undefined {
  if (!highlights) {
    return undefined
  }

  const result: Record<string, HighlightResultNode> = {}
  for (const [path, fragments] of Object.entries(highlights)) {
    if (!fragments?.length) {
      continue
    }
    setByPath(result, path, toHighlightResult(fragments, preTag, postTag))
  }

  return Object.keys(result).length ? result : undefined
}

function asDocument(document: unknown): Record<string, unknown> {
  if (document && typeof document === "object" && !Array.isArray(document)) {
    return document as Record<string, unknown>
  }
  return {}
}

function adaptHit(
  hit: SearchHit,
  options: {
    primaryKey: string
    preTag: string
    postTag: string
    snippet: boolean
  }
): InstantSearchHit {
  const document = asDocument(hit.document)
  const objectID = String(
    hit.id ?? document[options.primaryKey] ?? document.id ?? ""
  )
  const adapted: InstantSearchHit = {
    ...document,
    objectID,
  }

  const highlightResult = adaptHighlights(
    hit.highlights,
    options.preTag,
    options.postTag
  )
  if (highlightResult) {
    if (options.snippet) {
      adapted._snippetResult = highlightResult
    } else {
      adapted._highlightResult = highlightResult
    }
  }

  if (hit.score != null) {
    adapted._score = hit.score
  }

  return adapted
}

function adaptFacets(facets: Record<string, SearchFacetResult> | undefined): {
  facets?: Record<string, Record<string, number>>
  facets_stats?: Record<
    string,
    { min: number; max: number; avg?: number; sum?: number }
  >
} {
  if (!facets) {
    return {}
  }

  const values: Record<string, Record<string, number>> = {}
  const stats: Record<
    string,
    { min: number; max: number; avg?: number; sum?: number }
  > = {}

  for (const [field, facet] of Object.entries(facets)) {
    if (facet.type === "value") {
      values[field] = Object.fromEntries(
        facet.values.map((entry) => [entry.value, entry.count])
      )
    } else if (facet.type === "stats") {
      stats[field] = {
        min: facet.min,
        max: facet.max,
        ...(facet.avg != null ? { avg: facet.avg } : {}),
        ...(facet.sum != null ? { sum: facet.sum } : {}),
      }
      // InstantSearch's helper only copies `facets_stats` onto keys present in
      // `facets`. Range widgets then read `results.disjunctiveFacets[].stats`.
      if (!values[field]) {
        values[field] = {}
      }
    } else if (facet.type === "range") {
      values[field] = Object.fromEntries(
        facet.ranges.map((entry) => [entry.key, entry.count])
      )
    }
  }

  return {
    ...(Object.keys(values).length ? { facets: values } : {}),
    ...(Object.keys(stats).length ? { facets_stats: stats } : {}),
  }
}

export function adaptSearchResponse(
  result: SearchResult,
  request: InstantSearchRequest,
  options: { primaryKey?: string } = {}
): InstantSearchSearchResponse {
  const params = parseSearchParams(request.params)
  const hitsPerPage =
    params.hitsPerPage ?? result.metadata.take ?? DEFAULT_HITS_PER_PAGE
  const skip = result.metadata.skip ?? 0
  const page =
    params.page ?? (hitsPerPage > 0 ? Math.floor(skip / hitsPerPage) : 0)
  const nbHits =
    result.metadata.count ??
    (result.hits.length < hitsPerPage
      ? skip + result.hits.length
      : skip + result.hits.length + 1)
  const nbPages =
    hitsPerPage > 0 && nbHits > 0 ? Math.ceil(nbHits / hitsPerPage) : 0
  const preTag = params.highlightPreTag ?? DEFAULT_PRE_TAG
  const postTag = params.highlightPostTag ?? DEFAULT_POST_TAG
  const snippet = Boolean(params.attributesToSnippet?.length)
  const primaryKey = options.primaryKey ?? "id"
  const { facets, facets_stats } = adaptFacets(result.facets)

  return {
    hits: (result.hits ?? []).map((hit) =>
      adaptHit(hit, { primaryKey, preTag, postTag, snippet })
    ),
    nbHits,
    page,
    nbPages,
    hitsPerPage,
    processingTimeMS: result.metadata.processing_time_ms ?? 0,
    query: result.metadata.query ?? params.query ?? "",
    params: stringifyParams(params),
    index: request.indexName,
    exhaustiveNbHits: result.metadata.count != null,
    exhaustiveFacetsCount: true,
    ...(facets ? { facets } : {}),
    ...(facets_stats ? { facets_stats } : {}),
  }
}

export function createEmptySearchResponse(
  request: InstantSearchRequest
): InstantSearchSearchResponse {
  const params = parseSearchParams(request.params)
  const hitsPerPage = params.hitsPerPage ?? DEFAULT_HITS_PER_PAGE
  const page = params.page ?? 0

  return {
    hits: [],
    nbHits: 0,
    page,
    nbPages: 0,
    hitsPerPage,
    processingTimeMS: 0,
    query: params.query ?? "",
    params: stringifyParams(params),
    index: request.indexName,
    exhaustiveNbHits: true,
    exhaustiveFacetsCount: true,
  }
}

function highlightFacetValue(value: string, query: string | undefined): string {
  if (!query) {
    return value
  }
  const index = value.toLowerCase().indexOf(query.toLowerCase())
  if (index === -1) {
    return value
  }
  return (
    value.slice(0, index) +
    DEFAULT_PRE_TAG +
    value.slice(index, index + query.length) +
    DEFAULT_POST_TAG +
    value.slice(index + query.length)
  )
}

export function adaptFacetSearchResponse(
  result: SearchResult,
  request: InstantSearchRequest
): InstantSearchFacetSearchResponse {
  const params = parseSearchParams(request.params)
  const facetName = params.facetName
  const facet = facetName ? result.facets?.[facetName] : undefined
  const facetHits: InstantSearchFacetHit[] =
    facet?.type === "value"
      ? facet.values.map((entry) => ({
          value: entry.value,
          highlighted: highlightFacetValue(entry.value, params.facetQuery),
          count: entry.count,
        }))
      : []

  return {
    facetHits,
    exhaustiveFacetsCount: true,
    processingTimeMS: result.metadata.processing_time_ms ?? 0,
  }
}

export function createEmptyFacetSearchResponse(): InstantSearchFacetSearchResponse {
  return {
    facetHits: [],
    exhaustiveFacetsCount: true,
    processingTimeMS: 0,
  }
}
