import {
  AdminGetInventoryItemsParams,
  AdminInventoryItemsRes,
  AdminPostInventoryItemsInventoryItemReq,
  AdminGetInventoryItemsItemLocationLevelsParams,
  AdminPostInventoryItemsItemLocationLevelsLevelReq,
  AdminInventoryItemsDeleteRes,
  AdminGetInventoryItemsItemParams,
  AdminInventoryItemsListWithVariantsAndLocationLevelsRes,
  AdminInventoryItemsLocationLevelsRes,
  AdminPostInventoryItemsItemLocationLevelsReq,
  AdminPostInventoryItemsReq,
  AdminPostInventoryItemsParams,
} from "@medusajs/medusa"
import { ResponsePromise } from "../../typings"
import BaseResource from "../base"
import qs from "qs"

class AdminInventoryItemsResource extends BaseResource {
  /**
   * Retrieve an Inventory Item
   * @experimental This feature is under development and may change in the future.
   * To use this feature please install @medusajs/inventory
   * @description gets an Inventory Item
   * @returns an Inventory Item
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
   * Update an Inventory Item
   * @experimental This feature is under development and may change in the future.
   * To use this feature please install @medusajs/inventory
   * @description updates an Inventory Item
   * @returns the updated Inventory Item
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
   * Delete an Inventory Item
   * @experimental This feature is under development and may change in the future.
   * To use this feature please install @medusajs/inventory
   * @description deletes an Inventory Item
   * @returns the deleted Inventory Item
   */
  delete(
    inventoryItemId: string,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminInventoryItemsDeleteRes> {
    const path = `/admin/inventory-items/${inventoryItemId}`
    return this.client.request("DELETE", path, undefined, {}, customHeaders)
  }

  /**
   * Create an Inventory Item
   * @experimental This feature is under development and may change in the future.
   * To use this feature please install @medusajs/inventory
   * @description creates an Inventory Item
   * @returns the created Inventory Item
   */
  create(
    payload: AdminPostInventoryItemsReq,
    query?: AdminPostInventoryItemsParams,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminInventoryItemsRes> {
    let path = `/admin/inventory-items`
    
    if (query) {
      const queryString = qs.stringify(query)
      path += `?${queryString}`
    }

    return this.client.request("POST", path, payload, {}, customHeaders)
  }

  /**
   * Retrieve a list of Inventory Items
   * @experimental This feature is under development and may change in the future.
   * To use this feature please install @medusajs/inventory
   * @description Retrieve a list of Inventory Items
   * @returns the list of Inventory Items as well as the pagination properties
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
   * Update an Inventory Item's stock level at a Stock Location
   * @experimental This feature is under development and may change in the future.
   * To use this feature please install @medusajs/inventory
   * @description updates an Inventory Item
   * @returns the updated Inventory Item
   */
  updateLocationLevel(
    inventoryItemId: string,
    locationId: string,
    payload: AdminPostInventoryItemsItemLocationLevelsLevelReq,
    query?: AdminGetInventoryItemsParams,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminInventoryItemsRes> {
    let path = `/admin/inventory-items/${inventoryItemId}/location-levels/${locationId}`

    if (query) {
      const queryString = qs.stringify(query)
      path += `?${queryString}`
    }

    return this.client.request("POST", path, payload, {}, customHeaders)
  }

  /**
   * Create stock for an Inventory Item at a Stock Location
   * @experimental This feature is under development and may change in the future.
   * To use this feature please install @medusajs/inventory
   * @description creates stock levle for an Inventory Item
   * @returns the Inventory Item
   */
  createLocationLevel(
    inventoryItemId: string,
    payload: AdminPostInventoryItemsItemLocationLevelsReq,
    query?: AdminGetInventoryItemsParams,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminInventoryItemsRes> {
    let path = `/admin/inventory-items/${inventoryItemId}/location-levels`

    if (query) {
      const queryString = qs.stringify(query)
      path += `?${queryString}`
    }

    return this.client.request("POST", path, payload, {}, customHeaders)
  }

  /**
   * Removes an Inventory Item from a Stock Location. This erases trace of any quantity currently at the location.
   * @experimental This feature is under development and may change in the future.
   * To use this feature please install @medusajs/inventory
   * @description deletes a location level of an Inventory Item
   * @returns the Inventory Item
   */
  deleteLocationLevel(
    inventoryItemId: string,
    locationId: string,
    query?: AdminGetInventoryItemsParams,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminInventoryItemsRes> {
    let path = `/admin/inventory-items/${inventoryItemId}/location-levels/${locationId}`

    if (query) {
      const queryString = qs.stringify(query)
      path += `?${queryString}`
    }

    return this.client.request("DELETE", path, undefined, {}, customHeaders)
  }

  /**
   * Retrieve a list of Inventory Levels related to an Inventory Item across Stock Locations
   * @experimental This feature is under development and may change in the future.
   * To use this feature please install @medusajs/inventory
   * @description Retrieve a list of location levels related to an Inventory Item
   * @returns the list of inventory levels related to an Inventory Item as well as the pagination properties
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
