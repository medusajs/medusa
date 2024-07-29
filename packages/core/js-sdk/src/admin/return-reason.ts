import { HttpTypes } from "@medusajs/types"

import { Client } from "../client"
import { ClientHeaders } from "../types"

export class ReturnReason {
  private client: Client
  constructor(client: Client) {
    this.client = client
  }

  async list(
    queryParams?: HttpTypes.AdminReturnReasonListParams,
    headers?: ClientHeaders
  ) {
    return await this.client.fetch<HttpTypes.AdminReturnReasonsResponse>(
      "/admin/return-reasons",
      {
        headers,
        query: queryParams,
      }
    )
  }
}
