import {
  AdminGetProductTypesParams,
  AdminProductTypesListRes,
} from "@medusajs/medusa"
import qs from "qs"
import { ResponsePromise } from "../../typings"
import BaseResource from "../base"

class AdminProductTypesResource extends BaseResource {
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
