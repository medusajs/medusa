import { SearchTypes } from "@medusajs/types"

/**
 * ## Overview
 * 
 * A search service class is in a TypeScript or JavaScript file created in the `src/services` directory. The class must extend the `AbstractSearchService` class imported
 *  from the `@medusajs/utils` package.
 * 
 * Based on services’ naming conventions, the file’s name should be the slug version of the search service’s name without `service`, and the class’s name should be the 
 * pascal case of the search service’s name following by `Service`.
 * 
 * For example, create the `MySearchService` class in the file `src/services/my-search.ts`:
 * 
 * ```ts title="src/services/my-search.ts"
 * import { AbstractSearchService } from "@medusajs/utils"
 * 
 * class MySearchService extends AbstractSearchService {
 *   isDefault = false
 *   
 *   createIndex(indexName: string, options: Record<string, any>) {
 *     throw new Error("Method not implemented.")
 *   }
 *   getIndex(indexName: string) {
 *     throw new Error("Method not implemented.")
 *   }
 *   addDocuments(
 *     indexName: string,
 *     documents: Record<string, any>[],
 *     type: string
 *   ) {
 *     throw new Error("Method not implemented.")
 *   }
 *   replaceDocuments(
 *     indexName: string,
 *     documents: Record<string, any>[],
 *     type: string
 *   ) {
 *     throw new Error("Method not implemented.")
 *   }
 *   deleteDocument(
 *     indexName: string,
 *     document_id: string | number
 *   ) {
 *     throw new Error("Method not implemented.")
 *   }
 *   deleteAllDocuments(indexName: string) {
 *     throw new Error("Method not implemented.")
 *   }
 *   search(
 *     indexName: string,
 *     query: string, 
 *     options: Record<string, any>
 *   ) {
 *     return {
 *       message: "test",
 *     }
 *   }
 *   updateSettings(
 *     indexName: string, 
 *     settings: Record<string, any>
 *   ) {
 *     throw new Error("Method not implemented.")
 *   }
 * 
 * }
 * 
 * export default MySearchService
 * ```
 * 
 * ---
 * 
 * ## Notes About Class Methods
 * 
 * Although there are several helper methods in this class, the main methods used by the Medusa backend are `addDocuments`, `deleteDocument`, and `search`. 
 * The rest of the methods are provided in case you need them for custom use cases.
 * 
 * ---
 */
