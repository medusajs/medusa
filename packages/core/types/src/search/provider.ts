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
  /**
   * The resolved definition of the index to query. Use its `physical_name` as
   * the index to query, since it differs from the index's name under an index
   * prefix or while a swap builds a replacement.
   */
  index: ResolvedSearchIndexDefinition

  /**
   * The field paths the search engine must return on every hit. Already narrowed
   * by the Search Module to the fields the index can serve, so project it as
   * given.
   */
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
  /**
   * The physical name of the index to delete the documents from.
   */
  index: string

  /**
   * The filters selecting the documents to remove. Deleting by ID is a filter on
   * the index's primary key, such as `{ id: ["prod_1", "prod_2"] }`.
   */
  filters: SearchFilters
}

/**
 * Contract implemented by a search engine provider. Optional methods
 * (`swapIndex`, `searchMany`, `waitForTask`) are omitted from
 * the abstract class on purpose — define only those your engine can back.
 */
export interface ISearchProvider {
  /**
   * Each search provider has a unique identifier, such as `search-medusa`, used to
   * register it and to bind an index definition to it. An index definition
   * selects a provider by setting its `provider` property to this identifier. You can also use this identifier
   * in `medusa-config.ts` to configure the default provider for the Search Module.
   *
   * On a provider extending `AbstractSearchProviderService`, this is derived from
   * the class's `static identifier` property.
   *
   * @example
   * class MySearchProviderService extends AbstractSearchProviderService {
   *   static identifier = "my-search"
   *   // ...
   * }
   */
  readonly identifier: string

  /**
   * This method creates or updates the index at `index.physical_name` to match the definition.
   * The Search Module calls it for every definition when migrations run.
   *
   * You may recreate the index if your engine can't alter a schema in place. That's safe:
   * the module only points this at an index it's about to seed, never at one that has to
   * keep serving reads, and never during a partial rebuild.
   *
   * Throw if the definition asks for something your engine can't hold, such as a
   * `correlated` field or a facet type it doesn't support. Since migrations run
   * before the application serves requests, the error surfaces at startup rather
   * than as wrong results later.
   *
   * @param {object} input - The index to create or update.
   * @param {ResolvedSearchIndexDefinition} input.index - The definition,
   * including the `physical_name` to create it under, the `primary_key` its
   * documents are keyed by, the `fields` it holds, and its `settings`.
   * @returns {Promise<SearchTask>} The write's task.
   *
   * @example
   * class MySearchProviderService extends AbstractSearchProviderService {
   *   // ...
   *   async upsertIndex({
   *     index,
   *   }: {
   *     index: SearchTypes.ResolvedSearchIndexDefinition
   *   }): Promise<SearchTypes.SearchTask> {
   *     await this.client.createIndex(index.physical_name, {
   *       primaryKey: index.primary_key,
   *     })
   *
   *     return { index: index.physical_name, status: "succeeded" }
   *   }
   * }
   */
  upsertIndex(input: {
    index: ResolvedSearchIndexDefinition
  }): Promise<SearchTask>

  /**
   * This method deletes an index and everything in it. The Search Module calls it
   * to clean up an index it replaced, such as the index left behind by a swap.
   *
   * @param {object} input - The index to delete.
   * @param {string} input.index - The index's physical name.
   * @returns {Promise<SearchTask>} The write's task.
   *
   * @example
   * class MySearchProviderService extends AbstractSearchProviderService {
   *   // ...
   *   async deleteIndex({
   *     index,
   *   }: {
   *     index: string
   *   }): Promise<SearchTypes.SearchTask> {
   *     await this.client.deleteIndex(index)
   *     return { index, status: "succeeded" }
   *   }
   * }
   */
  deleteIndex(input: { index: string }): Promise<SearchTask>

  /**
   * This method lists the indexes you hold. The Search Module reads the document counts to
   * spot an index that lost its data and needs reseeding.
   *
   * @returns {Promise<SearchIndexInfo[]>} The indexes and their document counts.
   *
   * @example
   * class MySearchProviderService extends AbstractSearchProviderService {
   *   // ...
   *   async listIndexes(): Promise<SearchTypes.SearchIndexInfo[]> {
   *     const indexes = await this.client.listIndexes()
   *
   *     return indexes.map((index) => ({
   *       name: index.uid,
   *       provider: MySearchProviderService.identifier,
   *       document_count: index.numberOfDocuments,
   *     }))
   *   }
   * }
   */
  listIndexes(): Promise<SearchIndexInfo[]>

