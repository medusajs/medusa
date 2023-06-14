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

class AdminVariantsResource extends BaseResource {
  /**
   * List product variants
   * @param query Query to filter variants by
   * @param customHeaders custom headers
   * @returns A list of variants satisfying the criteria of the query
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
   * Get a product variant
   * @param id Query to filter variants by
   * @param customHeaders custom headers
   * @returns A list of variants satisfying the criteria of the query
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
   *
   * @param variantId id of the variant to fetch inventory for
   * @param customHeaders custom headers
   * @returns
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
