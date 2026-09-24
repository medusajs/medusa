import { SearchResult } from "../../../search"

/**
 * Each hit carries the matching document under `document`: the index' own fields,
 * or the hydrated entity when the query asked for fields the index doesn't hold.
 * `metadata.count` is whatever the engine reported, which most of them only
 * estimate.
 */
export interface StoreSearchResponse<T = Record<string, unknown>> {
  /**
   * The results of the posted queries, in the order they were sent in.
   */
  results: SearchResult<T>[]
}
