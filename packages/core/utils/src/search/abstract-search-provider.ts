import { SearchTypes } from "@medusajs/types"

/**
 * An abstract class for search providers. Extend this class to create a search
 * provider.
 *
 * ### constructor
 *
 * The constructor allows you to access resources from the module's container using the first parameter,
 * and the provider's options using the second parameter.
 *
 * If you're creating a client with a search engine, do it in the constructor.
 * Establishing a connection with the search engine should happen in `onApplicationStart`.
 *
 * #### Example
 *
 * ```ts
 * import { Logger } from "@medusajs/framework/types"
 * import { AbstractSearchProviderService } from "@medusajs/framework/utils"
 *
 * type InjectedDependencies = {
 *   logger: Logger
 * }
 *
 * type Options = {
 *   host: string
 *   apiKey: string
 * }
 *
 * class MySearchProviderService extends AbstractSearchProviderService {
 *   static identifier = "my-search"
 *
 *   protected logger_: Logger
 *   protected options_: Options
 *   // assuming you're initializing a client
 *   protected client
 *
 *   constructor (
 *     { logger }: InjectedDependencies,
 *     options: Options
 *   ) {
 *     super()
 *
 *     this.logger_ = logger
 *     this.options_ = options
 *
 *     // assuming you're initializing a client
 *     this.client = new Client(options)
 *   }
 * }
 *
 * export default MySearchProviderService
 * ```
 *
 * ---
 *
 * ## Notes About Class Methods
 *
 * There's no list of features to declare. If a query asks for something your engine can't
 * express, throw; if an index definition asks for something it can't hold, throw from
 * `upsertIndex` so the error surfaces at startup. Returning a slightly different result is
 * the one outcome to avoid, since callers can't tell it apart from a correct one.
 *
 * `swapIndex`, `searchMany` and `waitForTask` are optional and
 * left out of this class on purpose: the Search Module treats their presence as support,
 * so only define the ones your engine can back. Implementing `swapIndex`, for example,
 * lets the module reindex without downtime instead of rebuilding in place.
 *
 * ---
 */
export class AbstractSearchProviderService
  implements SearchTypes.ISearchProvider
{
  /**
   * @example
   * class MySearchProviderService extends AbstractSearchProviderService {
   *   static identifier = "my-search"
   *   // ...
   * }
   */
  static identifier: string

  /**
   * Whether the Search Module should migrate your indexes when the application
   * starts, instead of relying on `db:migrate`.
   *
   * Set this to `true` if your indexes don't outlive the process that created
   * them, which is the case for an in-memory engine: `db:migrate` runs in its own
   * process, so anything it created is gone once it exits. The module then
   * migrates your indexes right before it seeds them, in the process that serves
   * searches.
   *
   * Leave it out if your engine holds indexes outside the Medusa process.
   *
   * @example
   * class MySearchProviderService extends AbstractSearchProviderService {
   *   static identifier = "my-search"
   *   readonly migrate_on_startup = true
   *   // ...
   * }
   */
  readonly migrate_on_startup?: boolean

  /**
   * @ignore
   */
  get identifier(): string {
    return (this.constructor as any).identifier
  }

  /**
   * @ignore
   */
  getIdentifier(): string {
    return (this.constructor as any).identifier
  }

  /**
   * This method runs a search against an index. The Search Module will use this method in
   * its `search` and `searchMany` methods.
   *
   * The free-text query arrives as `q`, already lifted out of `filters`, and
   * `attributes_to_retrieve` is already narrowed to the fields the index can return.
   *
   * @param {SearchTypes.ProviderSearchQuery} input - The query, the resolved index
   * definition, and the attributes to return.
   * @returns {Promise<SearchTypes.SearchResult>} The hits, any facets, and the metadata.
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
  async search(
    _input: SearchTypes.ProviderSearchQuery
  ): Promise<SearchTypes.SearchResult> {
    throw Error("search must be overridden by the child class")
  }

  /**
   * This method brings an index in line with its definition, creating it if it doesn't
   * exist. The Search Module calls it for every definition when migrations run.
   *
   * You may recreate the index if your engine can't alter a schema in place. That's safe:
   * the module only points this at an index it's about to seed, never at one that has to
   * keep serving reads, and never during a partial rebuild.
   *
   * @param {object} input - The index to create or update.
   * @param {SearchTypes.ResolvedSearchIndexDefinition} input.index - The definition,
   * including the `physical_name` to create it under.
   * @returns {Promise<SearchTypes.SearchTask>} The write's task.
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
  async upsertIndex(_input: {
    index: SearchTypes.ResolvedSearchIndexDefinition
  }): Promise<SearchTypes.SearchTask> {
    throw Error("upsertIndex must be overridden by the child class")
  }

  /**
   * This method deletes an index and everything in it.
   *
   * @param {object} input - The index to delete.
   * @param {string} input.index - The index's physical name.
   * @returns {Promise<SearchTypes.SearchTask>} The write's task.
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
  async deleteIndex(_input: {
    index: string
  }): Promise<SearchTypes.SearchTask> {
    throw Error("deleteIndex must be overridden by the child class")
  }

  /**
   * This method lists the indexes you hold. The Search Module reads the document counts to
   * spot an index that lost its data and needs reseeding.
   *
   * @returns {Promise<SearchTypes.SearchIndexInfo[]>} The indexes and their document counts.
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
  async listIndexes(): Promise<SearchTypes.SearchIndexInfo[]> {
    throw Error("listIndexes must be overridden by the child class")
  }

  /**
   * This method adds documents to an index, replacing any that already exist under the same
   * ID. The Search Module uses it both for direct writes and for seeding, where it's called
   * once per batch.
   *
   * If your engine applies writes later rather than inline, return a task with an `id` and
   * implement `waitForTask`, so the module can wait before swapping a new index in.
   *
   * @param {object} input - The documents to write.
   * @param {string} input.index - The index's physical name.
   * @param {SearchTypes.SearchDocument[]} input.documents - The documents, each with an `id`.
   * @returns {Promise<SearchTypes.SearchTask>} The write's task.
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
  async upsertDocuments(_input: {
    index: string
    definition: SearchTypes.ResolvedSearchIndexDefinition
    documents: SearchTypes.SearchDocument[]
  }): Promise<SearchTypes.SearchTask> {
    throw Error("upsertDocuments must be overridden by the child class")
  }

  /**
   * This method removes every document matching the given filters.
   *
   * Deleting by ID isn't a special case — it arrives as a filter on the primary key, such
   * as `{ id: ["prod_1", "prod_2"] }`. Recognize that shape and use your engine's
   * delete-by-ID path, which is usually much faster. If your engine can't delete by
   * arbitrary filters, either search first and delete the matching IDs, or throw.
   *
   * @param {SearchTypes.SearchDeleteDocumentsInput} input - The index and the filters
   * selecting the documents to remove.
   * @returns {Promise<SearchTypes.SearchTask>} The write's task.
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
  async deleteDocuments(
    _input: SearchTypes.SearchDeleteDocumentsInput
  ): Promise<SearchTypes.SearchTask> {
    throw Error("deleteDocuments must be overridden by the child class")
  }

  /**
   * This method removes every document from an index without deleting the index itself.
   *
   * @param {object} input - The index to empty.
   * @param {string} input.index - The index's physical name.
   * @returns {Promise<SearchTypes.SearchTask>} The write's task.
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
  async clearIndex(_input: { index: string }): Promise<SearchTypes.SearchTask> {
    throw Error("clearIndex must be overridden by the child class")
  }
}
