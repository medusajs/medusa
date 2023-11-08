import {
  AdminGetNotificationsParams,
  AdminNotificationsListRes,
  AdminNotificationsRes,
  AdminPostNotificationsNotificationResendReq,
} from "@medusajs/medusa"
import qs from "qs"
import { ResponsePromise } from "../.."
import BaseResource from "../base"

/**
 * This class is used to send requests to [Admin Notification API Routes](https://docs.medusajs.com/api/admin#notifications). All its method
 * are available in the JS Client under the `medusa.admin.notifications` property.
 * 
 * All methods in this class require {@link AdminAuthResource.createSession | user authentication}.
 * 
 * Notifications are sent to customers to inform them of new updates. For example, a notification can be sent to the customer when their order is place or its state is updated.
 * The notification's type, such as an email or SMS, is determined by the notification provider installed on the Medusa backend.
 */
class AdminNotificationsResource extends BaseResource {
  /**
   * Retrieve a list of notifications. The notifications can be filtered by fields such as `event_name` or `resource_type` passed in the `query` parameter.
   * The notifications can also be paginated.
   * @param {AdminGetNotificationsParams} query - Filters and pagination configurations applied to the retrieved notifications.
   * @param {Record<string, any>} customHeaders - Custom headers to attach to the request.
   * @returns {ResponsePromise<AdminNotificationsListRes>} Resolves to the list of notifications with pagination fields.
   * 
   * @example
   * To list notifications:
   * 
   * ```ts
   * import Medusa from "@medusajs/medusa-js"
   * const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
   * // must be previously logged in or use api token
   * medusa.admin.notifications.list()
   * .then(({ notifications }) => {
   *   console.log(notifications.length);
   * })
   * ```
   * 
   * To specify relations that should be retrieved within the notifications:
   * 
   * ```ts
   * import Medusa from "@medusajs/medusa-js"
   * const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
   * // must be previously logged in or use api token
   * medusa.admin.notifications.list({
   *   expand: "provider"
   * })
   * .then(({ notifications }) => {
   *   console.log(notifications.length);
   * })
   * ```
   * 
   * By default, only the first `50` records are retrieved. You can control pagination by specifying the `limit` and `offset` properties:
   * 
   * ```ts
   * import Medusa from "@medusajs/medusa-js"
   * const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
   * // must be previously logged in or use api token
   * medusa.admin.notifications.list({
   *   expand: "provider",
   *   limit,
   *   offset
   * })
   * .then(({ notifications }) => {
   *   console.log(notifications.length);
   * })
   * ```
   */
  list(
    query?: AdminGetNotificationsParams,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminNotificationsListRes> {
    let path = `/admin/notifications`

    if (query) {
      const queryString = qs.stringify(query)
      path = `/admin/notifications?${queryString}`
    }

    return this.client.request("GET", path, undefined, {}, customHeaders)
  }

  /**
   * Resend a previously sent notifications, with the same data but optionally to a different address.
   * @param {string} id - The notification's ID. 
   * @param {AdminPostNotificationsNotificationResendReq} payload - The details necessary to resend the notification.
   * @param {Record<string, any>} customHeaders - Custom headers to attach to the request.
   * @returns {ResponsePromise<AdminNotificationsRes>} Resolves to the notification's details.
   * 
   * @example
   * import Medusa from "@medusajs/medusa-js"
   * const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
   * // must be previously logged in or use api token
   * medusa.admin.notifications.resend(notificationId)
   * .then(({ notification }) => {
   *   console.log(notification.id);
   * })
   */
  resend(
    id: string,
    payload: AdminPostNotificationsNotificationResendReq,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminNotificationsRes> {
    const path = `/admin/notifications/${id}/resend`
    return this.client.request("POST", path, payload, {}, customHeaders)
  }
}

export default AdminNotificationsResource
