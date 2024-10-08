import { HttpTypes } from "@medusajs/types"
import { Client } from "../client"
import { ClientHeaders } from "../types"

export class ProductType {
  private client: Client
  constructor(client: Client) {
    this.client = client
  }

  async create(
    body: HttpTypes.AdminCreateProductType,
    query?: HttpTypes.SelectParams,
    headers?: ClientHeaders
  ) {
    return this.client.fetch<HttpTypes.AdminProductTypeResponse>(
      `/admin/product-types`,
      {
        method: "POST",
        headers,
        body,
        query,
      }
    )
  }

  async update(
    id: string,
    body: HttpTypes.AdminUpdateProductType,
    query?: HttpTypes.SelectParams,
    headers?: ClientHeaders
  ) {
    return this.client.fetch<HttpTypes.AdminProductTypeResponse>(
      `/admin/product-types/${id}`,
      {
        method: "POST",
        headers,
        body,
        query,
      }
    )
  }

  async list(
    query?: HttpTypes.AdminProductTypeListParams,
    headers?: ClientHeaders
  ) {
    return this.client.fetch<HttpTypes.AdminProductTypeListResponse>(
      `/admin/product-types`,
      {
        headers,
        query: query,
      }
    )
  }

  async retrieve(
    id: string,
    query?: HttpTypes.AdminProductTypeParams,
    headers?: ClientHeaders
  ) {
    return this.client.fetch<HttpTypes.AdminProductTypeResponse>(
      `/admin/product-types/${id}`,
      {
        query,
        headers,
      }
    )
  }

  async delete(id: string, headers?: ClientHeaders) {
    return this.client.fetch<HttpTypes.AdminProductTypeDeleteResponse>(
      `/admin/product-types/${id}`,
      {
        method: "DELETE",
        headers,
      }
    )
  }
}
