import {
  DeleteResponse,
  FindParams,
  HttpTypes,
  PaginatedResponse,
  SelectParams,
} from "@medusajs/types"
import { Client } from "../client"
import { ClientHeaders } from "../types"

export class ProductCollection {
  private client: Client
  constructor(client: Client) {
    this.client = client
  }

  async create(
    body: HttpTypes.AdminCreateCollection,
    query?: SelectParams,
    headers?: ClientHeaders
  ) {
    return this.client.fetch<{ collection: HttpTypes.AdminCollection }>(
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
    query?: SelectParams,
    headers?: ClientHeaders
  ) {
    return this.client.fetch<{ collection: HttpTypes.AdminCollection }>(
      `/admin/collections/${id}`,
      {
        method: "POST",
        headers,
        body,
        query,
      }
    )
  }

  async list(queryParams?: FindParams, headers?: ClientHeaders) {
    return this.client.fetch<
      PaginatedResponse<{ collections: HttpTypes.AdminCollection[] }>
    >(`/admin/collections`, {
      headers,
      query: queryParams,
    })
  }

  async retrieve(id: string, query?: SelectParams, headers?: ClientHeaders) {
    return this.client.fetch<{ collection: HttpTypes.AdminCollection }>(
      `/admin/collections/${id}`,
      {
        query,
        headers,
      }
    )
  }

  async delete(id: string, headers?: ClientHeaders) {
    return this.client.fetch<DeleteResponse<"collection">>(
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
    return this.client.fetch<{ collection: HttpTypes.AdminCollection }>(
      `/admin/collections/${id}/products`,
      {
        method: "POST",
        headers,
        body,
      }
    )
  }
}
