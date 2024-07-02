import { HttpTypes, SelectParams } from "@medusajs/types"
import { Client } from "../client"
import { ClientHeaders } from "../types"

export class Store {
  private client: Client
  constructor(client: Client) {
    this.client = client
  }

  async retrieve(
    id: string,
    query?: HttpTypes.AdminStoreParams,
    headers?: ClientHeaders
  ) {
    return await this.client.fetch<HttpTypes.AdminStoreResponse>(
      `/admin/stores/${id}`,
      {
        method: "GET",
        headers,
        query,
      }
    )
  }

  async list(query?: HttpTypes.AdminStoreListParams, headers?: ClientHeaders) {
    return await this.client.fetch<HttpTypes.AdminStoreListResponse>(
      `/admin/stores`,
      {
        method: "GET",
        headers,
        query,
      }
    )
  }

  async update(
    id: string,
    body: HttpTypes.AdminUpdateStore,
    query?: SelectParams,
    headers?: ClientHeaders
  ) {
    return await this.client.fetch<HttpTypes.AdminStoreResponse>(
      `/admin/stores/${id}`,
      {
        method: "POST",
        headers,
        body,
        query,
      }
    )
  }
}
