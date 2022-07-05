import {
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
    id: string,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminSalesChannelRes> {
    const path = `/admin/sales-channels/${id}`
    return this.client.request("GET", path, {}, {}, customHeaders)
  }
}

export default AdminSalesChannelsResource
