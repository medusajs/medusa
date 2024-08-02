import { HttpTypes } from "@medusajs/types"
import { Client } from "../client"
import { ClientHeaders } from "../types"

export class Currency {
  private client: Client
  constructor(client: Client) {
    this.client = client
  }

  async list(
    query?: HttpTypes.AdminCurrencyListParams,
    headers?: ClientHeaders
  ) {
    return this.client.fetch<HttpTypes.AdminCurrencyListResponse>(
      `/admin/currencies`,
      {
        headers,
        query,
      }
    )
  }

  async retrieve(
    id: string,
    query?: HttpTypes.AdminCurrencyParams,
    headers?: ClientHeaders
  ) {
    return this.client.fetch<HttpTypes.AdminCurrencyResponse>(
      `/admin/currencies/${id}`,
      {
        headers,
        query,
      }
    )
  }
}
