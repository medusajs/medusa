import {
  StoreGetProductTypesParams,
  StoreProductTypesListRes,
} from "@medusajs/medusa"
import qs from "qs"
import { ResponsePromise } from "../typings"
import BaseResource from "./base"

/**
 * This class is used to send requests to [Store Product Type API Routes](https://docs.medusajs.com/api/store#product-types). All its method
 * are available in the JS Client under the `medusa.productTypes` property.
 * 
 * Product types are string values that can be used to filter products by.
 * Products can have more than one tag, and products can share types.
 */
class ProductTypesResource extends BaseResource {
  /**
   * Retrieve a list of product types. The product types can be filtered by fields such as `value` or `q` passed in the `query` parameter. The product types can also be sorted or paginated.
   * @param {StoreGetProductTypesParams} query - Filters and pagination configurations to apply on retrieved product types.
   * @param {Record<string, any>} customHeaders - Custom headers to attach to the request.
   * @returns {ResponsePromise<StoreProductTypesListRes>} Resolves to the list of product types with pagination fields.
   * 
   * @example
   * To list product types:
   * 
   * ```ts
   * import Medusa from "@medusajs/medusa-js"
   * const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
   * // must be previously logged in or use api token
   * medusa.productTypes.list()
   * .then(({ product_types }) => {
   *   console.log(product_types.length);
   * })
   * ```
   * 
   * By default, only the first `20` records are retrieved. You can control pagination by specifying the `limit` and `offset` properties:
   * 
   * ```ts
   * import Medusa from "@medusajs/medusa-js"
   * const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
   * // must be previously logged in or use api token
   * medusa.productTypes.list({
   *   limit,
   *   offset
   * })
   * .then(({ product_types }) => {
   *   console.log(product_types.length);
   * })
   * ```
   */
  list(
    query?: StoreGetProductTypesParams,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<StoreProductTypesListRes> {
    let path = `/store/product-types`

    if (query) {
      const queryString = qs.stringify(query)
      path += `?${queryString}`
    }

    return this.client.request("GET", path, undefined, {}, customHeaders)
  }
}

export default ProductTypesResource