  /**
   * This method points a logical index at a different physical index, which the
   * Search Module uses to reindex without downtime: it seeds a shadow index, then
   * swaps it in.
   *
   * Implementing this method is optional. When it's not implemented, the module
   * reindexes in place instead, leaving the index incomplete while it's seeded.
   *
   * @param {object} input - The swap to perform.
   * @param {string} input.alias - The logical index name that must serve reads.
   * @param {string} input.index - The physical index it must point to.
   * @returns {Promise<SearchTask>} The swap's task.
   *
   * @example
   * class MySearchProviderService extends AbstractSearchProviderService {
   *   // ...
   *   async swapIndex({
   *     alias,
   *     index,
   *   }: {
   *     alias: string
   *     index: string
   *   }): Promise<SearchTypes.SearchTask> {
   *     await this.client.updateAlias(alias, index)
   *
   *     return { index, status: "succeeded" }
   *   }
   * }
   */
  swapIndex?(input: { alias: string; index: string }): Promise<SearchTask>

  /**
   * This method adds documents to an index, replacing any that already exist under the same
   * ID. The Search Module uses it both for direct writes and for seeding, where it's called
   * once per batch.
   *
   * If your engine applies writes later rather than inline, return a task with an `id` and
   * implement `waitForTask`, so the module can wait before swapping a new index in.
   *
   * Write to `input.index` but read schema information from `input.definition`:
   * during a swap, `input.index` is the shadow index being seeded, whereas the
   * definition is that of the logical index.
   *
   * @param {object} input - The documents to write.
   * @param {string} input.index - The index's physical name. This is the index to
   * write to.
   * @param {ResolvedSearchIndexDefinition} input.definition - The definition of
   * the logical index the documents belong to. Use it for schema information,
   * such as the index's `fields` or `primary_key`.
   * @param {SearchDocument[]} input.documents - The documents, each with an `id`.
   * @returns {Promise<SearchTask>} The write's task.
   *
   * @example
   * class MySearchProviderService extends AbstractSearchProviderService {
   *   // ...
   *   async upsertDocuments({
   *     index,
   *     definition,
   *     documents,
   *   }: {
   *     index: string
   *     definition: SearchTypes.ResolvedSearchIndexDefinition
   *     documents: SearchTypes.SearchDocument[]
   *   }): Promise<SearchTypes.SearchTask> {
   *     const task = await this.client.addDocuments(index, documents, {
   *       schema: definition.fields,
   *     })
   *     return { id: `${task.uid}`, index, status: "enqueued" }
   *   }
   * }
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
   * This method removes every document matching the given filters.
   *
   * Deleting by ID isn't a special case — it arrives as a filter on the primary key, such
   * as `{ id: ["prod_1", "prod_2"] }`. Recognize that shape and use your engine's
   * delete-by-ID path, which is usually much faster. If your engine can't delete by
   * arbitrary filters, either search first and delete the matching IDs, or throw.
   *
   * @param {SearchDeleteDocumentsInput} input - The index and the filters
   * selecting the documents to remove.
   * @returns {Promise<SearchTask>} The write's task.
   *
   * @example
   * class MySearchProviderService extends AbstractSearchProviderService {
   *   // ...
   *   async deleteDocuments({
   *     index,
   *     filters,
   *   }: SearchTypes.SearchDeleteDocumentsInput): Promise<SearchTypes.SearchTask> {
   *     await this.client.deleteDocumentsByFilter(index, filters)
   *     return { index, status: "succeeded" }
   *   }
   * }
   */
  deleteDocuments(input: SearchDeleteDocumentsInput): Promise<SearchTask>

  /**
   * This method removes every document from an index without deleting the index itself.
   * The Search Module uses it to empty an index before reseeding it in place.
   *
   * @param {object} input - The index to empty.
   * @param {string} input.index - The index's physical name.
   * @returns {Promise<SearchTask>} The write's task.
   *
   * @example
   * class MySearchProviderService extends AbstractSearchProviderService {
   *   // ...
   *   async clearIndex({
   *     index,
   *   }: {
   *     index: string
   *   }): Promise<SearchTypes.SearchTask> {
   *     await this.client.deleteAllDocuments(index)
   *     return { index, status: "succeeded" }
   *   }
   * }
   */
  clearIndex(input: { index: string }): Promise<SearchTask>

