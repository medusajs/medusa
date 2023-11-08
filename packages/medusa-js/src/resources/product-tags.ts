import {
  StoreGetProductTagsParams,
  StoreProductTagsListRes,
} from "@medusajs/medusa"
import qs from "qs"
import { ResponsePromise } from "../typings"
import BaseResource from "./base"

/**
 * This class is used to send requests to [Store Product Tag API Routes](https://docs.medusajs.com/api/store#product-tags). All its method
 * are available in the JS Client under the `medusa.productTags` property.
 * 
 * Product tags are string values that can be used to filter products by.
 * Products can have more than one tag, and products can share tags.
 */
class ProductTagsResource extends BaseResource {
  /**
   * Retrieve a list of product tags. The product tags can be filtered by fields such as `id` or `q` passed in the `query` parameter. The product tags can also be sorted or paginated.
   * @param {StoreGetProductTagsParams} query - Filters and pagination configurations to apply on the retrieved product tags.
   * @param {Record<string, any>} customHeaders - Custom headers to attach to the request.
   * @returns {ResponsePromise<StoreProductTagsListRes>} Resolves to the list of product tags with pagination fields.
   * 
   * @example
   * To list product tags:
   * 
   * ```ts
   * import Medusa from "@medusajs/medusa-js"
   * const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
   * medusa.productTags.list()
   * .then(({ product_tags }) => {
   *   console.log(product_tags.length);
   * })
   * ```
   * 
   * By default, only the first `20` records are retrieved. You can control pagination by specifying the `limit` and `offset` properties:
   * 
   * ```ts
   * import Medusa from "@medusajs/medusa-js"
   * const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
   * medusa.productTags.list({
   *   limit,
   *   offset
   * })
   * .then(({ product_tags }) => {
   *   console.log(product_tags.length);
   * })
   * ```
   */
  list(
    query?: StoreGetProductTagsParams,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<StoreProductTagsListRes> {
    let path = `/store/product-tags`

    if (query) {
      const queryString = qs.stringify(query)
      path += `?${queryString}`
    }

    return this.client.request("GET", path, undefined, {}, customHeaders)
  }
}

export default ProductTagsResource
