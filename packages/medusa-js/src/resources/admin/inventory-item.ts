import {
  AdminGetInventoryItemsParams,
  AdminInventoryItemsRes,
  AdminInventoryItemsListRes,
  AdminPostInventoryItemsInventoryItemReq,
  AdminGetInventoryItemsItemLocationLevelsParams,
  AdminPostInventoryItemsItemLocationLevelsLevelReq,
  AdminInventoryItemsDeleteRes,
  AdminGetInventoryItemsItemParams,
  AdminInventoryItemsListWithVariantsAndLocationLevelsRes,
  AdminInventoryItemsLocationLevelsRes,
} from "@medusajs/medusa"
import { ResponsePromise } from "../../typings"
import BaseResource from "../base"
import qs from "qs"

class AdminInventoryItemsResource extends BaseResource {
  /**
   * Retrieve an inventory item
   * @experimental This feature is under development and may change in the future.
   * To use this feature please install @medusajs/inventory
   * @description gets an inventory item
   * @returns an inventory item
   */
  retrieve(
    inventoryItemId: string,
    query?: AdminGetInventoryItemsItemParams,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminInventoryItemsRes> {
    let path = `/admin/inventory-items/${inventoryItemId}`

    if (query) {
      const queryString = qs.stringify(query)
      path += `?${queryString}`
    }

    return this.client.request("GET", path, undefined, {}, customHeaders)
  }

  /**
   * Update an inventory item
   * @experimental This feature is under development and may change in the future.
   * To use this feature please install @medusajs/inventory
   * @description updates an inventory item
   * @returns the updated inventory item
   */
  update(
    inventoryItemId: string,
    payload: AdminPostInventoryItemsInventoryItemReq,
    query?: AdminGetInventoryItemsItemParams,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminInventoryItemsRes> {
    let path = `/admin/inventory-items/${inventoryItemId}`

    if (query) {
      const queryString = qs.stringify(query)
      path += `?${queryString}`
    }

    return this.client.request("POST", path, payload, {}, customHeaders)
  }

  /**
   * Delete an inventory item
   * @experimental This feature is under development and may change in the future.
   * To use this feature please install @medusajs/inventory
   * @description deletes an inventory item
   * @returns the deleted inventory item
   */
  delete(
    inventoryItemId: string,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminInventoryItemsDeleteRes> {
    const path = `/admin/inventory-items/${inventoryItemId}`
    return this.client.request("DELETE", path, undefined, {}, customHeaders)
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
  ): ResponsePromise<AdminInventoryItemsListWithVariantsAndLocationLevelsRes> {
    let path = `/admin/inventory-items`

    if (query) {
      const queryString = qs.stringify(query)
      path += `?${queryString}`
    }

    return this.client.request("GET", path, undefined, {}, customHeaders)
  }

  /**
   * Update an inventory item
   * @experimental This feature is under development and may change in the future.
   * To use this feature please install @medusajs/inventory
   * @description updates an inventory item
   * @returns the updated inventory item
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
   * Delete a location level of an inventory item
   * @experimental This feature is under development and may change in the future.
   * To use this feature please install @medusajs/inventory
   * @description deletes a location level of an inventory item
   * @returns the inventory item
   */
  deleteLocationLevel(
    inventoryItemId: string,
    locationId: string,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminInventoryItemsRes> {
    const path = `/admin/inventory-items/${inventoryItemId}/location-levels/${locationId}`
    return this.client.request("DELETE", path, undefined, {}, customHeaders)
  }

  /**
   * Retrieve a list of location levels related to an inventory item
   * @experimental This feature is under development and may change in the future.
   * To use this feature please install @medusajs/inventory
   * @description Retrieve a list of location levels related to an inventory item
   * @returns the list of inventory levels related to an inventory item as well as the pagination properties
   */
  listLocationLevels(
    inventoryItemId: string,
    query?: AdminGetInventoryItemsItemLocationLevelsParams,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminInventoryItemsLocationLevelsRes> {
    let path = `/admin/inventory-items/${inventoryItemId}`

    if (query) {
      const queryString = qs.stringify(query)
      path += `?${queryString}`
    }

    return this.client.request("GET", path, undefined, {}, customHeaders)
  }
}

export default AdminInventoryItemsResource