export abstract class AbstractSearchService
  implements SearchTypes.ISearchService
{
  /**
   * @ignore
   */
  static _isSearchService = true

  /**
   * @ignore
   */
  static isSearchService(obj) {
    return obj?.constructor?._isSearchService
  }

  /**
   * This property is used to pinpoint the default search service defined in the Medusa core. For custom search services, the `isDefault` property must be `false`.
   */
  abstract readonly isDefault
  /**
   * If your search service is created in a plugin, the plugin's options will be available in this property.
   */
  protected readonly options_: Record<string, unknown>

  /**
   * @ignore
   */
  get options(): Record<string, unknown> {
    return this.options_
  }

  /**
   * You can use the `constructor` of your search service to access the different services in Medusa through dependency injection.
   *
   * You can also use the constructor to initialize your integration with the third-party provider. For example, if you use a client to connect to the third-party provider’s APIs,
   * you can initialize it in the constructor and use it in other methods in the service.
   *
   * Additionally, if you’re creating your search service as an external plugin to be installed on any Medusa backend and you want to access the options added for the plugin,
   * you can access them in the constructor. The default constructor already sets the value of the class proeprty `options_` to the passed options.
   *
   * @param {MedusaContainer} container - An instance of `MedusaContainer` that allows you to access other resources, such as services, in your Medusa backend.
   * @param {Record<string, unknown>} options - If this search service is created in a plugin, the plugin's options are passed in this parameter.
   *
   * @example
   * // ...
   * import { ProductService } from "@medusajs/medusa"
   * 
   * type InjectedDependencies = {
   *   productService: ProductService
   * }
   * 
   * class MySearchService extends AbstractSearchService {
   *   // ...
   *   protected readonly productService_: ProductService
   * 
   *   constructor({ productService }: InjectedDependencies) {
   *     // @ts-expect-error prefer-rest-params
   *     super(...arguments)
   *     this.productService_ = productService
   *
   *     // you can also initialize a client that
   *     // communicates with a third-party service.
   *     this.client = new Client(options)
   *   }
   * 
   *   // ...
   * }
   */
  protected constructor(container, options) {
    this.options_ = options
  }

  /**
   * This method is used to create an index in the search engine.
   * 
   * @param {string} indexName - The name of the index to create.
   * @param {unknown} options - Any options that may be relevant to your search service. This parameter doesn't have 
   * any defined format as it depends on your custom implementation.
   * @returns {unknown} No required format of returned data, as it depends on your custom implementation.
   * 
   * @example
   * An example implementation, assuming `client` would interact with a third-party service:
   * 
   * ```ts title="src/services/my-search.ts"
   * class MySearchService extends AbstractSearchService {
   *   // ...
   *   createIndex(indexName: string, options: Record<string, any>) {
   *     return this.client_.initIndex(indexName)
   *   }
   *   // ...
   * }
   * ```
   * 
   * Another example of how the [MeiliSearch plugin](https://docs.medusajs.com/plugins/search/meilisearch) uses the
   * `options` parameter:
   * 
   * ```ts
   * class MeiliSearchService extends AbstractSearchService {
   *   // ...
   *   async createIndex(
   *     indexName: string,
   *     options: Record<string, unknown> = { primaryKey: "id" }
   *   ) {
   *     return await this.client_.createIndex(indexName, options)
   *   }
   *   // ...
   * }
   * ```
   */
  abstract createIndex(indexName: string, options: unknown): unknown

  /**
   * This method is used to retrieve an index’s results from the search engine.
   * 
   * @param {string} indexName - The name of the index
   * @returns {unknown} No required format of returned data, as it depends on your custom implementation.
   * 
   * @example
   * class MySearchService extends AbstractSearchService {
   *   // ...
   * 
   *   getIndex(indexName: string) {
   *     return this.client_.getIndex(indexName)
   *   }
   * }
   */
  abstract getIndex(indexName: string): unknown

  /**
   * This method is used to add a document to an index in the search engine.
   * 
   * When the Medusa backend loads, it triggers indexing for all products available in the Medusa backend, which uses this method to add or update documents.
   * It’s also used whenever a new product is added or a product is updated.
   * 
   * @param {string} indexName - The name of the index to add the documents to.
   * @param {unknown} documents - The list of documents to add. For example, an array of {@link entities!Product | products}.
   * @param {string} type - The type of documents being indexed. For example, `products`.
   * @returns {unknown} The response of saving the documents in the search engine, but there’s no required format of the response.
   * 
   * @example
   * class MySearchService extends AbstractSearchService {
   *   // ...
   * 
   *   async addDocuments(
   *     indexName: string,
   *     documents: Record<string, any>[],
   *     type: string
   *   ) {
   *     return await this.client_
   *       .addDocuments(indexName, documents)
   *   }
   * }
   */
  abstract addDocuments(
    indexName: string,
    documents: unknown,
    type: string
  ): unknown

  /**
   * This method is used to replace existing documents in the search engine of an index with new documents.
   * 
   * @param {string} indexName - The name of the index that the documents belong to.
   * @param {unknown} documents - The list of documents to index. For example, it can be an array of {@link entities!Product | products}.
   * Based on your search engine implementation, the documents should include an identification key that allows replacing the existing documents.
   * @param {string} type - The type of documents being replaced. For example, `products`.
   * @returns {unknown} The response of replacing the documents in the search engine, but there’s no required format of the response.
   * 
   * @example
   * class MySearchService extends AbstractSearchService {
   *   // ...
   * 
   *   async replaceDocuments(
   *     indexName: string,
   *     documents: Record<string, any>[],
   *     type: string
   *   ) {
   *     await this.client_
   *       .removeDocuments(indexName)
   *     return await this.client_
   *       .addDocuments(indexName, documents)
   *   }
   * }
   */
  abstract replaceDocuments(
    indexName: string,
    documents: unknown,
    type: string
  ): unknown

  /**
   * This method is used to delete a document from an index.
   * 
   * When a product is deleted in the Medusa backend, this method is used to delete the product from the search engine’s index.
   * 
   * @param {string} indexName - The name of the index that the document belongs to.
   * @param {string | number} document_id - The ID of the item indexed. For example, if the deleted item is a product, then this is
   * the ID of the product.
   * @returns {unknown} The response of deleting the document in the search engine, but there’s no required format of the response.
   * 
   * @example
   * class MySearchService extends AbstractSearchService {
   *   // ...
   * 
   *   async deleteDocument(
   *     indexName: string,
   *     document_id: string | number
   *   ) {
   *     return await this.client_
   *       .deleteDocument(indexName, document_id)
   *   }
   * }
   */
  abstract deleteDocument(
    indexName: string,
    document_id: string | number
  ): unknown

  /**
   * This method is used to delete all documents from an index.
   * 
   * @param {string} indexName - The index's name.
   * @returns {unknown} The response of deleting the documents of that index in the search engine, but there’s no required format of the response.
   * 
   * @example
   * class MySearchService extends AbstractSearchService {
   *   // ...
   * 
   *   async deleteAllDocuments(indexName: string) {
   *     return await this.client_
   *       .deleteDocuments(indexName)
   *   }
   * }
   */
  abstract deleteAllDocuments(indexName: string): unknown

  /**
   * This method is used to search through an index by a query.
   * 
   * In the Medusa backend, this method is used within the [Search Products API Route](https://docs.medusajs.com/api/store#products_postproductssearch) 
   * to retrieve the search results. The API route's response type is an array of items, though the item's format is not defined as it depends on the
   * data returned by this method.
   *
   * @param {string} indexName - The index's name. In the case of the Search Products API Routes, its value is `products`.
   * @param {string | null} query - The search query to retrieve results for.
   * @param {unknown} options - 
   * Options that can configure the search process. The Search Products API route passes an object having the properties:
   * 
   * - `paginationOptions`: An object having an `offset` and `limit` properties, which are passed in the API Route's body.
   * - `filter`: Filters that are passed in the API Route's request body. Its format is unknown, so you can pass filters based on your search service.
   * - `additionalOptions`: Any other parameters that may be passed in the request's body.
   * 
   * @returns {unknown} The list of results. For example, an array of products.
   * 
   * @example
   * class MySearchService extends AbstractSearchService {
   *   // ...
   * 
   *   async search(
   *     indexName: string,
   *     query: string,
   *     options: Record<string, any>
   *   ) {
   *     const hits = await this.client_
   *       .search(indexName, query)
   *     return {
   *       hits,
   *     }
   *   }
   * }
   */
  abstract search(
    indexName: string,
    query: string | null,
    options: unknown
  ): unknown

  /**
   * This method is used to update the settings of an index within the search service. This is useful if you want to update the index settings when the plugin options change.
   * 
   * For example, in the Algolia plugin, a loader, which runs when the Medusa backend loads, is used to update the settings of indices based on the plugin options. 
   * The loader uses this method to update the settings.
   * 
   * @param {string} indexName - The index's name to update its settings.
   * @param {unknown} settings - The settings to update. Its format depends on your use case.
   * @returns {unknown} The response of updating the index in the search engine, but there’s no required format of the response.
   * 
   * @example
   * class MySearchService extends AbstractSearchService {
   *   // ...
   * 
   *   async updateSettings(
   *     indexName: string,
   *     settings: Record<string, any>
   *   ) {
   *     return await this.client_
   *       .updateSettings(indexName, settings)
   *   }
   * }
   */
  abstract updateSettings(indexName: string, settings: unknown): unknown
}
