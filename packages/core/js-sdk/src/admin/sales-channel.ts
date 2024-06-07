import { HttpTypes } from "@medusajs/types"
import { Client } from "../client"
import { ClientHeaders } from "../types"

export class SalesChannel {
  private client: Client
  constructor(client: Client) {
    this.client = client
  }

  async create(
    body: HttpTypes.AdminCreateSalesChannel,
    query?: HttpTypes.SelectParams,
    headers?: ClientHeaders
  ) {
    return await this.client.fetch<HttpTypes.AdminSalesChannelResponse>(
      `/admin/sales-channels`,
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
    body: HttpTypes.AdminUpdateSalesChannel,
    query?: HttpTypes.SelectParams,
    headers?: ClientHeaders
  ) {
    return await this.client.fetch<HttpTypes.AdminSalesChannelResponse>(
      `/admin/sales-channels/${id}`,
      {
        method: "POST",
        headers,
        body,
        query,
      }
    )
  }

  async delete(id: string, headers?: ClientHeaders) {
    return await this.client.fetch<HttpTypes.AdminSalesChannelDeleteResponse>(
      `/admin/sales-channels/${id}`,
      {
        method: "DELETE",
        headers,
      }
    )
  }

  async retrieve(
    id: string,
    query?: HttpTypes.SelectParams,
    headers?: ClientHeaders
  ) {
    return await this.client.fetch<HttpTypes.AdminSalesChannelResponse>(
      `/admin/sales-channels/${id}`,
      {
        method: "GET",
        headers,
        query,
      }
    )
  }

  async list(
    query?: HttpTypes.AdminSalesChannelListParams,
    headers?: ClientHeaders
  ) {
    return await this.client.fetch<HttpTypes.AdminSalesChannelListResponse>(
      `/admin/sales-channels`,
      {
        method: "GET",
        headers,
        query,
      }
    )
  }

  async updateProducts(
    id: string,
    body: HttpTypes.AdminUpdateSalesChannelProducts,
    headers?: ClientHeaders
  ) {
    return await this.client.fetch<HttpTypes.AdminSalesChannelResponse>(
      `/admin/sales-channels/${id}/products`,
      {
        method: "POST",
        headers,
        body,
      }
    )
  }
}
