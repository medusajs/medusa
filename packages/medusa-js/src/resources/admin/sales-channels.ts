import {
  AdminDeleteSalesChannelsChannelProductsBatchReq,
  AdminDeleteSalesChannelsChannelStockLocationsReq,
  AdminGetSalesChannelsParams,
  AdminPostSalesChannelsChannelProductsBatchReq,
  AdminPostSalesChannelsChannelStockLocationsReq,
  AdminPostSalesChannelsReq,
  AdminPostSalesChannelsSalesChannelReq,
  AdminSalesChannelsDeleteRes,
  AdminSalesChannelsListRes,
  AdminSalesChannelsRes,
} from "@medusajs/medusa"
import qs from "qs"
import { ResponsePromise } from "../../typings"
import BaseResource from "../base"

/**
 * This class is used to send requests to [Admin Sales Channel API Routes](https://docs.medusajs.com/api/admin#sales-channels). All its method
 * are available in the JS Client under the `medusa.admin.salesChannels` property.
 * 
 * All methods in this class require {@link AdminAuthResource.createSession | user authentication}.
 * 
 * A sales channel indicates a channel where products can be sold in. For example, a webshop or a mobile app.
 * Admins can manage sales channels and the products available in them.
 * 
 * Related Guide: [How to manage sales channels](https://docs.medusajs.com/modules/sales-channels/admin/manage).
 */
