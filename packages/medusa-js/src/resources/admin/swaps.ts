import {
  AdminSwapsRes,
  AdminSwapsListRes,
  AdminGetSwapsParams,
} from "@medusajs/medusa"
import { ResponsePromise } from "../../typings"
import BaseResource from "../base"

class AdminSwapsResource extends BaseResource {
  retrieve(id: string): ResponsePromise<AdminSwapsRes> {
    const path = `/admin/swaps/${id}`
    return this.client.request("GET", path)
  }

  list(query: AdminGetSwapsParams): ResponsePromise<AdminSwapsListRes> {
    let path = `/admin/swaps/`

    if (query) {
      const queryString = Object.entries(query).map(([key, value]) => {
        return `${key}=${value}`
      })

      path = `/admin/swaps?${queryString.join("&")}`
    }

    return this.client.request("GET", path)
  }
}

export default AdminSwapsResource
