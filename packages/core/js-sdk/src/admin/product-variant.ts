import { HttpTypes } from "@medusajs/types"
import { Client } from "../client"
import { ClientHeaders } from "../types"

export class ProductVariant {
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
