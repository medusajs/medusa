import { Event } from "../event-bus"
import { IModuleService } from "../modules-sdk"
import { SearchDocument, SearchTask } from "./common"
import { SearchFilters } from "./filters"
import { ResolvedSearchIndexDefinition } from "./index-definition"
import { SearchIndexMigrationAction } from "./migration"
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

  /**
   * Applies an event to every index that declared it, using each index' `consume`
   * to turn the event into documents.
   *
   * Resolves once the engine has accepted the operation, failures leave redelivery to the
   * event bus. Returns one task per write, and nothing for an undeclared event.
   */
  ingest(event: Event<any>): Promise<SearchTask[]>

  listIndexes(): string[]

  /**
   * The field paths the index can return. `query.search` uses this to split what a
   * caller asked for between the engine and `query.graph`.
   */
  listRetrievableFields(index: string): string[]

  /**
   * One index' definition, with the module's defaults applied — the provider it
   * resolved to, the physical index behind it, and the `primary_key` its
   * documents are keyed by, which is what a hit's `id` holds.
   */
  getIndex(index: string): ResolvedSearchIndexDefinition

  reindex(input?: SearchReindexInput): Promise<SearchReindexResult>

  /**
   * What it would take to bring the physical indexes in line with the loaded
   * definitions. Planned separately from executing it so that `db:migrate` can
   * print the actions first.
   */
  createIndexMigrationPlan(): Promise<SearchIndexMigrationAction[]>

  /**
   * Creates and alters physical indexes. Filling them is the seed at application
   * start, so an index this creates serves nothing until then.
   */
  executeIndexMigrationPlan(
    actions: SearchIndexMigrationAction[]
  ): Promise<void>
}
