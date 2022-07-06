import {
  AdminSalesChannelsRes,
  AdminPostSalesChannelsSalesChannelReq,
} from "@medusajs/medusa"
import { ResponsePromise } from "../../typings"
import BaseResource from "../base"

class AdminSalesChannelsResource extends BaseResource {
  /**
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

  /* create(
    payload: any,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<any> {}*/

  /** @description updates a sales channel
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

  /* delete(
    id: string,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<any> {
  }*/

  /* list(
    query?: any,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<any> {
  }*/
}

export default AdminSalesChannelsResource
