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
   * Create a Stock Location
   * @experimental This feature is under development and may change in the future.
   * To use this feature please install @medusajs/stock-location
   * @description gets a medusa Stock Location
   * @returns a medusa Stock Location
   */
  create(
    payload: AdminPostStockLocationsReq,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminStockLocationsRes> {
    const path = `/admin/stock-locations`
    return this.client.request("POST", path, payload, {}, customHeaders)
  }

  /**
   * Retrieve a Stock Location
   * @experimental This feature is under development and may change in the future.
   * To use this feature please install @medusajs/stock-location
   * @description gets a medusa Stock Location
   * @returns a medusa Stock Location
   */
  retrieve(
    itemId: string,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminStockLocationsRes> {
    const path = `/admin/stock-locations/${itemId}`
    return this.client.request("GET", path, undefined, {}, customHeaders)
  }

  /**
   * Update a Stock Location
   * @experimental This feature is under development and may change in the future.
   * To use this feature please install @medusajs/stock-location
   * @description updates a Stock Location
   * @returns the updated medusa Stock Location
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
   * Delete a Stock Location
   * @experimental This feature is under development and may change in the future.
   * To use this feature please install @medusajs/stock-location
   * @description deletes a Stock Location
   */
  delete(
    id: string,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminStockLocationsDeleteRes> {
    const path = `/admin/stock-locations/${id}`
    return this.client.request("DELETE", path, undefined, {}, customHeaders)
  }

  /**
   * Retrieve a list of Stock Locations
   * @experimental This feature is under development and may change in the future.
   * To use this feature please install @medusajs/stock-location
   * @description Retrieve a list of Stock Locations
   * @returns the list of Stock Locations as well as the pagination properties
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
