import { SearchOptions, SearchQuery } from "../../../search"

/**
 * A query run against one of the store's search indexes by `POST /store/search`.
 *
 * It is the Search Module's own `SearchQuery`, minus what the endpoint owns:
 * `context` shapes the hydration, and `provider_options` reaches straight into
 * the engine's own API.
 */
export type StoreSearchQuery = Omit<
  SearchQuery,
  "context" | "search_options"
> & {
  search_options?: Omit<SearchOptions, "provider_options">
}

/**
 * The body of `POST /store/search`: a batch of queries, or a single one. A batch
 * runs in one round-trip to the search engine.
 */
export type StoreSearch = { queries: StoreSearchQuery[] } | StoreSearchQuery
