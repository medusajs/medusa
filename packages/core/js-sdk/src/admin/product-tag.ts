import { HttpTypes } from "@medusajs/types"
import { Client } from "../client"
import { ClientHeaders } from "../types"

export class ProductTag {
  private client: Client
  constructor(client: Client) {
    this.client = client
  }

  async create(
    body: HttpTypes.AdminCreateProductTag,
    query?: HttpTypes.AdminProductTagParams,
    headers?: ClientHeaders
  ) {
    return this.client.fetch<HttpTypes.AdminProductTagResponse>(
      `/admin/product-tags`,
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
    body: HttpTypes.AdminUpdateProductTag,
    query?: HttpTypes.AdminProductTagParams,
    headers?: ClientHeaders
  ) {
    return this.client.fetch<HttpTypes.AdminProductTagResponse>(
      `/admin/product-tags/${id}`,
      {
        method: "POST",
        headers,
        body,
        query,
      }
    )
  }

  async list(
    query?: HttpTypes.AdminProductTagListParams,
    headers?: ClientHeaders
  ) {
    return this.client.fetch<HttpTypes.AdminProductTagListResponse>(
      `/admin/product-tags`,
      {
        headers,
        query: query,
      }
    )
  }

  async retrieve(
    id: string,
    query?: HttpTypes.AdminProductTagParams,
    headers?: ClientHeaders
  ) {
    return this.client.fetch<HttpTypes.AdminProductTagResponse>(
      `/admin/product-tags/${id}`,
      {
        query,
        headers,
      }
    )
  }

  async delete(id: string, headers?: ClientHeaders) {
    return this.client.fetch<HttpTypes.AdminProductTagDeleteResponse>(
      `/admin/product-tags/${id}`,
      {
        method: "DELETE",
        headers,
      }
    )
  }
}
