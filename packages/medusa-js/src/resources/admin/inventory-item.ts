import {
  AdminGetInventoryItemsItemLocationLevelsParams,
  AdminGetInventoryItemsItemParams,
  AdminGetInventoryItemsParams,
  AdminInventoryItemsDeleteRes,
  AdminInventoryItemsListWithVariantsAndLocationLevelsRes,
  AdminInventoryItemsLocationLevelsRes,
  AdminInventoryItemsRes,
  AdminPostInventoryItemsInventoryItemReq,
  AdminPostInventoryItemsItemLocationLevelsLevelReq,
  AdminPostInventoryItemsItemLocationLevelsParams,
  AdminPostInventoryItemsItemLocationLevelsReq,
  AdminPostInventoryItemsParams,
  AdminPostInventoryItemsReq,
} from "@medusajs/medusa"

import BaseResource from "../base"
import { ResponsePromise } from "../../typings"
import qs from "qs"
import { AdminPostInventoryItemsInventoryItemParams } from "@medusajs/medusa"
import { AdminPostInventoryItemsItemLocationLevelsLevelParams } from "@medusajs/medusa"

/**
 * This class is used to send requests to [Admin Inventory Item API Routes](https://docs.medusajs.com/api/admin#inventory-items). To use these API Routes, make sure to install the
 * [@medusajs/inventory](https://docs.medusajs.com/modules/multiwarehouse/install-modules#inventory-module) module in your Medusa backend. All its method
 * are available in the JS Client under the `medusa.admin.inventoryItems` property.
 * 
 * All methods in this class require {@link AdminAuthResource.createSession | user authentication}.
 * 
 * Inventory items, provided by the [Inventory Module](https://docs.medusajs.com/modules/multiwarehouse/inventory-module), can be used to manage the inventory of saleable items in your store.
 * 
 * Related Guide: [How to manage inventory items](https://docs.medusajs.com/modules/multiwarehouse/admin/manage-inventory-items).
 */
