import { Event } from "../event-bus"
import { IModuleService } from "../modules-sdk"
import { SearchDocument, SearchTask } from "./common"
import { SearchFilters } from "./filters"
import { ResolvedSearchIndexDefinition } from "./index-definition"
import { SearchIndexDetails } from "./index-info"
import { SearchIndexMigrationAction } from "./migration"
import { SearchQuery } from "./query"
import { SearchResult } from "./result"

/**
 * The strategy used to rebuild a search index:
 *
 * - `swap` seeds a shadow index and aliases over on completion, keeping the live
 * index serving throughout.
 * - `in_place` upserts into the live index, which is cheaper but leaves stale
 * documents behind for anything the seed no longer produces.
 *
 * `swap` requires a provider that implements `swapIndex`. The module falls back
 * to `in_place` for providers that don't.
 */
export type SearchReindexStrategy = "swap" | "in_place"

/**
 * The input for reindexing one or more search indexes.
 */
export interface SearchReindexInput {
  /**
   * The name of the index, or the names of the indexes, to rebuild. If not
   * provided, every registered index is rebuilt.
   */
  index?: string | string[]

  /**
   * The strategy to rebuild the index with.
   *
   * @default "swap"
   */
  strategy?: SearchReindexStrategy

  /**
   * Filters passed to the index definition's `seed` function to rebuild only a
   * subset of the index's documents.
   */
  filters?: Record<string, unknown>
}

/**
 * The result returned after a reindex operation is initiated.
 */
export interface SearchReindexResult {
  /**
   * The ID of the background job performing the reindex.
   */
  job_id: string

  /**
   * The names of the indexes being rebuilt.
   */
  indexes: string[]
}

export interface ISearchModuleService extends IModuleService {
  /**
   * This method searches an index for documents matching the given query. The
   * Search Module resolves the index's provider and delegates the query to it.
   *
   * The free-text query is passed as `q` among the `filters`.
   *
   * @param {SearchQuery} query - The query to run against the search index.
   * @returns {Promise<SearchResult<T>>} The matching hits, any requested facets,
   * and the result's metadata.
   *
   * @example
   * A simple example that searches an index for a free-text query:
   *
   * ```ts
   * const result = await searchModuleService.search({
   *   entity: "product",
   *   filters: {
   *     q: "shirt",
   *   },
   * })
   * ```
   *
   * To filter, paginate, sort, and retrieve facets:
   *
   * ```ts
   * const result = await searchModuleService.search({
   *   entity: "product",
   *   fields: ["id", "title", "variants.sku"],
   *   filters: {
   *     q: "shirt",
   *     status: "published",
   *     "variants.price": { $lte: 5000 },
   *   },
   *   pagination: {
   *     skip: 0,
   *     take: 20,
   *     order: { _score: "DESC" },
   *   },
   *   search_options: {
   *     facets: ["type_id"],
   *   },
   * })
   * ```
   */
  search<T = Record<string, unknown>>(
    query: SearchQuery
  ): Promise<SearchResult<T>>

  /**
   * This method runs multiple search queries in a single call. Use it to run
   * queries against different indexes, or the same index with different filters,
   * without paying for a round trip per query.
   *
   * If the index's provider implements `searchMany`, the queries are batched into
   * a single request to the search engine. Otherwise, the module runs them in
   * parallel.
   *
   * @param {SearchQuery[]} queries - The queries to run against search indexes.
   * @returns {Promise<SearchResult[]>} The list of search results, in the same
   * order as the queries.
   *
   * @example
   * const results = await searchModuleService.searchMany([
   *   {
   *     entity: "product",
   *     filters: { q: "shirt" },
   *   },
   *   {
   *     entity: "product",
   *     filters: { q: "pants" },
   *   },
   * ])
   */
  searchMany(queries: SearchQuery[]): Promise<SearchResult[]>

  /**
   * This method adds documents to an index, replacing any document that already
   * exists under the same ID.
   *
   * Prefer keeping an index up to date through its definition's `events` and
   * `consume` functions. Use this method for documents that no event describes,
   * such as data coming from a third-party system.
   *
   * The returned task isn't waited on. A provider that applies writes lazily
   * leaves the task's status as `enqueued`, and it's the caller's choice whether
   * reading its own write back matters enough to wait for the task.
   *
   * @param {object} input - The documents to write.
   * @param {string} input.index - The name of the index to write to.
   * @param {SearchDocument[]} input.documents - The documents to write. Each
   * document must have an `id` property holding the index's primary key.
   * @returns {Promise<SearchTask>} The write's task.
   *
   * @example
   * const task = await searchModuleService.upsertDocuments({
   *   index: "product",
   *   documents: [
   *     {
   *       id: "prod_123",
   *       title: "Shirt",
   *     },
   *   ],
   * })
   */
  upsertDocuments(input: {
    index: string
    documents: SearchDocument[]
  }): Promise<SearchTask>

  /**
   * This method removes every document in an index matching the specified filters.
   *
   * Deleting by ID isn't a special case: it's a filter on the index's primary
   * key, such as `{ id: ["prod_1"] }`.
   *
   * @param {object} input - The documents to remove.
   * @param {string} input.index - The name of the index to delete from.
   * @param {SearchFilters} input.filters - The filters selecting the documents to
   * remove. At least one filter is required.
   * @returns {Promise<SearchTask>} The write's task.
   *
   * @example
   * To delete documents by ID:
   *
   * ```ts
   * const task = await searchModuleService.deleteDocuments({
   *   index: "product",
   *   filters: {
   *     id: ["prod_123", "prod_456"],
   *   },
   * })
   * ```
   *
   * To delete every document matching a filter:
   *
   * ```ts
   * const task = await searchModuleService.deleteDocuments({
   *   index: "product",
   *   filters: {
   *     status: "draft",
   *   },
   * })
   * ```
   */
  deleteDocuments(input: {
    index: string
    filters: SearchFilters
  }): Promise<SearchTask>

