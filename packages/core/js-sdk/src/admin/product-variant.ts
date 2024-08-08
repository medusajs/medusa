import { HttpTypes } from "@medusajs/types"
import { Client } from "../client"
import { ClientHeaders } from "../types"

export class ProductVariant {
  private client: Client
  constructor(client: Client) {
    this.client = client
  }

  async list(
    queryParams?: HttpTypes.AdminProductVariantParams,
    headers?: ClientHeaders
  ) {
    return await this.client.fetch<HttpTypes.AdminProductVariantListResponse>(
      `/admin/product-variants`,
      {
        headers,
        query: queryParams,
      }
    )
  }
}
