import {
  AdminGetSalesChannelsParams,
  AdminPostSalesChannelsReq,
  AdminSalesChannelsRes,
  AdminPostSalesChannelsSalesChannelReq,
  AdminSalesChannelsDeleteRes,
  AdminSalesChannelsListRes,
} from "@medusajs/medusa"
import { ResponsePromise } from "../../typings"
import BaseResource from "../base"
import qs from "qs"

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
    return this.client.request("GET", path, {}, {}, customHeaders)
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

    return this.client.request("GET", path, {}, {}, customHeaders)
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
    return this.client.request("DELETE", path, {}, {}, customHeaders)
  }
}

export default AdminSalesChannelsResource
