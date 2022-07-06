import {
  AdminPostSalesChannelReq,
  AdminSalesChannelRes,
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
  ): ResponsePromise<AdminSalesChannelRes> {
    const path = `/admin/sales-channels/${salesChannelId}`
    return this.client.request("GET", path, {}, {}, customHeaders)
  }

  /**
   * Create a medusa sales channel
   * @returns the created channel
   */
  create(
    payload: AdminPostSalesChannelReq,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminSalesChannelRes> {
    const path = `/admin/sales-channels`
    return this.client.request("POST", path, payload, {}, customHeaders)
  }

  /*create(
    payload: any,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<any> {}*/

  /*update(
    id: string,
    payload: any,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<any> {}*/

  /*delete(
    id: string,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<any> {
  }*/

  /*list(
    query?: any,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<any> {
  }*/
}

export default AdminSalesChannelsResource
