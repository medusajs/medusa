import { SearchTypes } from "@medusajs/types"

/**
 * The constructor receives the module's container as its first parameter and the
 * provider's options as its second. Create clients and connections there.
 *
 * @example
 * ```ts
 * class MySearchProviderService extends AbstractSearchProviderService {
 *   static identifier = "my-search"
 *
 *   constructor({ logger }: InjectedDependencies, options: Options) {
 *     super()
 *     this.logger_ = logger
 *     this.options_ = options
 *   }
 * }
 * ```
 */
export class AbstractSearchProviderService
  implements SearchTypes.ISearchProvider
{
  /**
   * Registered in the container as `srh_{identifier}_{id}`, where `{id}` is the
   * provider's `id` in `medusa-config.ts`. Also keys `provider_options`.
   */
  static identifier: string

  get identifier(): string {
    return (this.constructor as any).identifier
  }

  getIdentifier(): string {
    return (this.constructor as any).identifier
  }

  #notImplemented(method: string): never {
    throw new Error(
      `${method} is not implemented in ${
        Object.getPrototypeOf(this).constructor.name
      }`
    )
  }

  /* ---------------------------- index lifecycle --------------------------- */

  /**
   * Brings the index up to the given definition, creating it if missing. The
   * module only calls this on an index it is about to seed, so recreating one
   * whose schema cannot be altered in place is acceptable.
   */
  async upsertIndex(_input: {
    index: SearchTypes.ResolvedSearchIndexDefinition
  }): Promise<SearchTypes.SearchTask> {
    return this.#notImplemented("upsertIndex")
  }

  async deleteIndex(_input: {
    index: string
  }): Promise<SearchTypes.SearchTask> {
    return this.#notImplemented("deleteIndex")
  }

  async listIndexes(): Promise<SearchTypes.SearchIndexInfo[]> {
    return this.#notImplemented("listIndexes")
  }

  /* -------------------------------- documents ---------------------------- */

  async upsertDocuments(_input: {
    index: string
    documents: SearchTypes.SearchDocument[]
  }): Promise<SearchTypes.SearchTask> {
    return this.#notImplemented("upsertDocuments")
  }

  async deleteDocuments(
    _input: SearchTypes.SearchDeleteDocumentsInput
  ): Promise<SearchTypes.SearchTask> {
    return this.#notImplemented("deleteDocuments")
  }

  async clearIndex(_input: { index: string }): Promise<SearchTypes.SearchTask> {
    return this.#notImplemented("clearIndex")
  }

  /* ----------------------------------- read ------------------------------ */

  async search(
    _input: SearchTypes.ProviderSearchQuery
  ): Promise<SearchTypes.SearchResult> {
    return this.#notImplemented("search")
  }
}
