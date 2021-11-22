import { ResponsePromise } from "../typings"
import { StoreRegionsListRes, StoreRegionsRes } from "@medusajs/medusa"
import BaseResource from "./base"

class RegionsResource extends BaseResource {
  /**
   * @description Retrieves a list of regions
   * @return {ResponsePromise<StoreRegionsListRes>}
   */
  list(): ResponsePromise<StoreRegionsListRes> {
    const path = `/store/regions`
    return this.client.request("GET", path)
  }

  /**
   * @description Retrieves a region
   * @param {string} id is required
   * @return {ResponsePromise<StoreRegionsRes>}
   */
  retrieve(id: string): ResponsePromise<StoreRegionsRes> {
    const path = `/store/regions/${id}`
    return this.client.request("GET", path)
  }
}

export default RegionsResource
