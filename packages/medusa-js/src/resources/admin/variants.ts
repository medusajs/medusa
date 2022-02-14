import { AdminVariantsListRes, AdminGetVariantsParams } from "@medusajs/medusa"
import qs from "qs"
import { ResponsePromise } from "../.."
import BaseResource from "../base"

class AdminVariantsResource extends BaseResource {
  list(query?: AdminGetVariantsParams, customHeaders: Record<string, any> = {}): ResponsePromise<AdminVariantsListRes> {
    let path = `/admin/variants`

    if (query) {
      const queryString = qs.stringify(query)
      path = `/admin/variants?${queryString}`
    }

    return this.client.request("GET", path, {}, {}, customHeaders)
  }
}

export default AdminVariantsResource
