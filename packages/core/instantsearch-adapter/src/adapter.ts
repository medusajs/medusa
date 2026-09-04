import {
  adaptFacetSearchRequest,
  adaptSearchRequest,
  parseSearchParams,
} from "./request"
import {
  adaptFacetSearchResponse,
  adaptSearchResponse,
  createEmptyFacetSearchResponse,
  createEmptySearchResponse,
} from "./response"
import { assertAdapterTransport, createSearchRequester } from "./http"
import type {
  InstantSearchAdapterOptions,
  InstantSearchFacetSearchResponse,
  InstantSearchRequest,
  InstantSearchSearchResponse,
  SearchClient,
  SearchQuery,
  SearchResult,
} from "./types"

class TtlCache<T> {
  private store = new Map<string, { value: T; expiresAt: number }>()

  constructor(private ttlMs: number) {}

  get(key: string): T | undefined {
    if (this.ttlMs <= 0) {
      return undefined
    }
    const entry = this.store.get(key)
    if (!entry) {
      return undefined
    }
    if (Date.now() > entry.expiresAt) {
      this.store.delete(key)
      return undefined
    }
    return entry.value
  }

  set(key: string, value: T): void {
    if (this.ttlMs <= 0) {
      return
    }
    this.store.set(key, { value, expiresAt: Date.now() + this.ttlMs })
  }

  clear(): void {
    this.store.clear()
  }
}

function isPlaceholderDisabled(
  request: InstantSearchRequest,
  placeholderSearch: boolean
): boolean {
  if (placeholderSearch) {
    return false
  }
  const query = parseSearchParams(request.params).query
  return !query || !query.trim()
}

function cacheKey(kind: string, queries: SearchQuery[]): string {
  return `${kind}:${JSON.stringify(queries)}`
}

export function createInstantSearchAdapter(
  options: InstantSearchAdapterOptions
): { searchClient: SearchClient } {
  assertAdapterTransport(options)

  const requester = createSearchRequester(options)
  const placeholderSearch = options.placeholderSearch !== false
  const cache = new TtlCache<unknown>(
    (options.cacheSearchResultsForSeconds ?? 0) * 1000
  )

  const toSearchQuery = (
    request: InstantSearchRequest,
    facetSearch = false
  ): SearchQuery => {
    const adapted = facetSearch
      ? adaptFacetSearchRequest(request, options)
      : adaptSearchRequest(request, options)
    return options.transformQuery
      ? options.transformQuery(adapted, request)
      : adapted
  }

  const searchClient: SearchClient = {
    async search(requests: InstantSearchRequest[]) {
      const results: InstantSearchSearchResponse[] = new Array(requests.length)
      const pending: { index: number; query: SearchQuery }[] = []

      requests.forEach((request, index) => {
        if (isPlaceholderDisabled(request, placeholderSearch)) {
          results[index] = createEmptySearchResponse(request)
          return
        }
        pending.push({ index, query: toSearchQuery(request) })
      })

      if (pending.length) {
        const queries = pending.map((item) => item.query)
        const key = cacheKey("search", queries)
        const cached = cache.get(key) as SearchResult[] | undefined
        const fetched = cached ?? (await requester(queries))
        if (!cached) {
          cache.set(key, fetched)
        }

        pending.forEach((item, queryIndex) => {
          const request = requests[item.index]
          const adapted = adaptSearchResponse(fetched[queryIndex], request, {
            primaryKey: options.primaryKey,
          })
          results[item.index] = options.transformResponse
            ? options.transformResponse(adapted, fetched[queryIndex], request)
            : adapted
        })
      }

      return { results }
    },

    async searchForFacetValues(requests: InstantSearchRequest[]) {
      const results: InstantSearchFacetSearchResponse[] = new Array(
        requests.length
      )
      const pending: { index: number; query: SearchQuery }[] = []

      requests.forEach((request, index) => {
        if (isPlaceholderDisabled(request, placeholderSearch)) {
          results[index] = createEmptyFacetSearchResponse()
          return
        }
        pending.push({ index, query: toSearchQuery(request, true) })
      })

      if (pending.length) {
        const queries = pending.map((item) => item.query)
        const key = cacheKey("facet", queries)
        const cached = cache.get(key) as SearchResult[] | undefined
        const fetched = cached ?? (await requester(queries))
        if (!cached) {
          cache.set(key, fetched)
        }

        pending.forEach((item, queryIndex) => {
          results[item.index] = adaptFacetSearchResponse(
            fetched[queryIndex],
            requests[item.index]
          )
        })
      }

      return results
    },

    clearCache() {
      cache.clear()
    },
  }

  return { searchClient }
}