class AdminSalesChannelsResource extends BaseResource {
  /**
   * Retrieve a sales channel's details.
   * @param {string} salesChannelId - The sales channel's ID.
   * @param {Record<string, any>} customHeaders - Custom headers to attach to the request.
   * @returns {ResponsePromise<AdminSalesChannelsRes>} Resolves to the sales channel's details.
   * 
   * @example
   * import Medusa from "@medusajs/medusa-js"
   * const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
   * // must be previously logged in or use api token
   * medusa.admin.salesChannels.retrieve(salesChannelId)
   * .then(({ sales_channel }) => {
   *   console.log(sales_channel.id)
   * })
   */
  retrieve(
    salesChannelId: string,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminSalesChannelsRes> {
    const path = `/admin/sales-channels/${salesChannelId}`
    return this.client.request("GET", path, undefined, {}, customHeaders)
  }

  /**
   * Create a sales channel.
   * @param {AdminPostSalesChannelsReq} payload - The sales channel to create.
   * @param {Record<string, any>} customHeaders - Custom headers to attach to the request.
   * @returns {ResponsePromise<AdminSalesChannelsRes>} Resolves to the sales channel's details.
   * 
   * @example
   * import Medusa from "@medusajs/medusa-js"
   * const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
   * // must be previously logged in or use api token
   * medusa.admin.salesChannels.create({
   *   name: "App",
   *   description: "Mobile app"
   * })
   * .then(({ sales_channel }) => {
   *   console.log(sales_channel.id);
   * })
   */
  create(
    payload: AdminPostSalesChannelsReq,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminSalesChannelsRes> {
    const path = `/admin/sales-channels`
    return this.client.request("POST", path, payload, {}, customHeaders)
  }

  /**
   * Update a sales channel's details.
   * @param {string} salesChannelId - The sales channel's ID.
   * @param {AdminPostSalesChannelsSalesChannelReq} payload - The attributes to update in the sales channel.
   * @param {Record<string, any>} customHeaders - Custom headers to attach to the request.
   * @returns {ResponsePromise<AdminSalesChannelsRes>} Resolves to the sales channel's details.
   * 
   * @example
   * import Medusa from "@medusajs/medusa-js"
   * const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
   * // must be previously logged in or use api token
   * medusa.admin.salesChannels.update(salesChannelId, {
   *   name: "App"
   * })
   * .then(({ sales_channel }) => {
   *   console.log(sales_channel.id)
   * })
   */
  update(
    salesChannelId: string,
    payload: AdminPostSalesChannelsSalesChannelReq,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminSalesChannelsRes> {
    const path = `/admin/sales-channels/${salesChannelId}`
    return this.client.request("POST", path, payload, {}, customHeaders)
  }

  /**
   * Retrieve a list of sales channels. The sales channels can be filtered by fields such as `q` or `name` passed in the `query` parameter. The sales channels can also be sorted or paginated.
   * @param {AdminGetSalesChannelsParams} query - Filters and pagination configurations applied on the retrieved sales channels.
   * @param {Record<string, any>} customHeaders - Custom headers to attach to the request.
   * @returns {ResponsePromise<AdminSalesChannelsListRes>} Resolves to the list of sales channels with pagination fields.
   * 
   * @example
   * To list sales channels:
   * 
   * ```ts
   * import Medusa from "@medusajs/medusa-js"
   * const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
   * // must be previously logged in or use api token
   * medusa.admin.salesChannels.list()
   * .then(({ sales_channels, limit, offset, count }) => {
   *   console.log(sales_channels.length)
   * })
   * ```
   * 
   * To specify relations that should be retrieved within the sales channels:
   * 
   * ```ts
   * import Medusa from "@medusajs/medusa-js"
   * const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
   * // must be previously logged in or use api token
   * medusa.admin.salesChannels.list({
   *   expand: "locations"
   * })
   * .then(({ sales_channels, limit, offset, count }) => {
   *   console.log(sales_channels.length)
   * })
   * ```
   * 
   * By default, only the first `20` records are retrieved. You can control pagination by specifying the `limit` and `offset` properties:
   * 
   * ```ts
   * import Medusa from "@medusajs/medusa-js"
   * const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
   * // must be previously logged in or use api token
   * medusa.admin.salesChannels.list({
   *   expand: "locations",
   *   limit,
   *   offset
   * })
   * .then(({ sales_channels, limit, offset, count }) => {
   *   console.log(sales_channels.length)
   * })
   * ```
   */
  list(
    query?: AdminGetSalesChannelsParams,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminSalesChannelsListRes> {
    let path = `/admin/sales-channels`

    if (query) {
      const queryString = qs.stringify(query)
      path += `?${queryString}`
    }

    return this.client.request("GET", path, undefined, {}, customHeaders)
  }

  /**
   * Delete a sales channel. Associated products, stock locations, and other resources are not deleted.
   * @param {string} salesChannelId - The sales channel's ID.
   * @param {Record<string, any>} customHeaders - Custom headers to attach to the request.
   * @returns {ResponsePromise<AdminSalesChannelsDeleteRes>} Resolves to the deletion operation's details.
   * 
   * @example
   * import Medusa from "@medusajs/medusa-js"
   * const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
   * // must be previously logged in or use api token
   * medusa.admin.salesChannels.delete(salesChannelId)
   * .then(({ id, object, deleted }) => {
   *   console.log(id)
   * })
   */
  delete(
    salesChannelId: string,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminSalesChannelsDeleteRes> {
    const path = `/admin/sales-channels/${salesChannelId}`
    return this.client.request("DELETE", path, undefined, {}, customHeaders)
  }

  /**
   * Remove a list of products from a sales channel. This doesn't delete the product. It only removes the association between the product and the sales channel.
   * @param {string} salesChannelId - The sales channel's ID.
   * @param {AdminDeleteSalesChannelsChannelProductsBatchReq} payload - The products to remove from the sales channel.
   * @param {Record<string, any>} customHeaders - Custom headers to attach to the request.
   * @returns {ResponsePromise<AdminSalesChannelsRes>} Resolves to the sales channel's details.
   * 
   * @example
   * import Medusa from "@medusajs/medusa-js"
   * const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
   * // must be previously logged in or use api token
   * medusa.admin.salesChannels.removeProducts(salesChannelId, {
   *   product_ids: [
   *     {
   *       id: productId
   *     }
   *   ]
   * })
   * .then(({ sales_channel }) => {
   *   console.log(sales_channel.id)
   * })
   */
  removeProducts(
    salesChannelId: string,
    payload: AdminDeleteSalesChannelsChannelProductsBatchReq,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminSalesChannelsRes> {
    const path = `/admin/sales-channels/${salesChannelId}/products/batch`
    return this.client.request("DELETE", path, payload, {}, customHeaders)
  }

  /**
   * Add a list of products to a sales channel.
   * @param {string} salesChannelId - The sales channel's ID. 
   * @param {AdminPostSalesChannelsChannelProductsBatchReq} payload - The products to add to the sales channel.
   * @param {Record<string, any>} customHeaders - Custom headers to attach to the request.
   * @returns {ResponsePromise<AdminSalesChannelsRes>} Resolves to the sales channel's details.
   * 
   * @example
   * import Medusa from "@medusajs/medusa-js"
   * const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
   * // must be previously logged in or use api token
   * medusa.admin.salesChannels.addProducts(salesChannelId, {
   *   product_ids: [
   *     {
   *       id: productId
   *     }
   *   ]
   * })
   * .then(({ sales_channel }) => {
   *   console.log(sales_channel.id)
   * })
   */
  addProducts(
    salesChannelId: string,
    payload: AdminPostSalesChannelsChannelProductsBatchReq,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminSalesChannelsRes> {
    const path = `/admin/sales-channels/${salesChannelId}/products/batch`
    return this.client.request("POST", path, payload, {}, customHeaders)
  }

  /**
   * Associate a stock location with a sales channel.
   * @param {string} salesChannelId - The sales channel's ID. 
   * @param {AdminPostSalesChannelsChannelStockLocationsReq} payload - The stock location to associate with the sales channel.
   * @param {Record<string, any>} customHeaders - Custom headers to attach to the request.
   * @returns {ResponsePromise<AdminSalesChannelsRes>} Resolves to the sales channel's details.
   * 
   * @example
   * import Medusa from "@medusajs/medusa-js"
   * const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
   * // must be previously logged in or use api token
   * medusa.admin.salesChannels.addLocation(salesChannelId, {
   *   location_id: "loc_123"
   * })
   * .then(({ sales_channel }) => {
   *   console.log(sales_channel.id)
   * })
   */
  addLocation(
    salesChannelId: string,
    payload: AdminPostSalesChannelsChannelStockLocationsReq,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminSalesChannelsRes> {
    const path = `/admin/sales-channels/${salesChannelId}/stock-locations`
    return this.client.request("POST", path, payload, {}, customHeaders)
  }

  /**
   * Remove a stock location from a sales channel. This only removes the association between the stock location and the sales channel. It does not delete the stock location.
   * @param {string} salesChannelId - The sales channel's ID.
   * @param {AdminDeleteSalesChannelsChannelStockLocationsReq} payload - The stock location to remove from the sales channel.
   * @param {Record<string, any>} customHeaders - Custom headers to attach to the request.
   * @returns {ResponsePromise<AdminSalesChannelsRes>} Resolves to the sales channel's details.
   * 
   * @example
   * import Medusa from "@medusajs/medusa-js"
   * const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
   * // must be previously logged in or use api token
   * medusa.admin.salesChannels.removeLocation(salesChannelId, {
   *   location_id: "loc_id"
   * })
   * .then(({ sales_channel }) => {
   *   console.log(sales_channel.id);
   * })
   */
  removeLocation(
    salesChannelId: string,
    payload: AdminDeleteSalesChannelsChannelStockLocationsReq,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminSalesChannelsRes> {
    const path = `/admin/sales-channels/${salesChannelId}/stock-locations`
    return this.client.request("DELETE", path, payload, {}, customHeaders)
  }
}

export default AdminSalesChannelsResource
