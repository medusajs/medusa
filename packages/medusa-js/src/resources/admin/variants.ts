import { AdminVariantsListRes, AdminGetVariantsParams } from "@medusajs/medusa"
import { ResponsePromise } from "../.."
import BaseResource from "../base"

class AdminVariantsResource extends BaseResource {
  list(query?: AdminGetVariantsParams): ResponsePromise<AdminVariantsListRes> {
    let path = `/admin/variants`

    if (query) {
      const queryString = Object.entries(query).map(([key, value]) => {
        return `${key}=${value}`
      })

      path = `/admin/variants?${queryString.join("&")}`
    }

    return this.client.request("GET", path)
  }
}

export default AdminVariantsResource
