import { HttpTypes } from "@medusajs/types"
import { Client } from "../client"
import { ClientHeaders } from "../types"

export class ShippingOption {
  private client: Client
  constructor(client: Client) {
    this.client = client
  }

  async create(
    body: HttpTypes.AdminCreateShippingOption,
    query?: HttpTypes.SelectParams,
    headers?: ClientHeaders
  ) {
    return await this.client.fetch<HttpTypes.AdminShippingOptionResponse>(
      `/admin/shipping-options`,
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
    body: HttpTypes.AdminUpdateShippingOption,
    query?: HttpTypes.SelectParams,
    headers?: ClientHeaders
  ) {
    return await this.client.fetch<HttpTypes.AdminShippingOptionResponse>(
      `/admin/shipping-options/${id}`,
      {
        method: "POST",
        headers,
        body,
        query,
      }
    )
  }

  async delete(id: string, headers?: ClientHeaders) {
    return await this.client.fetch<HttpTypes.AdminShippingOptionDeleteResponse>(
      `/admin/shipping-options/${id}`,
      {
        method: "DELETE",
        headers,
      }
    )
  }

  async list(
    query?: HttpTypes.AdminShippingOptionListParams,
    headers?: ClientHeaders
  ) {
    return await this.client.fetch<HttpTypes.AdminShippingOptionListResponse>(
      `/admin/shipping-options`,
      {
        method: "GET",
        headers,
        query,
      }
    )
  }

  async updateRules(
    id: string,
    body: HttpTypes.AdminUpdateShippingOptionRules,
    headers?: ClientHeaders
  ) {
    return await this.client.fetch<HttpTypes.AdminUpdateShippingOptionRulesResponse>(
      `/admin/shipping-options/${id}/rules/batch`,
      {
        method: "POST",
        headers,
        body,
      }
    )
  }
}
