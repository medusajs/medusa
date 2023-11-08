import { ResponsePromise } from "../typings"
import { StoreRegionsListRes, StoreRegionsRes } from "@medusajs/medusa"
import BaseResource from "./base"

/**
 * This class is used to send requests to [Store Region API Routes](https://docs.medusajs.com/api/store#regions_getregions). All its method
 * are available in the JS Client under the `medusa.regions` property.
 * 
 * Regions are different countries or geographical regions that the commerce store serves customers in.
 * Customers can choose what region they're in, which can be used to change the prices shown based on the region and its currency.
 * 
 * Related Guide: [How to use regions in a storefront](https://docs.medusajs.com/modules/regions-and-currencies/storefront/use-regions)
 */
class RegionsResource extends BaseResource {
  /**
   * Retrieve a list of regions. This method is useful to show the customer all available regions to choose from.
   * @param {Record<string, any>} customHeaders - Custom headers to attach to the request.
   * @returns {ResponsePromise<StoreRegionsListRes>} Resolves to the list of regions with pagination fields.
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
   * @param {string} id - The region's ID.
   * @param {Record<string, any>} customHeaders - Custom headers to attach to the request.
   * @returns {ResponsePromise<StoreRegionsRes>} Resolves to the region's details.
   * 
   * @example
   * import Medusa from "@medusajs/medusa-js"
   * const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
   * medusa.regions.retrieve(regionId)
   * .then(({ region }) => {
   *   console.log(region.id);
   * })
   */
  retrieve(id: string, customHeaders: Record<string, any> = {}): ResponsePromise<StoreRegionsRes> {
    const path = `/store/regions/${id}`
    return this.client.request("GET", path, undefined, {}, customHeaders)
  }
}

export default RegionsResource
