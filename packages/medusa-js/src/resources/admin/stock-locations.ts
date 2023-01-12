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

class AdminStockLocationsResource extends BaseResource {
  /**
   * Create an stock location
   * @experimental This feature is under development and may change in the future.
   * To use this feature please install @medusajs/stock-location
   * @description gets a medusa stock location
   * @returns a medusa stock location
   */
  create(
    payload: AdminPostStockLocationsReq,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminStockLocationsRes> {
    const path = `/admin/stock-locations`
    return this.client.request("POST", path, payload, {}, customHeaders)
  }

  /**
   * Retrieve an stock location
   * @experimental This feature is under development and may change in the future.
   * To use this feature please install @medusajs/stock-location
   * @description gets a medusa stock location
   * @returns a medusa stock location
   */
  retrieve(
    itemId: string,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminStockLocationsRes> {
    const path = `/admin/stock-locations/${itemId}`
    return this.client.request("GET", path, undefined, {}, customHeaders)
  }

  /**
   * Update an stock location
   * @experimental This feature is under development and may change in the future.
   * To use this feature please install @medusajs/stock-location
   * @description updates a stock location
   * @returns the updated medusa stock location
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
   * Delete a stock location
   * @experimental This feature is under development and may change in the future.
   * To use this feature please install @medusajs/stock-location
   * @description deletes a stock location
   */
  delete(
    id: string,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminStockLocationsDeleteRes> {
    const path = `/admin/stock-locations/${id}`
    return this.client.request("DELETE", path, undefined, {}, customHeaders)
  }

  /**
   * Retrieve a list of stock locations
   * @experimental This feature is under development and may change in the future.
   * To use this feature please install @medusajs/stock-location
   * @description Retrieve a list of stock locations
   * @returns the list of stock locations as well as the pagination properties
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
