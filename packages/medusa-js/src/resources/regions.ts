import { ResponsePromise } from "../typings"
import { StoreRegionsListRes, StoreRegionsRes } from "@medusajs/medusa"
import BaseResource from "./base"

class RegionsResource extends BaseResource {
  /**
   * @description Retrieves a list of regions
   * @param customHeaders
   * @return {ResponsePromise<StoreRegionsListRes>}
   */
  list(customHeaders: Record<string, any> = {}): ResponsePromise<StoreRegionsListRes> {
    const path = `/store/regions`
    return this.client.request("GET", path, undefined, {}, customHeaders)
  }

  /**
   * @description Retrieves a region
   * @param {string} id is required
   * @param customHeaders
   * @return {ResponsePromise<StoreRegionsRes>}
   */
  retrieve(id: string, customHeaders: Record<string, any> = {}): ResponsePromise<StoreRegionsRes> {
    const path = `/store/regions/${id}`
    return this.client.request("GET", path, undefined, {}, customHeaders)
  }
}

export default RegionsResource
