import { HttpTypes } from "@medusajs/types"
import { Client } from "../client"
import { ClientHeaders } from "../types"

export class Notification {
  private client: Client
  constructor(client: Client) {
    this.client = client
  }

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
