import { HttpTypes } from "@medusajs/types"
import { Client } from "../client"
import { ClientHeaders } from "../types"

export class Notification {
  /**
   * @ignore
   */
  private client: Client
  /**
   * @ignore
   */
  constructor(client: Client) {
    this.client = client
  }

  /**
   * This method retrieves a notification's details. It sends a request to the 
   * [Get Notification](https://docs.medusajs.com/api/admin#notifications_getnotificationsid)
   * API route.
   * 
   * @param id - The notification's ID.
   * @param query - Configure the fields to retrieve in the notification.
   * @param headers - Headers to pass in the request
   * @returns The notification's details.
   * 
   * @example
   * To retrieve a notification by its ID:
   * 
   * ```ts
   * sdk.admin.notification.retrieve("notif_123")
   * .then(({ notification }) => {
   *   console.log(notification)
   * })
   * ```
   * 
   * To specify the fields and relations to retrieve:
   * 
   * ```ts
   * sdk.admin.notification.retrieve("notif_123", {
   *   fields: "id,to"
   * })
   * .then(({ notification }) => {
   *   console.log(notification)
   * })
   * ```
   * 
   * Learn more about the `fields` property in the [API reference](https://docs.medusajs.com/api/store#select-fields-and-relations).
   */
  async retrieve(
    id: string,
    query?: HttpTypes.AdminNotificationParams,
    headers?: ClientHeaders
  ) {
    return await this.client.fetch<HttpTypes.AdminNotificationResponse>(
      `/admin/notifications/${id}`,
      {
        method: "GET",
        headers,
        query,
      }
    )
  }

  /**
   * This method retrieves a paginated list of notifications. It sends a request to the 
   * [List Notifications](https://docs.medusajs.com/api/admin#notifications_getnotifications)
   * API route.
   * 
   * @param query - Filters and pagination configurations.
   * @param headers - Headers to pass in the request.
   * @returns The paginated list of notifications.
   * 
   * @example
   * To retrieve the list of notifications:
   * 
   * ```ts
   * sdk.admin.notification.list()
   * .then(({ notifications, count, limit, offset }) => {
   *   console.log(notifications)
   * })
   * ```
   * 
   * To configure the pagination, pass the `limit` and `offset` query parameters.
   * 
   * For example, to retrieve only 10 items and skip 10 items:
   * 
   * ```ts
   * sdk.admin.notification.list({
   *   limit: 10,
   *   offset: 10
   * })
   * .then(({ notifications, count, limit, offset }) => {
   *   console.log(notifications)
   * })
   * ```
   * 
   * Using the `fields` query parameter, you can specify the fields and relations to retrieve
   * in each notification:
   * 
   * ```ts
   * sdk.admin.notification.list({
   *   fields: "id,to"
   * })
   * .then(({ notifications, count, limit, offset }) => {
   *   console.log(notifications)
   * })
   * ```
   * 
   * Learn more about the `fields` property in the [API reference](https://docs.medusajs.com/api/store#select-fields-and-relations).
   */
  async list(
    query?: HttpTypes.AdminNotificationListParams,
    headers?: ClientHeaders
  ) {
    return await this.client.fetch<HttpTypes.AdminNotificationListResponse>(
      `/admin/notifications`,
      {
        method: "GET",
        headers,
        query,
      }
    )
  }
}
