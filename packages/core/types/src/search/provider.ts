import { SearchDocument, SearchIndexInfo, SearchTask } from "./common"
import { SearchFilters } from "./filters"
import { ResolvedSearchIndexDefinition } from "./index-definition"
import { SearchQuery } from "./query"
import { SearchResult } from "./result"

// The caller's query plus the resolved definition, with fields already narrowed
// to what the index can serve.
export interface ProviderSearchQuery
  extends Omit<SearchQuery, "entity" | "fields"> {
  index: ResolvedSearchIndexDefinition
  attributes_to_retrieve: string[]
  // Lifted out of `filters` by the module, because `filters` compiles to a DSL
  // with no representation for free text.
  q?: string
}

export interface SearchDeleteDocumentsInput {
  index: string
  filters: SearchFilters
}

export interface ISearchProvider {
  // Stable identifier, e.g. `"meilisearch"`. Keys `provider_options` and binds a
  // definition to a provider.
  readonly identifier: string

  /* ---------------------------- index lifecycle --------------------------- */

  /**
   * Brings the index at `index.physical_name` up to the definition, creating it
   * if missing.
   *
   * May recreate it — losing its contents — if the schema cannot be altered in
   * place. That is safe: the module only points this at an index it is about to
   * seed, never at one that has to keep serving, and never during a partial
   * rebuild.
   */
  upsertIndex(input: {
    index: ResolvedSearchIndexDefinition
  }): Promise<SearchTask>

  deleteIndex(input: { index: string }): Promise<SearchTask>

  listIndexes(): Promise<SearchIndexInfo[]>

  // Zero-downtime reindexing. When absent, the module reindexes in place.
  swapIndex?(input: { alias: string; index: string }): Promise<SearchTask>

  /* -------------------------------- documents ---------------------------- */

  upsertDocuments(input: {
    index: string
    documents: SearchDocument[]
  }): Promise<SearchTask>

  /**
   * Removes every document matching `filters`. Deleting by id is not a special
   * case — it is `{ id: [...] }` on the primary key, which providers should
   * recognise and route to their fast path. Anything broader may be resolved by
   * searching first, or rejected.
   */
  deleteDocuments(input: SearchDeleteDocumentsInput): Promise<SearchTask>

  clearIndex(input: { index: string }): Promise<SearchTask>

  partialUpdateDocuments?(input: {
    index: string
    documents: (Partial<SearchDocument> & { id: string })[]
  }): Promise<SearchTask>

  /* ----------------------------------- read ------------------------------ */

  search(input: ProviderSearchQuery): Promise<SearchResult>

  /**
   * Batches queries. Used for disjunctive faceting; when absent the module
   * falls back to sequential `search` calls.
   */
  searchMany?(inputs: ProviderSearchQuery[]): Promise<SearchResult[]>

  /* ------------------------------- async writes -------------------------- */

  // Implement this when writes are applied lazily. Its absence says a write is
  // already applied once `upsertDocuments` resolves.
  waitForTask?(
    task: SearchTask,
    options?: { timeout_ms?: number }
  ): Promise<SearchTask>
}
