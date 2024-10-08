import { HttpTypes } from "@medusajs/types"
import { Client } from "../client"
import { ClientHeaders } from "../types"

export class ProductCollection {
  private client: Client
  constructor(client: Client) {
    this.client = client
  }

  async create(
    body: HttpTypes.AdminCreateCollection,
    query?: HttpTypes.AdminCollectionParams,
    headers?: ClientHeaders
  ) {
    return this.client.fetch<HttpTypes.AdminCollectionResponse>(
      `/admin/collections`,
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
    body: HttpTypes.AdminUpdateCollection,
    query?: HttpTypes.AdminCollectionParams,
    headers?: ClientHeaders
  ) {
    return this.client.fetch<HttpTypes.AdminCollectionResponse>(
      `/admin/collections/${id}`,
      {
        method: "POST",
        headers,
        body,
        query,
      }
    )
  }

  async list(
    queryParams?: HttpTypes.AdminCollectionListParams,
    headers?: ClientHeaders
  ) {
    return this.client.fetch<HttpTypes.AdminCollectionListResponse>(
      `/admin/collections`,
      {
        headers,
        query: queryParams,
      }
    )
  }

  async retrieve(
    id: string,
    query?: HttpTypes.AdminCollectionParams,
    headers?: ClientHeaders
  ) {
    return this.client.fetch<HttpTypes.AdminCollectionResponse>(
      `/admin/collections/${id}`,
      {
        query,
        headers,
      }
    )
  }

  async delete(id: string, headers?: ClientHeaders) {
    return this.client.fetch<HttpTypes.AdminCollectionDeleteResponse>(
      `/admin/collections/${id}`,
      {
        method: "DELETE",
        headers,
      }
    )
  }

  async updateProducts(
    id: string,
    body: HttpTypes.AdminUpdateCollectionProducts,
    headers?: ClientHeaders
  ) {
    return this.client.fetch<HttpTypes.AdminCollectionResponse>(
      `/admin/collections/${id}/products`,
      {
        method: "POST",
        headers,
        body,
      }
    )
  }
}
