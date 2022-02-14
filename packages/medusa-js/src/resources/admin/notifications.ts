import {
  AdminGetNotificationsParams,
  AdminNotificationsListRes,
  AdminNotificationsRes,
  AdminPostNotificationsNotificationResendReq,
} from "@medusajs/medusa"
import qs from "qs"
import { ResponsePromise } from "../.."
import BaseResource from "../base"

class AdminNotificationsResource extends BaseResource {
  list(
    query?: AdminGetNotificationsParams,
    customHeaders: Record<string, any> = {}): ResponsePromise<AdminNotificationsListRes> {
    let path = `/admin/notifications`

    if (query) {
      const queryString = qs.stringify(query)
      path = `/admin/notifications?${queryString}`
    }

    return this.client.request("GET", path, {}, {}, customHeaders)
  }

  resend(
    id: string,
    payload: AdminPostNotificationsNotificationResendReq,
    customHeaders: Record<string, any> = {}): ResponsePromise<AdminNotificationsRes> {
    const path = `/admin/notifications/${id}/resend`
    return this.client.request("POST", path, payload, {}, customHeaders)
  }
}

export default AdminNotificationsResource
