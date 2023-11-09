import {
  AdminGetStockLocationsParams,
  AdminStockLocationsRes,
  AdminPostStockLocationsLocationReq,
  AdminPostStockLocationsReq,
  AdminStockLocationsListRes,
  AdminStockLocationsDeleteRes,
} from "@medusajs/medusa"
import { ResponsePromise } from "../../typings"
import BaseResource from "../base"
import qs from "qs"

/**
 * This class is used to send requests to [Admin Stock Location API Routes](https://docs.medusajs.com/api/admin#stock-locations). To use these API Routes, make sure to install the
 * [@medusajs/stock-location](https://docs.medusajs.com/modules/multiwarehouse/install-modules#stock-location-module) module in your Medusa backend.
 * 
 * All methods in this class require {@link AdminAuthResource.createSession | user authentication}. The methods
 * are available in the JS Client under the `medusa.admin.stockLocations` property.
 * 
 * A stock location, provided by the [Stock Location module](https://docs.medusajs.com/modules/multiwarehouse/stock-location-module), indicates a physical address that stock-kept items, such as physical products, can be stored in.
 * An admin can create and manage available stock locations.
 * 
 * Related Guide: [How to manage stock locations](https://docs.medusajs.com/modules/multiwarehouse/admin/manage-stock-locations).
 */
class AdminStockLocationsResource extends BaseResource {
  /**
   * Create a stock location.
   * @param {AdminPostStockLocationsReq} payload - The stock location to be created.
   * @param {Record<string, any>} customHeaders - Custom headers to attach to the request.
   * @returns {ResponsePromise<AdminStockLocationsRes>} Resolves to the stock location's details.
   * 
   * @example
   * import Medusa from "@medusajs/medusa-js"
   * const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
   * // must be previously logged in or use api token
   * medusa.admin.stockLocations.create({
   *   name: "Main Warehouse",
   * })
   * .then(({ stock_location }) => {
   *   console.log(stock_location.id);
   * })
   */
  create(
    payload: AdminPostStockLocationsReq,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminStockLocationsRes> {
    const path = `/admin/stock-locations`
    return this.client.request("POST", path, payload, {}, customHeaders)
  }

  /**
   * Retrieve a stock location's details.
   * @param {string} itemId - The stock location's ID.
   * @param {Record<string, any>} customHeaders - Custom headers to attach to the request.
   * @returns {ResponsePromise<AdminStockLocationsRes>} Resolves to the stock location's details.
   * 
   * @example
   * import Medusa from "@medusajs/medusa-js"
   * const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
   * // must be previously logged in or use api token
   * medusa.admin.stockLocations.retrieve(stockLocationId)
   * .then(({ stock_location }) => {
   *   console.log(stock_location.id);
   * })
   */
  retrieve(
    itemId: string,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminStockLocationsRes> {
    const path = `/admin/stock-locations/${itemId}`
    return this.client.request("GET", path, undefined, {}, customHeaders)
  }

  /**
   * Update a stock location's details.
   * @param {string} stockLocationId - The stock location's ID.
   * @param {AdminPostStockLocationsLocationReq} payload - The attributes to be updated in the stock location.
   * @param {Record<string, any>} customHeaders - Custom headers to attach to the request.
   * @returns {ResponsePromise<AdminStockLocationsRes>} Resolves to the stock location's details.
   * 
   * @example
   * import Medusa from "@medusajs/medusa-js"
   * const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
   * // must be previously logged in or use api token
   * medusa.admin.stockLocations.update(stockLocationId, {
   *   name: 'Main Warehouse'
   * })
   * .then(({ stock_location }) => {
   *   console.log(stock_location.id);
   * })
   */
  update(
    stockLocationId: string,
    payload: AdminPostStockLocationsLocationReq,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminStockLocationsRes> {
    const path = `/admin/stock-locations/${stockLocationId}`
    return this.client.request("POST", path, payload, {}, customHeaders)
  }

  /**
   * Delete a stock location.
   * @param {string} id - The stock location's ID.
   * @param {Record<string, any>} customHeaders - Custom headers to attach to the request.
   * @returns {ResponsePromise<AdminStockLocationsDeleteRes>} Resolves to the deletion operation's details.
   * 
   * @example
   * import Medusa from "@medusajs/medusa-js"
   * const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
   * // must be previously logged in or use api token
   * medusa.admin.stockLocations.delete(stockLocationId)
   * .then(({ id, object, deleted }) => {
   *   console.log(id)
   * })
   */
  delete(
    id: string,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminStockLocationsDeleteRes> {
    const path = `/admin/stock-locations/${id}`
    return this.client.request("DELETE", path, undefined, {}, customHeaders)
  }

  /**
   * Retrieve a list of stock locations. The stock locations can be filtered by fields such as `name` or `created_at` passed in the `query` parameter.
   * The stock locations can also be sorted or paginated.
   * @param {AdminGetStockLocationsParams} query - Filters and pagination configurations to apply on the retrieved stock locations.
   * @param {Record<string, any>} customHeaders - Custom headers to attach to the request.
   * @returns {ResponsePromise<AdminStockLocationsListRes>} Resolves to the list of stock locations with pagination fields.
   * 
   * @example
   * To list stock locations:
   * 
   * ```ts
   * import Medusa from "@medusajs/medusa-js"
   * const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
   * // must be previously logged in or use api token
   * medusa.admin.stockLocations.list()
   * .then(({ stock_locations, limit, offset, count }) => {
   *   console.log(stock_locations.length);
   * })
   * ```
   * 
   * To specify relations that should be retrieved within the stock locations:
   * 
   * ```ts
   * import Medusa from "@medusajs/medusa-js"
   * const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
   * // must be previously logged in or use api token
   * medusa.admin.stockLocations.list({
   *   expand: "address"
   * })
   * .then(({ stock_locations, limit, offset, count }) => {
   *   console.log(stock_locations.length);
   * })
   * ```
   * 
   * By default, only the first `20` records are retrieved. You can control pagination by specifying the `limit` and `offset` properties:
   * 
   * ```ts
   * import Medusa from "@medusajs/medusa-js"
   * const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
   * // must be previously logged in or use api token
   * medusa.admin.stockLocations.list({
   *   expand: "address",
   *   limit,
   *   offset
   * })
   * .then(({ stock_locations, limit, offset, count }) => {
   *   console.log(stock_locations.length);
   * })
   * ```
   */
  list(
    query?: AdminGetStockLocationsParams,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminStockLocationsListRes> {
    let path = `/admin/stock-locations`

    if (query) {
      const queryString = qs.stringify(query)
      path += `?${queryString}`
    }

    return this.client.request("GET", path, undefined, {}, customHeaders)
  }
}

export default AdminStockLocationsResource
