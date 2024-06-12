import { HttpTypes } from "@medusajs/types"
import { Client } from "../client"
import { ClientHeaders } from "../types"

export class PriceList {
  private client: Client

  constructor(client: Client) {
    this.client = client
  }

  async linkProducts(
    id: string,
    body: HttpTypes.AdminLinkPriceListProducts,
    query?: HttpTypes.AdminPriceListParams,
    headers?: ClientHeaders
  ) {
    return this.client.fetch<HttpTypes.AdminPriceListResponse>(
      `/admin/price-lists/${id}/products`,
      {
        method: "POST",
        headers,
        body,
        query,
      }
    )
  }
}
