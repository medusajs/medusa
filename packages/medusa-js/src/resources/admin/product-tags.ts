import {
  AdminGetProductTagsParams,
  AdminProductTagsListRes,
} from "@medusajs/medusa"
import qs from "qs"
import { ResponsePromise } from "../../typings"
import BaseResource from "../base"

class AdminProductTagsResource extends BaseResource {
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
