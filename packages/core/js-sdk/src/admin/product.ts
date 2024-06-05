import { HttpTypes, SelectParams } from "@medusajs/types"
import { Client } from "../client"
import { ClientHeaders } from "../types"

export class Product {
  private client: Client
  constructor(client: Client) {
    this.client = client
  }

  async create(
    body: HttpTypes.AdminCreateProduct,
    query?: SelectParams,
    headers?: ClientHeaders
  ) {
    return await this.client.fetch<{ product: HttpTypes.AdminProduct }>(
      `/admin/products`,
      {
        method: "POST",
        headers,
        body,
        query,
      }
    )
  }
}