  /**
   * This method applies an event to every index that declared it in its
   * definition's `events`, using each index's `consume` function to turn the
   * event into document writes or deletions.
   *
   * The Search Module subscribes to the declared events and calls this method for
   * you. You only need to call it directly to replay an event, or to ingest an
   * event that wasn't emitted through the Event Bus Module.
   *
   * The returned promise resolves once the search engine has accepted the
   * writes. Failures are thrown, leaving redelivery to the event bus.
   *
   * @param {Event<any>} event - The event to apply.
   * @returns {Promise<SearchTask[]>} One task per write. An event that no index
   * declared resolves to an empty array.
   *
   * @example
   * const tasks = await searchModuleService.ingest({
   *   name: "product.updated",
   *   data: {
   *     id: "prod_123",
   *   },
   * })
   */
  ingest(event: Event<any>): Promise<SearchTask[]>

  /**
   * This method retrieves the registered indexes, their status, and the leaf
   * fields each of them stores. Definitions that haven't been migrated yet are
   * included with a `pending` status.
   *
   * @returns {Promise<SearchIndexDetails[]>} The registered indexes.
   *
   * @example
   * const indexes = await searchModuleService.listIndexes()
   */
  listIndexes(): Promise<SearchIndexDetails[]>

  /**
   * This method retrieves the field paths an index can return. `query.search`
   * uses it to split the fields a caller asked for between the search engine and
   * `query.graph`.
   *
   * @param {string} index - The name of the index.
   * @returns {string[]} The retrievable field paths, such as `title` or
   * `variants.sku`.
   *
   * @example
   * const fields = searchModuleService.listRetrievableFields("product")
   */
  listRetrievableFields(index: string): string[]

  /**
   * This method retrieves an index's definition with the module's defaults
   * applied: the provider it resolved to, the physical index behind it, and the
   * `primary_key` its documents are keyed by, which is what a hit's `id` holds.
   *
   * @param {string} index - The name of the index.
   * @returns {ResolvedSearchIndexDefinition} The resolved index definition.
   *
   * @example
   * const definition = searchModuleService.getIndex("product")
   */
  getIndex(index: string): ResolvedSearchIndexDefinition

  /**
   * This method triggers a background job that rebuilds one or more indexes from
   * their definitions' `seed` functions. Medusa handles reindexing automatically, as explained
   * in the [Reindexing and Migrations Guide](https://docs.medusajs.com/resources/infrastructure-modules/search/reindexing).
   * This method is useful to trigger the reindex manually after changing what a `seed`
   * produces, or to recover an index whose documents drifted from their source
   * of truth.
   *
   * The job is started, not awaited: the returned result only tells you which
   * indexes are being rebuilt.
   *
   * @param {SearchReindexInput} input - The reindex options, such as which
   * indexes to rebuild and what strategy to use. If not provided, every index is
   * rebuilt with the `swap` strategy.
   * @returns {Promise<SearchReindexResult>} The ID of the job performing the
   * reindex, and the indexes it rebuilds.
   *
   * @example
   * To rebuild a single index:
   *
   * ```ts
   * const { job_id } = await searchModuleService.reindex({
   *   index: "product",
   * })
   * ```
   *
   * To rebuild part of an index in place:
   *
   * ```ts
   * const { job_id } = await searchModuleService.reindex({
   *   index: "product",
   *   strategy: "in_place",
   *   filters: {
   *     collection_id: "pcol_123",
   *   },
   * })
   * ```
   */
  reindex(input?: SearchReindexInput): Promise<SearchReindexResult>

  /**
   * This method plans what it would take to bring the physical indexes in line
   * with the loaded index definitions. Planning is separate from executing it. It's
   * useful for printing the actions, or executing them later with {@link executeIndexMigrationPlan}.
   *
   * @privateRemarks
   * This method is useful for `db:migrate` can print the actions before running them.
   *
   * @returns {Promise<SearchIndexMigrationAction[]>} The actions required to
   * bring the physical indexes in line with the definitions. Indexes that are
   * already up to date are returned as `noop` actions.
   *
   * @example
   * const actions = await searchModuleService.createIndexMigrationPlan()
   */
  createIndexMigrationPlan(): Promise<SearchIndexMigrationAction[]>

  /**
   * This method executes a migration plan, creating and altering physical
   * indexes. Every action is idempotent, so executing the same plan twice is a
   * no-op.
   *
   * The indexes this method creates are filled by the seed that runs at
   * application start, so an index it creates serves nothing until then.
   *
   * @param {SearchIndexMigrationAction[]} actions - The actions to execute, as
   * returned by {@link createIndexMigrationPlan}.
   * @returns {Promise<void>} Resolves when the physical indexes are created and
   * altered.
   *
   * @example
   * const actions = await searchModuleService.createIndexMigrationPlan()
   * await searchModuleService.executeIndexMigrationPlan(actions)
   */
  executeIndexMigrationPlan(
    actions: SearchIndexMigrationAction[]
  ): Promise<void>
}
