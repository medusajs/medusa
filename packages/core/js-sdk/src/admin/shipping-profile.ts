import { HttpTypes } from "@medusajs/types"
import { Client } from "../client"
import { ClientHeaders } from "../types"

export class ShippingProfile {
  private client: Client
  constructor(client: Client) {
    this.client = client
  }

  async create(
    body: HttpTypes.AdminCreateShippingProfile,
    query?: HttpTypes.SelectParams,
    headers?: ClientHeaders
  ) {
    return await this.client.fetch<HttpTypes.AdminShippingProfileResponse>(
      `/admin/shipping-profiles`,
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
    body: HttpTypes.AdminUpdateShippingProfile,
    query?: HttpTypes.SelectParams,
    headers?: ClientHeaders
  ) {
    return await this.client.fetch<HttpTypes.AdminShippingProfileResponse>(
      `/admin/shipping-profiles/${id}`,
      {
        method: "POST",
        headers,
        body,
        query,
      }
    )
  }

  async delete(id: string, headers?: ClientHeaders) {
    return await this.client.fetch<HttpTypes.AdminShippingProfileDeleteResponse>(
      `/admin/shipping-profiles/${id}`,
      {
        method: "DELETE",
        headers,
      }
    )
  }

  async list(
    query?: HttpTypes.AdminShippingProfileListParams,
    headers?: ClientHeaders
  ) {
    return await this.client.fetch<HttpTypes.AdminShippingProfileListResponse>(
      `/admin/shipping-profiles`,
      {
        method: "GET",
        headers,
        query,
      }
    )
  }

  async retrieve(
    id: string,
    query?: HttpTypes.SelectParams,
    headers?: ClientHeaders
  ) {
    return await this.client.fetch<HttpTypes.AdminShippingProfileResponse>(
      `/admin/shipping-profiles/${id}`,
      {
        method: "GET",
        headers,
        query,
      }
    )
  }
}
