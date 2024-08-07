import { HttpTypes } from "@medusajs/types"

import { Client } from "../client"
import { ClientHeaders } from "../types"

export class ReturnReason {
  private client: Client
  constructor(client: Client) {
    this.client = client
  }

  async list(
    queryParams?: HttpTypes.AdminReturnReason,
    headers?: ClientHeaders
  ) {
    return await this.client.fetch<HttpTypes.AdminReturnReasonListResponse>(
      "/admin/return-reasons",
      {
        headers,
        query: queryParams,
      }
    )
  }

  async retrieve(
    id: string,
    query?: HttpTypes.AdminReturnReason,
    headers?: ClientHeaders
  ) {
    return await this.client.fetch<HttpTypes.AdminReturnReasonResponse>(
      `/admin/return-reasons/${id}`,
      {
        query,
        headers,
      }
    )
  }

  async create(
    body: HttpTypes.AdminCreateReturnReason,
    query?: HttpTypes.AdminReturnReasonParams,
    headers?: ClientHeaders
  ) {
    return this.client.fetch<HttpTypes.AdminReturnReasonResponse>(
      `/admin/return-reasons`,
      {
        method: "POST",
        headers,
        body,
        query,
      }
    )
  }

  async delete(
    id: string,
    query?: HttpTypes.AdminReturnReasonParams,
    headers?: ClientHeaders
  ) {
    return await this.client.fetch<HttpTypes.AdminReturnReasonDeleteResponse>(
      `/admin/return-reasons/${id}`,
      {
        method: "DELETE",
        headers,
        query,
      }
    )
  }
}
