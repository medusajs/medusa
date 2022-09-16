import {
  AdminOrdersEditsRes,
  AdminOrderEditDeleteRes
} from "@medusajs/medusa"
import { ResponsePromise } from "../../typings"
import BaseResource from "../base"

class AdminOrderEditsResource extends BaseResource {
  retrieve(
    id: string,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminOrdersEditsRes> {
    const path = `/admin/order-edits/${id}`
    return this.client.request("GET", path, undefined, {}, customHeaders)
  }

  delete(
    id: string,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminOrderEditDeleteRes> {
    const path = `/admin/order-edits/${id}`
    return this.client.request("DELETE", path, undefined, {}, customHeaders)
  }
}

export default AdminOrderEditsResource
