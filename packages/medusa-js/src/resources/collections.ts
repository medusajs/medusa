import {
  StoreCollectionsRes,
  StoreCollectionsListRes,
  StoreGetCollectionsParams,
} from "@medusajs/medusa"
import qs from "qs"
import { ResponsePromise } from "../typings"
import BaseResource from "./base"

/**
 * This class is used to send requests to [Store Product Collection API Routes](https://docs.medusajs.com/api/store#product-collections). All its method
 * are available in the JS Client under the `medusa.collections` property.
 * 
 * A product collection is used to organize products for different purposes such as marketing or discount purposes. For example, you can create a Summer Collection.
 * Using the methods in this class, you can list or retrieve a collection's details and products.
 */
class CollectionsResource extends BaseResource {
  /**
   * Retrieve a product collection's details.
   * @param {string} id - The ID of the product collection.
   * @param {Record<string, any>} customHeaders - Custom headers to attach to the request.
   * @returns {ResponsePromise<StoreCollectionsRes>} Resolves to the collection's details.
   * 
   * @example
   * import Medusa from "@medusajs/medusa-js"
   * const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
   * medusa.collections.retrieve(collectionId)
   * .then(({ collection }) => {
   *   console.log(collection.id);
   * })
   */
  retrieve(id: string, customHeaders: Record<string, any> = {}): ResponsePromise<StoreCollectionsRes> {
    const path = `/store/collections/${id}`
    return this.client.request("GET", path, undefined, {}, customHeaders)
  }

  /**
   * Retrieve a list of product collections. The product collections can be filtered by fields such as `handle` or `created_at` passed in the `query` parameter. 
   * The product collections can also be paginated.
   * @param {StoreGetCollectionsParams} query - Filters and pagination configurations to apply on the retrieved product collections.
   * @param {Record<string, any>} customHeaders - Custom headers to attach to the request.
   * @returns {ResponsePromise<StoreCollectionsListRes>} Resolves to the list of product collections with pagination fields.
   * 
   * @example
   * To list product collections:
   * 
   * ```ts
   * import Medusa from "@medusajs/medusa-js"
   * const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
   * medusa.collections.list()
   * .then(({ collections, limit, offset, count }) => {
   *   console.log(collections.length);
   * })
   * ```
   * 
   * By default, only the first `10` records are retrieved. You can control pagination by specifying the `limit` and `offset` properties:
   * 
   * ```ts
   * import Medusa from "@medusajs/medusa-js"
   * const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
   * medusa.collections.list({
   *   limit,
   *   offset
   * })
   * .then(({ collections, limit, offset, count }) => {
   *   console.log(collections.length);
   * })
   * ```
   */
  list(
    query?: StoreGetCollectionsParams,
    customHeaders: Record<string, any> = {}): ResponsePromise<StoreCollectionsListRes> {
    let path = `/store/collections`

    if (query) {
      const queryString = qs.stringify(query)
      path = `/store/collections?${queryString}`
    }

    return this.client.request("GET", path, undefined, {}, customHeaders)
  }
}

export default CollectionsResource
