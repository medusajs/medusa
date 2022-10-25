import {
  AdminGetStockLocationsParams,
  AdminStockLocationsRes,
  AdminPostStockLocationsLocationReq,
  AdminPostStockLocationsReq,
  AdminStockLocationsListRes,
} from "@medusajs/medusa"
import { ResponsePromise } from "../../typings"
import BaseResource from "../base"
import qs from "qs"

class AdminStockLocationsResource extends BaseResource {
  /** retrieve an inventory item
   * @experimental This feature is under development and may change in the future.
   * To use this feature please install @medusajs/inventory
   * @description gets a medusa inventory item
   * @returns a medusa inventory item
   */
  create(
    payload: AdminPostStockLocationsReq,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminStockLocationsRes> {
    const path = `/admin/stock-locations`
    return this.client.request("GET", path, payload, {}, customHeaders)
  }

  /** retrieve an inventory item
   * @experimental This feature is under development and may change in the future.
   * To use this feature please install @medusajs/inventory
   * @description gets a medusa inventory item
   * @returns a medusa inventory item
   */
  retrieve(
    itemId: string,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminStockLocationsRes> {
    const path = `/admin/stock-locations/${itemId}`
    return this.client.request("GET", path, undefined, {}, customHeaders)
  }

  /** update an inventory item
   * @experimental This feature is under development and may change in the future.
   * To use this feature please install @medusajs/inventory
   * @description updates an inventory item
   * @returns the updated medusa inventory item
   */
  update(
    inventoryItemId: string,
    payload: AdminPostStockLocationsLocationReq,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminStockLocationsRes> {
    const path = `/admin/stock-locations/${inventoryItemId}`
    return this.client.request("POST", path, payload, {}, customHeaders)
  }

  /**
   * Retrieve a list of inventory items
   * @experimental This feature is under development and may change in the future.
   * To use this feature please install @medusajs/inventory
   * @description Retrieve a list of inventory items
   * @returns the list of inventory items as well as the pagination properties
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
