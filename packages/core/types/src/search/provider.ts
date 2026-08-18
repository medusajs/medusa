import { SearchDocument, SearchIndexInfo, SearchTask } from "./common"
import { SearchFilters } from "./filters"
import { ResolvedSearchIndexDefinition } from "./index-definition"
import { SearchQuery } from "./query"
import { SearchResult } from "./result"

/**
 * The caller's query plus the resolved definition. `attributes_to_retrieve` is
 * already narrowed to what the index can serve, so project it as given.
 */
export interface ProviderSearchQuery
  extends Omit<SearchQuery, "entity" | "fields"> {
  index: ResolvedSearchIndexDefinition
  attributes_to_retrieve: string[]
  /**
   * Lifted out of `filters` by the module, because `filters` compiles to a DSL
   * with no representation for free text.
   */
  q?: string
}

/**
 * The input for deleting documents from a search index.
 */
export interface SearchDeleteDocumentsInput {
  index: string
  filters: SearchFilters
}

/**
 * Contract implemented by a search engine provider. Optional methods
 * (`swapIndex`, `searchMany`, `waitForTask`) are omitted from
 * the abstract class on purpose — define only those your engine can back.
 */
export interface ISearchProvider {
  /**
   * Stable identifier, e.g. `"meilisearch"`. Keys `provider_options` and binds a
   * definition to a provider.
   */
  readonly identifier: string

  /**
   * Whether the module has to migrate this provider's indexes when the
   * application starts, rather than leaving it to `db:migrate`.
   *
   * Set it when indexes do not outlive the process that created them, as an
   * in-memory provider's do not: `db:migrate` runs in a process of its own, so
   * everything it built is gone by the time the application boots. The module
   * then migrates before it seeds, and the two happen in the process that
   * serves the reads.
   *
   * Leave it unset for an engine that holds its indexes elsewhere.
   */
  readonly migrate_on_startup?: boolean

  /**
   * Creates or updates the index at `index.physical_name` to match the definition.
   * May recreate it (losing contents) if the schema cannot be altered in place.
   */
  upsertIndex(input: {
    index: ResolvedSearchIndexDefinition
  }): Promise<SearchTask>

  /**
   * Deletes an index and its documents.
   */
  deleteIndex(input: { index: string }): Promise<SearchTask>

  /**
   * Lists indexes and their document counts.
   */
  listIndexes(): Promise<SearchIndexInfo[]>

  /**
   * Zero-downtime reindexing. When absent, the module reindexes in place.
   */
  swapIndex?(input: { alias: string; index: string }): Promise<SearchTask>

  /**
   * Upserts documents into an index.
   */
  upsertDocuments(input: {
    index: string
    /**
     * The logical definition whose documents are being written. `index` can
     * point at a shadow physical index during a swap, so providers must use
     * this value for schema information and `index` for the destination.
     */
    definition: ResolvedSearchIndexDefinition
    documents: SearchDocument[]
  }): Promise<SearchTask>

  /**
   * Deletes documents matching `filters`. By-id deletion is `{ id: [...] }` on the
   * primary key; broader filters may be resolved via search or rejected.
   */
  deleteDocuments(input: SearchDeleteDocumentsInput): Promise<SearchTask>

  /**
   * Removes every document from an index without deleting the index.
   */
  clearIndex(input: { index: string }): Promise<SearchTask>

  /**
   * Runs a search against an index.
   */
  search(input: ProviderSearchQuery): Promise<SearchResult>

  /**
   * Batches queries for disjunctive faceting. When absent, the module falls back
   * to sequential `search` calls.
   */
  searchMany?(inputs: ProviderSearchQuery[]): Promise<SearchResult[]>

  /**
   * Waits until a deferred write is applied. Absence means a write is already
   * applied once `upsertDocuments` resolves.
   */
  waitForTask?(
    task: SearchTask,
    options?: { timeout_ms?: number }
  ): Promise<SearchTask>
}
