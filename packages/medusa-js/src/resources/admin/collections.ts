import {
  AdminPostCollectionsReq,
  AdminCollectionsRes,
  AdminPostCollectionsCollectionReq,
  AdminCollectionsDeleteRes,
  AdminCollectionsListRes,
  AdminGetCollectionsParams,
} from "@medusajs/medusa"
import { ResponsePromise } from "../../typings"
import BaseResource from "../base"

class AdminCollectionsResource extends BaseResource {
  create(
    payload: AdminPostCollectionsReq
  ): ResponsePromise<AdminCollectionsRes> {
    const path = `/admin/collections`
    return this.client.request("POST", path, payload)
  }

  update(
    id: string,
    payload: AdminPostCollectionsCollectionReq
  ): ResponsePromise<AdminCollectionsRes> {
    const path = `/admin/collections/${id}`
    return this.client.request("POST", path, payload)
  }

  delete(id: string): ResponsePromise<AdminCollectionsDeleteRes> {
    const path = `/admin/collections/${id}`
    return this.client.request("DELETE", path)
  }

  retrieve(id: string): ResponsePromise<AdminCollectionsListRes> {
    const path = `/admin/collections/${id}`
    return this.client.request("GET", path)
  }

  list(
    query?: AdminGetCollectionsParams
  ): ResponsePromise<AdminCollectionsListRes> {
    let path = `/admin/collections`

    if (query) {
      const queryString = Object.entries(query).map(([key, value]) => {
        return typeof value !== "undefined" ? `${key}=${value}` : ""
      })
      path = `/admin/collections?${queryString.join("&")}`
    }

    return this.client.request("GET", path)
  }
}

export default AdminCollectionsResource
