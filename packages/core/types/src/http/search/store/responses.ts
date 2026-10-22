import { SearchResult } from "../../../search"

/**
 * Each hit carries the matching document under `document`: the fields the query
 * selected, or every field the index can return.
 * `metadata.count` is whatever the engine reported, which most of them only
 * estimate.
 */
export interface StoreSearchResponse<T = Record<string, unknown>> {
  /**
   * The results of the posted queries, in the order they were sent in.
   */
  results: SearchResult<T>[]
}
