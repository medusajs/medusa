import { SearchTypes } from "@medusajs/types"

/**
 * An abstract class for search providers. Extend this class to create a search
 * provider.
 *
 * A search provider translates the Search Module's provider-agnostic input into
 * the calls of a search engine, such as Meilisearch or Typesense: it creates and
 * migrates the physical indexes, writes and deletes documents, and runs queries.
 * The Search Module owns everything around it, including index definitions,
 * batching, task tracking, and reindexing.
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
 * ### Handling unsupported features
 *
 * There's no list of features to declare. If a query asks for something your engine can't
 * express, throw; if an index definition asks for something it can't hold, throw from
 * `upsertIndex` so the error surfaces at startup. Returning a slightly different result is
 * the one outcome to avoid, since callers can't tell it apart from a correct one.
 *
 * @privateRemarks
 *
 * `swapIndex` and `waitForTask` are optional and left out of this class on
 * purpose: the Search Module treats their presence as support, so only define
 * the ones your engine can back. `searchMany` has a default that runs `search`
 * concurrently; override it to pack the queries into one engine round-trip.
 * Implementing `swapIndex`, for example, lets the module reindex without
 * downtime instead of rebuilding in place. Refer to the `ISearchProvider`
 * interface for their expected parameters and return values.
 */
export class AbstractSearchProviderService
  implements SearchTypes.ISearchProvider
{
  /**
   * Each search provider has a unique identifier used to register it and to bind
   * an index definition to it. An index definition selects a provider by setting
   * its `provider` property to this identifier. You can also use this identifier
   * in `medusa-config.ts` to configure the default provider for the Search Module.
   *
   * @example
   * class MySearchProviderService extends AbstractSearchProviderService {
   *   static identifier = "my-search"
   *   // ...
   * }
   */
  static identifier: string

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
   * Compile `input.filters` to your engine's filter syntax, and reject the
   * operators it can't express rather than approximating them. Also, use
   * `input.index.physical_name` as the index to query, not `input.index.name`,
   * since the two differ under an index prefix or during a swap.
   *
   * @param {SearchTypes.ProviderSearchQuery} _input - The query, the resolved index
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
   * This method runs multiple queries in a single request to the search engine.
   * The Search Module uses it for its `searchMany` method, including the extra
   * queries produced by disjunctive faceting.
   *
   * The default runs `search` concurrently. Override it to pack the queries into
   * one engine round-trip.
   *
   * @param {SearchTypes.ProviderSearchQuery[]} inputs - The queries to run.
   * @returns {Promise<SearchTypes.SearchResult[]>} A result for each query, in
   * the same order as the queries.
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
  async searchMany(
    inputs: SearchTypes.ProviderSearchQuery[]
  ): Promise<SearchTypes.SearchResult[]> {
    return await Promise.all(inputs.map((input) => this.search(input)))
  }

  /**
   * This method brings an index in line with its definition, creating it if it doesn't
   * exist. The Search Module calls it for every definition when migrations run.
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
   * @param {object} _input - The index to create or update.
   * @param {SearchTypes.ResolvedSearchIndexDefinition} _input.index - The definition,
   * including the `physical_name` to create it under, the `primary_key` its
   * documents are keyed by, the `fields` it holds, and its `settings`.
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
   * This method deletes an index and everything in it. The Search Module calls it
   * to clean up an index it replaced, such as the index left behind by a swap.
   *
   * @param {object} _input - The index to delete.
   * @param {string} _input.index - The index's physical name.
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
   * Write to `input.index` but read schema information from `input.definition`:
   * during a swap, `input.index` is the shadow index being seeded, whereas the
   * definition is that of the logical index.
   *
   * @param {object} _input - The documents to write.
   * @param {string} _input.index - The index's physical name. This is the index to
   * write to.
   * @param {SearchTypes.ResolvedSearchIndexDefinition} _input.definition - The
   * definition of the logical index the documents belong to. Use it for schema
   * information, such as the index's `fields` or `primary_key`.
   * @param {SearchTypes.SearchDocument[]} _input.documents - The documents, each with an `id`.
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
   * @param {SearchTypes.SearchDeleteDocumentsInput} _input - The index and the filters
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
   * The Search Module uses it to empty an index before reseeding it in place.
   *
   * @param {object} _input - The index to empty.
   * @param {string} _input.index - The index's physical name.
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
