import {
  AdminGetVariantParams,
  AdminGetVariantsParams,
  AdminGetVariantsVariantInventoryRes,
  AdminVariantsListRes,
  AdminVariantsRes,
} from "@medusajs/medusa"
import qs from "qs"
import { ResponsePromise } from "../.."
import BaseResource from "../base"

/**
 * This class is used to send requests to [Admin Product Variant API Routes](https://docs.medusajs.com/api/admin#product-variants). All its method
 * are available in the JS Client under the `medusa.admin.variants` property.
 * 
 * All methods in this class require {@link AdminAuthResource.createSession | user authentication}.
 * 
 * Product variants are the actual salable item in your store. Each variant is a combination of the different option values available on the product.
 * Product variants can be managed through {@link AdminProductsResource}.
 * 
 * Related Guide: [How to manage product variants](https://docs.medusajs.com/modules/products/admin/manage-products#manage-product-variants).
 */
class AdminVariantsResource extends BaseResource {
  /**
   * Retrieve a list of product variants. The product variant can be filtered by fields such as `id` or `title` passed in the `query` parameter. The product variant can also be paginated.
   * @param {AdminGetVariantsParams} query - Filters and pagination configurations to apply on the retrieved product variants.
   * @param {Record<string, any>} customHeaders - Custom headers to attach to the request.
   * @returns {ResponsePromise<AdminVariantsListRes>} Resolves to the list of product variants with pagination fields.
   * 
   * @example
   * To list product variants:
   * 
   * ```ts
   * import Medusa from "@medusajs/medusa-js"
   * const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
   * // must be previously logged in or use api token
   * medusa.admin.variants.list()
   * .then(({ variants, limit, offset, count }) => {
   *   console.log(variants.length);
   * })
   * ```
   * 
   * To specify relations that should be retrieved within the product variants:
   * 
   * ```ts
   * import Medusa from "@medusajs/medusa-js"
   * const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
   * // must be previously logged in or use api token
   * medusa.admin.variants.list({
   *   expand: "options"
   * })
   * .then(({ variants, limit, offset, count }) => {
   *   console.log(variants.length);
   * })
   * ```
   * 
   * By default, only the first `100` records are retrieved. You can control pagination by specifying the `limit` and `offset` properties:
   * 
   * ```ts
   * import Medusa from "@medusajs/medusa-js"
   * const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
   * // must be previously logged in or use api token
   * medusa.admin.variants.list({
   *   expand: "options",
   *   limit,
   *   offset
   * })
   * .then(({ variants, limit, offset, count }) => {
   *   console.log(variants.length);
   * })
   * ```
   */
  list(
    query?: AdminGetVariantsParams,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminVariantsListRes> {
    let path = `/admin/variants`

    if (query) {
      const queryString = qs.stringify(query)
      path = `/admin/variants?${queryString}`
    }

    return this.client.request("GET", path, undefined, {}, customHeaders)
  }

  /**
   * Retrieve a product variant's details.
   * @param {string} id - The product variant's ID.
   * @param {AdminGetVariantParams} query - Configurations to apply on the retrieved product variant.
   * @param {Record<string, any>} customHeaders - Custom headers to attach to the request.
   * @returns {ResponsePromise<AdminVariantsRes>} Resolves to the product variant's details.
   * 
   * @example
   * A simple example that retrieves a product variant by its ID:
   * 
   * ```ts
   * import Medusa from "@medusajs/medusa-js"
   * const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
   * // must be previously logged in or use api token
   * medusa.admin.variants.retrieve(variantId)
   * .then(({ variant }) => {
   *   console.log(variant.id);
   * })
   * ```
   * 
   * To specify relations that should be retrieved:
   * 
   * ```ts
   * import Medusa from "@medusajs/medusa-js"
   * const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
   * // must be previously logged in or use api token
   * medusa.admin.variants.retrieve(variantId, {
   *   expand: "options"
   * })
   * .then(({ variant }) => {
   *   console.log(variant.id);
   * })
   * ```
   */
  retrieve(
    id: string,
    query?: AdminGetVariantParams,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminVariantsRes> {
    let path = `/admin/variants/${id}`

    if (query) {
      const queryString = qs.stringify(query)
      path = `/admin/variants?${queryString}`
    }

    return this.client.request("GET", path, undefined, {}, customHeaders)
  }

  /**
   * Retrieve the available inventory of a product variant.
   * @param {string} variantId - The product variant's ID.
   * @param {Record<string, any>} customHeaders - Custom headers to attach to the request.
   * @returns {ResponsePromise<AdminGetVariantsVariantInventoryRes>} Resolves to the inventory details of the product variant.
   * 
   * @example
   * import Medusa from "@medusajs/medusa-js"
   * const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
   * // must be previously logged in or use api token
   * medusa.admin.variants.getInventory(variantId)
   * .then(({ variant }) => {
   *   console.log(variant.inventory, variant.sales_channel_availability)
   * })
   */
  getInventory(
    variantId: string,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminGetVariantsVariantInventoryRes> {
    const path = `/admin/variants/${variantId}/inventory`

    return this.client.request("GET", path, undefined, {}, customHeaders)
  }
}

export default AdminVariantsResource
