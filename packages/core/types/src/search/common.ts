// `id` holds the primary key, which `query.search` uses to hydrate the rest of
// the entity through `query.graph`.
export type SearchDocument = Record<string, unknown> & { id: string }

export type SearchTaskStatus =
  | "enqueued"
  | "processing"
  | "succeeded"
  | "failed"

/**
 * Meilisearch and Algolia acknowledge a write and apply it later; Postgres and
 * Typesense apply it inline. Every write returns a task so both look the same —
 * an inline provider's is already `succeeded`.
 */
export interface SearchTask {
  // Set only for a deferred write, and passed back to `waitForTask`. An inline
  // provider has nothing to identify and leaves it out.
  id?: string
  index?: string
  status: SearchTaskStatus
  error?: {
    message: string
    code?: string
  }
}

// What a provider can report about a physical index it owns.
export interface SearchIndexInfo {
  name: string
  provider: string
  document_count: number
  created_at?: Date
  updated_at?: Date
}
