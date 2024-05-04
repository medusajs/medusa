import {
  AdminGetProductTagsParams,
  AdminProductTagsListRes,
} from "@medusajs/medusa"
import qs from "qs"
import { ResponsePromise } from "../../typings"
import BaseResource from "../base"

/**
 * This class is used to send requests to [Admin Product Tag API Routes](https://docs.medusajs.com/api/admin#product-tags). All its method
 * are available in the JS Client under the `medusa.admin.productTags` property.
 * 
 * All methods in this class require {@link AdminAuthResource.createSession | user authentication}.
 * 
 * Product tags are string values created when you create or update a product with a new tag.
 * Products can have more than one tag, and products can share tags. This allows admins to associate products to similar tags that can be used to filter products.
 */
class AdminProductTagsResource extends BaseResource {
  /**
   * Retrieve a list of product tags. The product tags can be filtered by fields such as `q` or `value` passed in the `query` parameter. The product tags can also be sorted or paginated.
   * @param {AdminGetProductTagsParams} query - Filters and pagination configurations to apply on the retrieved product tags.
   * @returns {ResponsePromise<AdminProductTagsListRes>} Resolves to the list of product tags with pagination fields.
   * 
   * @example
   * To list product tags:
   * 
   * ```ts
   * import Medusa from "@medusajs/medusa-js"
   * const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
   * // must be previously logged in or use api token
   * medusa.admin.productTags.list()
   * .then(({ product_tags }) => {
   *   console.log(product_tags.length);
   * })
   * ```
   * 
   * By default, only the first `10` records are retrieved. You can control pagination by specifying the `limit` and `offset` properties:
   * 
   * ```ts
   * import Medusa from "@medusajs/medusa-js"
   * const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
   * // must be previously logged in or use api token
   * medusa.admin.productTags.list({
   *   limit,
   *   offset
   * })
   * .then(({ product_tags }) => {
   *   console.log(product_tags.length);
   * })
   * ```
   */
  list(
    query?: AdminGetProductTagsParams
  ): ResponsePromise<AdminProductTagsListRes> {
    let path = `/admin/product-tags`

    if (query) {
      const queryString = qs.stringify(query)
      path = `/admin/product-tags?${queryString}`
    }

    return this.client.request("GET", path)
  }
}

export default AdminProductTagsResource
