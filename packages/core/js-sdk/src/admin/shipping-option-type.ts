import { HttpTypes } from "@medusajs/types"

import { Client } from "../client"
import { ClientHeaders } from "../types"

export class ShippingOptionType {
  private client: Client
  constructor(client: Client) {
    this.client = client
  }

  async create(
    body: HttpTypes.AdminCreateShippingOptionType,
    query?: HttpTypes.SelectParams,
    headers?: ClientHeaders
  ) {
    return await this.client.fetch<HttpTypes.AdminShippingOptionTypeResponse>(
      `/admin/shipping-option-types`,
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
    body: HttpTypes.AdminUpdateShippingOptionType,
    query?: HttpTypes.SelectParams,
    headers?: ClientHeaders
  ) {
    return await this.client.fetch<HttpTypes.AdminShippingOptionTypeResponse>(
      `/admin/shipping-option-types/${id}`,
      {
        method: "POST",
        headers,
        body,
        query,
      }
    )
  }

  async delete(id: string, headers?: ClientHeaders) {
    return await this.client.fetch<HttpTypes.AdminShippingOptionTypeDeleteResponse>(
      `/admin/shipping-option-types/${id}`,
      {
        method: "DELETE",
        headers,
      }
    )
  }

  async list(
    query?: HttpTypes.AdminShippingOptionTypeListParams,
    headers?: ClientHeaders
  ) {
    return await this.client.fetch<HttpTypes.AdminShippingOptionTypeListResponse>(
      `/admin/shipping-option-types`,
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
    return await this.client.fetch<HttpTypes.AdminShippingOptionTypeResponse>(
      `/admin/shipping-option-types/${id}`,
      {
        method: "GET",
        headers,
        query,
      }
    )
  }
}
