import {
  AdminGetInventoryItemsParams,
  AdminInventoryItemsRes,
  AdminPostInventoryItemsItemReq,
  AdminInventoryItemsListRes,
  AdminGetInventoryItemsItemLocationLevelsParams,
  AdminPostInventoryItemsItemLocationLevelsReq,
  AdminPostInventoryItemsItemLocationLevelsLevelReq,
} from "@medusajs/medusa"
import { ResponsePromise } from "../../typings"
import BaseResource from "../base"
import qs from "qs"

class AdminInventoryItemsResource extends BaseResource {
  /** retrieve an inventory item
   * @experimental This feature is under development and may change in the future.
   * To use this feature please install @medusajs/inventory
   * @description gets a medusa inventory item
   * @returns a medusa inventory item
   */
  retrieve(
    itemId: string,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminInventoryItemsRes> {
    const path = `/admin/inventory-items/${itemId}`
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
    payload: AdminPostInventoryItemsItemReq,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminInventoryItemsRes> {
    const path = `/admin/inventory-items/${inventoryItemId}`
    return this.client.request("POST", path, payload, {}, customHeaders)
  }

  /** update an inventory item
   * @experimental This feature is under development and may change in the future.
   * To use this feature please install @medusajs/inventory
   * @description updates an inventory item
   * @returns the updated medusa inventory item
   */
  listLocationLevels(
    inventoryItemId: string,
    query?: AdminGetInventoryItemsItemLocationLevelsParams,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminInventoryItemsRes> {
    let path = `/admin/inventory-items/${inventoryItemId}/location-levels`

    if (query) {
      const queryString = qs.stringify(query)
      path += `?${queryString}`
    }

    return this.client.request("GET", path, undefined, {}, customHeaders)
  }

  /** update an inventory item
   * @experimental This feature is under development and may change in the future.
   * To use this feature please install @medusajs/inventory
   * @description updates an inventory item
   * @returns the updated medusa inventory item
   */
  deleteLocationLevel(
    inventoryItemId: string,
    locationId: string,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminInventoryItemsRes> {
    let path = `/admin/inventory-items/${inventoryItemId}/location-levels/${locationId}`

    return this.client.request("DELETE", path, undefined, {}, customHeaders)
  }

  /** update an inventory item
   * @experimental This feature is under development and may change in the future.
   * To use this feature please install @medusajs/inventory
   * @description updates an inventory item
   * @returns the updated medusa inventory item
   */
  createLocationLevel(
    inventoryItemId: string,
    payload: AdminPostInventoryItemsItemLocationLevelsReq,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminInventoryItemsRes> {
    const path = `/admin/inventory-items/${inventoryItemId}/location-levels`
    return this.client.request("POST", path, payload, {}, customHeaders)
  }

  /** update an inventory item
   * @experimental This feature is under development and may change in the future.
   * To use this feature please install @medusajs/inventory
   * @description updates an inventory item
   * @returns the updated medusa inventory item
   */
  updateLocationLevel(
    inventoryItemId: string,
    locationId: string,
    payload: AdminPostInventoryItemsItemLocationLevelsLevelReq,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminInventoryItemsRes> {
    const path = `/admin/inventory-items/${inventoryItemId}/location-levels/${locationId}`
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
    query?: AdminGetInventoryItemsParams,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminInventoryItemsListRes> {
    let path = `/admin/inventory-items`

    if (query) {
      const queryString = qs.stringify(query)
      path += `?${queryString}`
    }

    return this.client.request("GET", path, undefined, {}, customHeaders)
  }
}

export default AdminInventoryItemsResource
