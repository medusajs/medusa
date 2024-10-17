import { HttpTypes } from "@medusajs/types"
import { Client } from "../client"
import { ClientHeaders } from "../types"

export class RefundReason {
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
