import {
  StoreCollectionsRes,
  StoreCollectionsListRes,
  StoreGetCollectionsParams,
} from "@medusajs/medusa"
import { ResponsePromise } from "../typings"
import BaseResource from "./base"

class CollectionsResource extends BaseResource {
  /**
   * @description Retrieves a single collection
   * @param {string} id id of the collection
   * @return {ResponsePromise<StoreCollectionsRes>}
   */
  retrieve(id: string): ResponsePromise<StoreCollectionsRes> {
    const path = `/store/collections/${id}`
    return this.client.request("GET", path)
  }

  /**
   * @description Retrieves a list of collections
   * @param {string} query is optional. Can contain a limit and offset for the returned list
   * @return {ResponsePromise<StoreCollectionsListRes>}
   */
  list(
    query?: StoreGetCollectionsParams
  ): ResponsePromise<StoreCollectionsListRes> {
    let path = `/store/collections`

    if (query) {
      const queryString = Object.entries(query).map(([key, value]) => {
        return `${key}=${value}`
      })

      path = `/store/collections?${queryString.join("&")}`
    }

    return this.client.request("GET", path)
  }
}

export default CollectionsResource
