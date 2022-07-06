import {
  AdminSalesChannelsRes,
  AdminPostSalesChannelsSalesChannelReq,
} from "@medusajs/medusa"
import { ResponsePromise } from "../../typings"
import BaseResource from "../base"

class AdminSalesChannelsResource extends BaseResource {
  /** retrieve a sales channel
   * @experimental This feature is under development and may change in the future.
   * To use this feature please enable the corresponding featureflag in your medusa backend project.
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

  /** update a sales channel
   * @experimental This feature is under development and may change in the future.
   * To use this feature please enable the corresponding featureflag in your medusa backend project.
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
