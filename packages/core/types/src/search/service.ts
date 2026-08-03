import { IModuleService } from "../modules-sdk"
import { SearchDocument, SearchTask } from "./common"
import { SearchFilters } from "./filters"
import { SearchQuery } from "./query"
import { SearchResult } from "./result"

/**
 * `swap` seeds a shadow index and aliases over on completion, keeping the live
 * index serving throughout. `in_place` upserts into the live index, which is
 * cheaper but leaves stale documents behind for anything the seed no longer
 * produces.
 */
export type SearchReindexStrategy = "swap" | "in_place"

export interface SearchReindexInput {
  // Defaults to every index.
  index?: string | string[]
  // @default "swap"
  strategy?: SearchReindexStrategy
  // Passed to the definition's `seed` for a partial rebuild.
  filters?: Record<string, unknown>
}

export interface SearchReindexResult {
  job_id: string
  indexes: string[]
}

export interface ISearchModuleService extends IModuleService {
  search<T = Record<string, unknown>>(
    query: SearchQuery
  ): Promise<SearchResult<T>>

  searchMany(queries: SearchQuery[]): Promise<SearchResult[]>

  /**
   * Returns the write's task without waiting on it. A provider that applies
   * writes lazily leaves it `enqueued`, and it is the caller's call whether
   * reading its own write back matters enough to block on `waitForTask`.
   */
  upsertDocuments(input: {
    index: string
    documents: SearchDocument[]
  }): Promise<SearchTask>

  /**
   * Removes every document matching `filters`. Deleting by id is a filter on the
   * primary key: `{ id: ["prod_1"] }`.
   */
  deleteDocuments(input: {
    index: string
    filters: SearchFilters
  }): Promise<SearchTask>

  reindex(input?: SearchReindexInput): Promise<SearchReindexResult>
}
