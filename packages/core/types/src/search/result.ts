export interface SearchHit<T = Record<string, unknown>> {
  id: string
  // Scales are provider-specific and not comparable across providers.
  score?: number
  // The retrievable fields the engine returned.
  document: T
  highlights?: Record<string, string[]>
}

export type SearchFacetResult =
  | {
      type: "value"
      values: { value: string; count: number }[]
      // Documents falling outside the returned values, where reported.
      other_count?: number
    }
  | {
      type: "range"
      ranges: {
        key: string
        from?: number | string
        to?: number | string
        count: number
      }[]
    }
  | {
      type: "stats"
      min: number
      max: number
      avg?: number
      sum?: number
      count: number
    }

export interface SearchResultMetadata {
  skip: number
  take: number
  /**
   * Usually it's an estimate on the count, very few providers return an exact count.
   * If the user didn't ask for a count, it's `null`.
   */
  count: number | null
  next_cursor?: string
  query?: string
  processing_time_ms?: number
}

export interface SearchResult<T = Record<string, unknown>> {
  hits: SearchHit<T>[]
  facets?: Record<string, SearchFacetResult>
  metadata: SearchResultMetadata
  // Provider extras, passed through verbatim. Nothing in core reads from this.
  provider_metadata?: Record<string, unknown>
}
