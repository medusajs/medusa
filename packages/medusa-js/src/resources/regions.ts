import { AxiosPromise } from "axios"
import { StoreRegionsListRes, StoreRegionsRes } from "@medusajs/medusa"
import BaseResource from "./base"

class RegionsResource extends BaseResource {
  /**
   * @description Retrieves a list of regions
   * @return {AxiosPromise<StoreRegionsListRes>}
   */
  list(): AxiosPromise<StoreRegionsListRes> {
    const path = `/store/regions`
    return this.client.request("GET", path)
  }

  /**
   * @description Retrieves a region
   * @param {string} id is required
   * @return {AxiosPromise<StoreRegionsRes>}
   */
  retrieve(id: string): AxiosPromise<StoreRegionsRes> {
    const path = `/store/regions/${id}`
    return this.client.request("GET", path)
  }
}

export default RegionsResource
