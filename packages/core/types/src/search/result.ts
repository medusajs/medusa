/**
 * A document matching a search query.
 */
export interface SearchHit<T = Record<string, unknown>> {
  /**
   * The value of the index's primary key for this document. `query.search` uses
   * it to hydrate the rest of the entity through `query.graph`.
   */
  id: string

  /**
   * The document's relevance score. Scales are provider-specific and not
   * comparable across providers.
   */
  score?: number

  /**
   * The retrievable fields the search engine returned for this document.
   */
  document: T

  /**
   * The highlighted fragments of the fields requested in the query's
   * `search_options.highlight`, keyed by field path.
   */
  highlights?: Record<string, string[]>
}

/**
 * The computed values of a facet requested in a search query. Its shape depends
 * on the requested facet's type.
 */
export type SearchFacetResult =
  | {
      /**
       * The facet counts per distinct value of the field.
       */
      type: "value"

      /**
       * The distinct values of the field and how many documents hold each of them.
       */
      values: { value: string; count: number }[]

      /**
       * The number of documents falling outside the returned values, where the
       * provider reports it.
       */
      other_count?: number
    }
  | {
      /**
       * The facet counts documents per requested range.
       */
      type: "range"

      /**
       * The requested ranges and how many documents fall in each of them.
       */
      ranges: {
        /**
         * The range's key, as passed in the request.
         */
        key: string

        /**
         * The range's inclusive lower bound.
         */
        from?: number | string

        /**
         * The range's exclusive upper bound.
         */
        to?: number | string

        /**
         * The number of documents in the range.
         */
        count: number
      }[]
    }
  | {
      /**
       * The facet aggregates the field's values.
       */
      type: "stats"

      /**
       * The field's smallest value among the matching documents.
       */
      min: number

      /**
       * The field's largest value among the matching documents.
       */
      max: number

      /**
       * The average of the field's values, where the provider reports it.
       */
      avg?: number

      /**
       * The sum of the field's values, where the provider reports it.
       */
      sum?: number

      /**
       * The number of documents the aggregations were computed over.
       */
      count: number
    }

/**
 * The pagination and timing details of a search result.
 */
export interface SearchResultMetadata {
  /**
   * The number of documents skipped before the returned hits.
   */
  skip: number

  /**
   * The maximum number of hits returned.
   */
  take: number

  /**
   * Usually it's an estimate on the count, very few providers return an exact count.
   * If the user didn't ask for a count, it's `null`.
   */
  count: number | null

  /**
   * The cursor to pass in the next query's pagination to retrieve the next page,
   * on providers that paginate with cursors.
   */
  next_cursor?: string

  /**
   * The free-text query the result was computed for.
   */
  query?: string

  /**
   * How long the search engine took to run the query, in milliseconds.
   */
  processing_time_ms?: number
}

/**
 * The result of a search query.
 */
export interface SearchResult<T = Record<string, unknown>> {
  /**
   * The documents matching the query, ordered by the query's sort or by relevance.
   */
  hits: SearchHit<T>[]

  /**
   * The computed facets, keyed by the field they were requested on.
   */
  facets?: Record<string, SearchFacetResult>

  /**
   * The result's pagination and timing details.
   */
  metadata: SearchResultMetadata

  /**
   * Extra details the provider returned, passed through verbatim. Nothing in
   * Medusa's core reads from this.
   */
  provider_metadata?: Record<string, unknown>
}
