import { HttpTypes } from "@medusajs/types"
import { Client } from "../client"
import { ClientHeaders } from "../types"

export class RefundReason {
  private client: Client
  constructor(client: Client) {
    this.client = client
  }

  async list(query?: HttpTypes.RefundReasonFilters, headers?: ClientHeaders) {
    return await this.client.fetch<HttpTypes.RefundReasonsResponse>(
      `/admin/refund-reasons`,
      {
        query,
        headers,
      }
    )
  }
}
