import { HttpTypes, PaginatedResponse } from "@medusajs/types"
import { Client } from "../client"
import { ClientHeaders } from "../types"

export class ApiKey {
  private client: Client
  constructor(client: Client) {
    this.client = client
  }

  async list(
    queryParams?: HttpTypes.AdminGetApiKeysParams,
    headers?: ClientHeaders
  ) {
    return await this.client.fetch<
      PaginatedResponse<HttpTypes.AdminApiKeyListResponse>
    >(`/admin/api-keys`, {
      query: queryParams,
      headers,
    })
  }

  async create(
    body: HttpTypes.AdminCreateApiKey,
    query?: HttpTypes.AdminGetApiKeysParams,
    headers?: ClientHeaders
  ) {
    return await this.client.fetch<HttpTypes.AdminApiKeyResponse>(
      `/admin/api-keys`,
      {
        method: "POST",
        headers,
        body,
        query,
      }
    )
  }

  async revoke(id: string, headers?: ClientHeaders) {
    return await this.client.fetch<HttpTypes.AdminApiKeyResponse>(
      `/admin/api-keys/${id}`,
      {
        method: "DELETE",
        headers,
      }
    )
  }

  async retrieve(id: string, headers?: ClientHeaders) {
    return await this.client.fetch<HttpTypes.AdminApiKeyResponse>(
      `/admin/api-keys/${id}`,
      {
        headers,
      }
    )
  }

  async update(
    id: string,
    body: HttpTypes.AdminUpdateApiKey,
    query?: HttpTypes.AdminGetApiKeysParams,
    headers?: ClientHeaders
  ) {
    return await this.client.fetch<HttpTypes.AdminApiKeyResponse>(
      `/admin/api-keys/${id}`,
      {
        method: "POST",
        headers,
        body,
        query,
      }
    )
  }

  async delete(id: string, headers?: ClientHeaders) {
    return await this.client.fetch<HttpTypes.AdminApiKeyDeleteResponse>(
      `/admin/api-keys/${id}`,
      {
        method: "DELETE",
        headers,
      }
    )
  }

  async batchSalesChannels(
    id: string,
    body: HttpTypes.AdminBatchLink,
    headers?: ClientHeaders
  ) {
    return await this.client.fetch<HttpTypes.AdminApiKeyResponse>(
      `/admin/api-keys/${id}/sales-channels`,
      {
        method: "POST",
        headers,
        body,
      }
    )
  }
}
