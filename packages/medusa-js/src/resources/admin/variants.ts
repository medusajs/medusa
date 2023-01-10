import {
  AdminGetVariantsVariantInventoryRes,
  AdminGetVariantsParams,
  AdminVariantsListRes,
} from "@medusajs/medusa"
import qs from "qs"
import { ResponsePromise } from "../.."
import BaseResource from "../base"

class AdminVariantsResource extends BaseResource {
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
