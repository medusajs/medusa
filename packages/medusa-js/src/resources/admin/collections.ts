import {
  AdminPostCollectionsReq,
  AdminCollectionsRes,
  AdminPostCollectionsCollectionReq,
  AdminCollectionsDeleteRes,
  AdminCollectionsListRes,
  AdminGetCollectionsParams,
} from "@medusajs/medusa"
import qs from "qs"
import { ResponsePromise } from "../../typings"
import BaseResource from "../base"

class AdminCollectionsResource extends BaseResource {
  /**
   * @description Creates a collection.
   * @param payload
   * @param customHeaders
   * @returns Created collection.
   */
  create(
    payload: AdminPostCollectionsReq,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminCollectionsRes> {
    const path = `/admin/collections`
    return this.client.request("POST", path, payload, {}, customHeaders)
  }

  /**
   * @description Updates a collection
   * @param id id of the collection to update.
   * @param payload update to apply to collection.
   * @param customHeaders
   * @returns the updated collection.
   */
  update(
    id: string,
    payload: AdminPostCollectionsCollectionReq,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminCollectionsRes> {
    const path = `/admin/collections/${id}`
    return this.client.request("POST", path, payload, {}, customHeaders)
  }

  /**
   * @description deletes a collection
   * @param id id of collection to delete.
   * @param customHeaders
   * @returns Deleted response
   */
  delete(
    id: string,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminCollectionsDeleteRes> {
    const path = `/admin/collections/${id}`
    return this.client.request("DELETE", path, undefined, {}, customHeaders)
  }

  /**
   * @description get a collection
   * @param id id of the collection to retrieve.
   * @param customHeaders
   * @returns the collection with the given id
   */
  retrieve(
    id: string,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminCollectionsRes> {
    const path = `/admin/collections/${id}`
    return this.client.request("GET", path, undefined, {}, customHeaders)
  }

  /**
   * @description Lists collections matching a query
   * @param query Query for searching collections
   * @param customHeaders
   * @returns a list of collections matching the query.
   */
  list(
    query?: AdminGetCollectionsParams,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminCollectionsListRes> {
    let path = `/admin/collections`

    if (query) {
      const queryString = qs.stringify(query)
      path = `/admin/collections?${queryString}`
    }

    return this.client.request("GET", path, undefined, {}, customHeaders)
  }
}

export default AdminCollectionsResource
