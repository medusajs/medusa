import { ResponsePromise } from "../typings"
import { StoreRegionsListRes, StoreRegionsRes } from "@medusajs/medusa"
import BaseResource from "./base"

/**
 * This class is used to send requests to [Store Region API Routes](https://docs.medusajs.com/api/store#regions_getregions).
 */
class RegionsResource extends BaseResource {
  /**
   * Retrieve a list of regions. This method is useful to show the customer all available regions to choose from.
   * @param {Record<string, any>} customHeaders - Custom headers to attach to the request.
   * @returns {ResponsePromise<StoreRegionsListRes>} The list of regions with pagination fields.
   * 
   * @example
   * import Medusa from "@medusajs/medusa-js"
   * const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
   * medusa.regions.list()
   * .then(({ regions, count, limit, offset }) => {
   *   console.log(regions.length);
   * })
   */
  list(customHeaders: Record<string, any> = {}): ResponsePromise<StoreRegionsListRes> {
    const path = `/store/regions`
    return this.client.request("GET", path, undefined, {}, customHeaders)
  }

  /**
   * Retrieve a Region's details.
   * @param {string} id - The ID of the region.
   * @param {Record<string, any>} customHeaders - Custom headers to attach to the request.
   * @returns {ResponsePromise<StoreRegionsRes>} The region's details.
   * 
   * @example
   * import Medusa from "@medusajs/medusa-js"
   * const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
   * medusa.regions.retrieve(regionId)
   * .then(({ region }) => {
   *   console.log(region.id);
   * });
   */
  retrieve(id: string, customHeaders: Record<string, any> = {}): ResponsePromise<StoreRegionsRes> {
    const path = `/store/regions/${id}`
    return this.client.request("GET", path, undefined, {}, customHeaders)
  }
}

export default RegionsResource
