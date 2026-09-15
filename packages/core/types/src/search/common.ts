/**
 * A document stored in a search index. The `id` property holds the index's
 * primary key, which `query.search` uses to hydrate the rest of the entity
 * through `query.graph`.
 */
export type SearchDocument = Record<string, unknown> & { id: string }

/**
 * The status of a write to a search index:
 *
 * - `enqueued`: the search engine accepted the write but hasn't applied it yet.
 * - `processing`: the search engine is applying the write.
 * - `succeeded`: the write is applied.
 * - `failed`: the write didn't go through.
 */
export type SearchTaskStatus =
  | "enqueued"
  | "processing"
  | "succeeded"
  | "failed"

/**
 * A write to a search index, along with its status.
 *
 * Some search engines, such as Meilisearch and Algolia, acknowledge a write and
 * apply it later, whereas others, such as PostgreSQL and Typesense, apply it
 * inline. Every write returns a task so both look the same — an inline
 * provider's task is already `succeeded`.
 */
export interface SearchTask {
  /**
   * The ID identifying the write in the search engine, which is passed back to
   * the provider's `waitForTask` method. It's set only for a deferred write,
   * since a provider applying writes inline has nothing to identify.
   */
  id?: string

  /**
   * The name of the index the write was applied to.
   */
  index?: string

  /**
   * The write's status.
   */
  status: SearchTaskStatus

  /**
   * The error that made the write fail, if its `status` is `failed`.
   */
  error?: {
    /**
     * The error's message.
     */
    message: string

    /**
     * The error's code, as reported by the search engine.
     */
    code?: string
  }
}

/**
 * The details of a physical index that a provider holds.
 */
export interface SearchIndexInfo {
  /**
   * The index's physical name.
   */
  name: string

  /**
   * The identifier of the provider holding the index.
   */
  provider: string

  /**
   * The number of documents in the index. The Search Module uses it to spot an
   * index that lost its data and needs reseeding.
   */
  document_count: number

  /**
   * The date the index was created.
   */
  created_at?: Date

  /**
   * The date the index was last updated.
   */
  updated_at?: Date
}
