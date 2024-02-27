import {
  AdminGetProductTypesParams,
  AdminProductTypesListRes,
} from "@medusajs/medusa"
import qs from "qs"
import { ResponsePromise } from "../../typings"
import BaseResource from "../base"

/**
 * This class is used to send requests to [Admin Product Type API Routes](https://docs.medusajs.com/api/admin#product-types). All its method
 * are available in the JS Client under the `medusa.admin.productTypes` property.
 * 
 * All methods in this class require {@link AdminAuthResource.createSession | user authentication}.
 * 
 * Product types are string values created when you create or update a product with a new type.
 * Products can have one type, and products can share types. This allows admins to associate products with a type that can be used to filter products.
 */
class AdminProductTypesResource extends BaseResource {
  /**
   * Retrieve a list of product types. The product types can be filtered by fields such as `q` or `value` passed in the `query` parameter.
   * The product types can also be sorted or paginated.
   * @param {AdminGetProductTypesParams} query - Filters and pagination configurations to apply on the retrieved product types.
   * @param {Record<string, any>} customHeaders - Custom headers to attach to the request.
   * @returns {ResponsePromise<AdminProductTypesListRes>} Resolves to the list of product types with pagination fields.
   * 
   * @example
   * To list product types:
   * 
   * ```ts
   * import Medusa from "@medusajs/medusa-js"
   * const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
   * // must be previously logged in or use api token
   * medusa.admin.productTypes.list()
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
   * medusa.admin.productTypes.list({
   *   limit,
   *   offset
   * })
   * .then(({ product_types }) => {
   *   console.log(product_types.length);
   * })
   * ```
   */
  list(
    query?: AdminGetProductTypesParams,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminProductTypesListRes> {
    let path = `/admin/product-types`

    if (query) {
      const queryString = qs.stringify(query)
      path += `?${queryString}`
    }

    return this.client.request("GET", path, undefined, {}, customHeaders)
  }
}

export default AdminProductTypesResource
