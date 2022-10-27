import {
  AdminVariantInventoryRes,
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

  listInventoryItems(
    id: string,
    query?: Record<string, string>,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminVariantInventoryRes> {
    let path = `/admin/variants/${id}/inventory`

    if (query) {
      const queryString = qs.stringify(query)
      path += `?${queryString}`
    }

    return this.client.request("GET", path, undefined, {}, customHeaders)
  }
}

export default AdminVariantsResource
