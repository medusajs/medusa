import {
  AdminGetNotificationsParams,
  AdminNotificationsListRes,
  AdminNotificationsRes,
  AdminPostNotificationsNotificationResendReq,
} from "@medusajs/medusa"
import { ResponsePromise } from "../.."
import BaseResource from "../base"

class AdminNotificationsResource extends BaseResource {
  list(
    query: AdminGetNotificationsParams
  ): ResponsePromise<AdminNotificationsListRes> {
    let path = `/admin/notifications`

    if (query) {
      const queryString = Object.entries(query).map(([key, value]) => {
        return `${key}=${value}`
      })

      path = `/admin/notifications?${queryString.join("&")}`
    }

    return this.client.request("GET", path)
  }

  resend(
    id: string,
    payload: AdminPostNotificationsNotificationResendReq
  ): ResponsePromise<AdminNotificationsRes> {
    const path = `/admin/notifications/${id}/resend`
    return this.client.request("POST", path, payload)
  }
}

export default AdminNotificationsResource