  /**
   * This method runs a search against an index. The Search Module will use this method in
   * its `search` and `searchMany` methods.
   *
   * The free-text query arrives as `q`, already lifted out of `filters` passed to `query.search` or
   * the Search Module's service. `attributes_to_retrieve` includes only the fields that the
   * search engine can serve.
   *
   * Compile `input.filters` to your engine's filter syntax, and reject the
   * operators it can't express rather than approximating them. Also, use
   * `input.index.physical_name` as the index to query, not `input.index.name`,
   * since the two differ under an index prefix or during a swap.
   *
   * @param {ProviderSearchQuery} input - The query, the resolved index
   * definition, and the attributes to return.
   * @returns {Promise<SearchResult>} The hits, any facets, and the metadata.
   *
   * @example
   * class MySearchProviderService extends AbstractSearchProviderService {
   *   // ...
   *   async search(
   *     input: SearchTypes.ProviderSearchQuery
   *   ): Promise<SearchTypes.SearchResult> {
   *     const response = await this.client.search(input.index.physical_name, {
   *       query: input.q,
   *       limit: input.pagination?.take,
   *     })
   *
   *     return {
   *       hits: response.hits.map((hit) => ({ id: hit.id, document: hit })),
   *       metadata: {
   *         skip: input.pagination?.skip ?? 0,
   *         take: input.pagination?.take ?? 20,
   *         count: response.total,
   *       },
   *     }
   *   }
   * }
   */
  search(input: ProviderSearchQuery): Promise<SearchResult>

  /**
   * This method runs multiple queries in a single request to the search engine.
   * The Search Module uses it for its `searchMany` method, and for disjunctive
   * faceting, which needs one query per facet.
   *
   * Implementing this method is optional. When it's not implemented, the module
   * runs the queries in parallel `search` calls instead.
   *
   * @param {ProviderSearchQuery[]} inputs - The queries to run.
   * @returns {Promise<SearchResult[]>} A result for each query, in the same order
   * as the queries.
   *
   * @example
   * class MySearchProviderService extends AbstractSearchProviderService {
   *   // ...
   *   async searchMany(
   *     inputs: SearchTypes.ProviderSearchQuery[]
   *   ): Promise<SearchTypes.SearchResult[]> {
   *     const { results } = await this.client.multiSearch(
   *       inputs.map((input) => ({
   *         indexUid: input.index.physical_name,
   *         query: input.q,
   *       }))
   *     )
   *
   *     return results.map((result, i) => this.buildResult(result, inputs[i]))
   *   }
   * }
   */
  searchMany?(inputs: ProviderSearchQuery[]): Promise<SearchResult[]>

  /**
   * This method waits until a deferred write is applied. The Search Module uses it
   * to wait for a seed to be applied before swapping the new index in.
   *
   * Implement it if your engine acknowledges writes and applies them later. When
   * it's not implemented, the module assumes a write is applied once
   * `upsertDocuments` resolves.
   *
   * @param {SearchTask} task - The task returned by the write, holding the `id`
   * that identifies it.
   * @param {object} options - The options of the wait.
   * @param {number} options.timeout_ms - How long to wait for the task before
   * giving up, in milliseconds.
   * @returns {Promise<SearchTask>} The task in its final state.
   *
   * @example
   * class MySearchProviderService extends AbstractSearchProviderService {
   *   // ...
   *   async waitForTask(
   *     task: SearchTypes.SearchTask,
   *     options?: { timeout_ms?: number }
   *   ): Promise<SearchTypes.SearchTask> {
   *     const result = await this.client.waitForTask(task.id!, {
   *       timeOutMs: options?.timeout_ms,
   *     })
   *
   *     return {
   *       ...task,
   *       status: result.status === "succeeded" ? "succeeded" : "failed",
   *     }
   *   }
   * }
   */
  waitForTask?(
    task: SearchTask,
    options?: { timeout_ms?: number }
  ): Promise<SearchTask>
}
