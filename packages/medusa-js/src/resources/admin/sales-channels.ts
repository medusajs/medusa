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

class AdminSalesChannelsResource extends BaseResource {
  /** retrieve a sales channel
   * @experimental This feature is under development and may change in the future.
   * To use this feature please enable featureflag `sales_channels` in your medusa backend project.
   * @description gets a sales channel
   * @returns a medusa sales channel
   */
  retrieve(
    salesChannelId: string,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminSalesChannelsRes> {
    const path = `/admin/sales-channels/${salesChannelId}`
    return this.client.request("GET", path, undefined, {}, customHeaders)
  }

  /* *
   * Create a medusa sales channel
   * @returns the created channel
   */
  create(
    payload: AdminPostSalesChannelsReq,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminSalesChannelsRes> {
    const path = `/admin/sales-channels`
    return this.client.request("POST", path, payload, {}, customHeaders)
  }

  /** update a sales channel
   * @experimental This feature is under development and may change in the future.
   * To use this feature please enable featureflag `sales_channels` in your medusa backend project.
   * @description updates a sales channel
   * @returns the updated medusa sales channel
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
   * Retrieve a list of sales channels
   * @experimental This feature is under development and may change in the future.
   * To use this feature please enable featureflag `sales_channels` in your medusa backend project.
   * @description Retrieve a list of sales channels
   * @returns the list of sales channel as well as the pagination properties
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
   * Delete a sales channel
   * @experimental This feature is under development and may change in the future.
   * To use this feature please enable featureflag `sales_channels` in your medusa backend project.
   * @description gets a sales channel
   * @returns an deletion result
   */
  delete(
    salesChannelId: string,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminSalesChannelsDeleteRes> {
    const path = `/admin/sales-channels/${salesChannelId}`
    return this.client.request("DELETE", path, undefined, {}, customHeaders)
  }

  /**
   * Remove products from a sales channel
   * @experimental This feature is under development and may change in the future.
   * To use this feature please enable featureflag `sales_channels` in your medusa backend project.
   * @description Remove products from a sales channel
   * @returns a medusa sales channel
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
   * Add products to a sales channel
   * @experimental This feature is under development and may change in the future.
   * To use this feature please enable featureflag `sales_channels` in your medusa backend project.
   * @description Add products to a sales channel
   * @returns a medusa sales channel
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
   * Add a location to a sales channel
   * @experimental This feature is under development and may change in the future.
   * To use this feature please enable featureflag `sales_channels` in your medusa backend project.
   * @description Add a stock location to a SalesChannel
   * @returns the Medusa SalesChannel
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
   * remove a location from a sales channel
   * @experimental This feature is under development and may change in the future.
   * To use this feature please enable featureflag `sales_channels` in your medusa backend project.
   * @description Remove a stock location from a SalesChannel
   * @returns an deletion result
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
