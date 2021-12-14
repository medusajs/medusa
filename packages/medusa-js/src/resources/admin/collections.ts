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
  /**
   * @description Creates a collection.
   * @param payload
   * @returns Created collection.
   */
  create(
    payload: AdminPostCollectionsReq
  ): ResponsePromise<AdminCollectionsRes> {
    const path = `/admin/collections`
    return this.client.request("POST", path, payload)
  }

  /**
   * @description Updates a collection
   * @param id id of the collection to update.
   * @param payload update to apply to collection.
   * @returns the updated collection.
   */
  update(
    id: string,
    payload: AdminPostCollectionsCollectionReq
  ): ResponsePromise<AdminCollectionsRes> {
    const path = `/admin/collections/${id}`
    return this.client.request("POST", path, payload)
  }

  /**
   * @description deletes a collection
   * @param id id of collection to delete.
   * @returns Deleted response
   */
  delete(id: string): ResponsePromise<AdminCollectionsDeleteRes> {
    const path = `/admin/collections/${id}`
    return this.client.request("DELETE", path)
  }

  /**
   * @description get a collection
   * @param id id of the collection to retrieve.
   * @returns the collection with the given id
   */
  retrieve(id: string): ResponsePromise<AdminCollectionsListRes> {
    const path = `/admin/collections/${id}`
    return this.client.request("GET", path)
  }

  /**
   * @description Lists collections matching a query
   * @param query Query for searching collections
   * @returns a list of colllections matching the query.
   */
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