class AdminInventoryItemsResource extends BaseResource {
  /**
   * Retrieve an Inventory Item's details.
   * @param {string} inventoryItemId - The ID of the inventory item.
   * @param {AdminGetInventoryItemsItemParams} query - Configurations applied on the retrieved inventory item.
   * @param {Record<string, any>} customHeaders - Custom headers to attach to the request.
   * @returns {ResponsePromise<AdminInventoryItemsRes>} The inventory item's details.
   * 
   * @example
   * import Medusa from "@medusajs/medusa-js"
   * const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
   * // must be previously logged in or use api token
   * medusa.admin.inventoryItems.retrieve(inventoryItemId)
   * .then(({ inventory_item }) => {
   *   console.log(inventory_item.id);
   * })
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
   * Update an Inventory Item's details.
   * @param {string} inventoryItemId - The ID of the inventory item.
   * @param {AdminPostInventoryItemsInventoryItemReq} payload - The attributes to update in the inventory item.
   * @param {AdminPostInventoryItemsInventoryItemParams} query - Configurations to apply on the retrieved inventory item.
   * @param {Record<string, any>} customHeaders - Custom headers to attach to the request.
   * @returns {ResponsePromise<AdminInventoryItemsRes>} The inventory item's details.
   * 
   * @example
   * import Medusa from "@medusajs/medusa-js"
   * const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
   * // must be previously logged in or use api token
   * medusa.admin.inventoryItems.update(inventoryItemId, {
   *   origin_country: "US",
   * })
   * .then(({ inventory_item }) => {
   *   console.log(inventory_item.id);
   * })
   */
  update(
    inventoryItemId: string,
    payload: AdminPostInventoryItemsInventoryItemReq,
    query?: AdminPostInventoryItemsInventoryItemParams,
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
   * Delete an Inventory Item. This does not delete the associated product variant.
   * @param {string} inventoryItemId - The ID of the inventory item.
   * @param {Record<string, any>} customHeaders - Custom headers to attach to the request.
   * @returns {ResponsePromise<AdminInventoryItemsDeleteRes>} The deletion operation's details.
   * 
   * @example
   * import Medusa from "@medusajs/medusa-js"
   * const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
   * // must be previously logged in or use api token
   * medusa.admin.inventoryItems.delete(inventoryItemId)
   * .then(({ id, object, deleted }) => {
   *   console.log(id)
   * })
   */
  delete(
    inventoryItemId: string,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminInventoryItemsDeleteRes> {
    const path = `/admin/inventory-items/${inventoryItemId}`
    return this.client.request("DELETE", path, undefined, {}, customHeaders)
  }

  /**
   * Create an Inventory Item for a product variant.
   * @param {AdminPostInventoryItemsReq} payload - The inventory item to create.
   * @param {AdminPostInventoryItemsParams} query - Configurations to apply on the retrieved inventory item.
   * @param {Record<string, any>} customHeaders - Custom headers to attach to the request.
   * @returns {ResponsePromise<AdminInventoryItemsRes>} The inventory item's details.
   * 
   * @example
   * import Medusa from "@medusajs/medusa-js"
   * const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
   * // must be previously logged in or use api token
   * medusa.admin.inventoryItems.create({
   *   variant_id: "variant_123",
   * })
   * .then(({ inventory_item }) => {
   *   console.log(inventory_item.id);
   * })
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
   * Retrieve a list of inventory items. The inventory items can be filtered by fields such as `q` or `location_id` passed in the `query` parameter.
   * The inventory items can also be paginated.
   * @param {AdminGetInventoryItemsParams} query - Filters and pagination configurations applied on the retrieved inventory items.
   * @param {Record<string, any>} customHeaders - Custom headers to attach to the request.
   * @returns {ResponsePromise<AdminInventoryItemsListWithVariantsAndLocationLevelsRes>} The list of inventory items with pagination fields.
   * 
   * @example
   * import Medusa from "@medusajs/medusa-js"
   * const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
   * // must be previously logged in or use api token
   * medusa.admin.inventoryItems.list()
   * .then(({ inventory_items, count, offset, limit }) => {
   *   console.log(inventory_items.length);
   * })
   * 
   * @example
   * To list inventory items:
   * 
   * ```ts
   * import Medusa from "@medusajs/medusa-js"
   * const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
   * // must be previously logged in or use api token
   * medusa.admin.inventoryItems.list()
   * .then(({ inventory_items, count, offset, limit }) => {
   *   console.log(inventory_items.length);
   * })
   * ```
   * 
   * By default, only the first `20` records are retrieved. You can control pagination by specifying the `limit` and `offset` properties:
   * 
   * ```ts
   * import Medusa from "@medusajs/medusa-js"
   * const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
   * // must be previously logged in or use api token
   * medusa.admin.inventoryItems.list({
   *   limit,
   *   offset
   * })
   * .then(({ inventory_items, count, offset, limit }) => {
   *   console.log(inventory_items.length);
   * })
   * ```
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
   * Update a location level's details for a given inventory item.
   * @param {string} inventoryItemId - The ID of the inventory item that the location level belongs to.
   * @param {string} locationId - The ID of the location level to update.
   * @param {AdminPostInventoryItemsItemLocationLevelsLevelReq} payload - The attributes to update in the location level.
   * @param {AdminPostInventoryItemsItemLocationLevelsLevelParams} query - Configurations to apply on the returned inventory item.
   * @param {Record<string, any>} customHeaders - Custom headers to attach to the request.
   * @returns {ResponsePromise<AdminInventoryItemsRes>} the inventory item's details.
   * 
   * @example
   * import Medusa from "@medusajs/medusa-js"
   * const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
   * // must be previously logged in or use api token
   * medusa.admin.inventoryItems.updateLocationLevel(inventoryItemId, locationId, {
   *   stocked_quantity: 15,
   * })
   * .then(({ inventory_item }) => {
   *   console.log(inventory_item.id);
   * })
   */
  updateLocationLevel(
    inventoryItemId: string,
    locationId: string,
    payload: AdminPostInventoryItemsItemLocationLevelsLevelReq,
    query?: AdminPostInventoryItemsItemLocationLevelsLevelParams,
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
   * Create a Location Level for a given Inventory Item.
   * @param {string} inventoryItemId - The ID of the inventory item that the location level belongs to.
   * @param {AdminPostInventoryItemsItemLocationLevelsReq} payload - The location level to create.
   * @param {AdminPostInventoryItemsItemLocationLevelsParams} query - Configurations to apply on the returned inventory item.
   * @param {Record<string, any>} customHeaders - Custom headers to attach to the request.
   * @returns {ResponsePromise<AdminInventoryItemsRes>} the inventory item's details.
   * 
   * @example
   * import Medusa from "@medusajs/medusa-js"
   * const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
   * // must be previously logged in or use api token
   * medusa.admin.inventoryItems.createLocationLevel(inventoryItemId, {
   *   location_id: "sloc_123",
   *   stocked_quantity: 10,
   * })
   * .then(({ inventory_item }) => {
   *   console.log(inventory_item.id);
   * })
   */
  createLocationLevel(
    inventoryItemId: string,
    payload: AdminPostInventoryItemsItemLocationLevelsReq,
    query?: AdminPostInventoryItemsItemLocationLevelsParams,
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
   * Delete a location level of an Inventory Item.
   * @param {string} inventoryItemId - The ID of the inventory item.
   * @param {string} locationId - The ID of the location level to delete.
   * @param {AdminGetInventoryItemsParams} query - Configurations to apply on the returned inventory item.
   * @param {Record<string, any>} customHeaders - Custom headers to attach to the request.
   * @returns {ResponsePromise<AdminInventoryItemsRes>} the inventory item's details.
   * 
   * @example
   * import Medusa from "@medusajs/medusa-js"
   * const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
   * // must be previously logged in or use api token
   * medusa.admin.inventoryItems.deleteLocationLevel(inventoryItemId, locationId)
   * .then(({ inventory_item }) => {
   *   console.log(inventory_item.id);
   * })
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
   * Retrieve a list of inventory levels of an inventory item. The inventory levels can be filtered by fields such as `location_id` passed in the `query` parameter.
   * @param {string} inventoryItemId - The ID of the inventory item that the location levels belong to.
   * @param {AdminGetInventoryItemsItemLocationLevelsParams} query - Filters to apply on the retrieved location levels.
   * @param {Record<string, any>} customHeaders - Custom headers to attach to the request.
   * @returns {ResponsePromise<AdminInventoryItemsLocationLevelsRes>} The inventory item's details and list of location levels.
   * 
   * @example
   * import Medusa from "@medusajs/medusa-js"
   * const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
   * // must be previously logged in or use api token
   * medusa.admin.inventoryItems.listLocationLevels(inventoryItemId)
   * .then(({ inventory_item }) => {
   *   console.log(inventory_item.location_levels);
   * })
   */
  listLocationLevels(
    inventoryItemId: string,
    query?: AdminGetInventoryItemsItemLocationLevelsParams,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminInventoryItemsLocationLevelsRes> {
    let path = `/admin/inventory-items/${inventoryItemId}/location-levels`

    if (query) {
      const queryString = qs.stringify(query)
      path += `?${queryString}`
    }

    return this.client.request("GET", path, undefined, {}, customHeaders)
  }
}

export default AdminInventoryItemsResource
