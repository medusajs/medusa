import { HttpTypes } from "@medusajs/types"
import { Client } from "../client"
import { ClientHeaders } from "../types"

export class PricePreference {
  private client: Client

  constructor(client: Client) {
    this.client = client
  }

  async retrieve(
    id: string,
    query?: HttpTypes.AdminPricePreferenceParams,
    headers?: ClientHeaders
  ) {
    return this.client.fetch<HttpTypes.AdminPricePreferenceResponse>(
      `/admin/price-preferences/${id}`,
      {
        method: "GET",
        headers,
        query,
      }
    )
  }

  async list(
    query?: HttpTypes.AdminPricePreferenceListParams,
    headers?: ClientHeaders
  ) {
    return this.client.fetch<HttpTypes.AdminPricePreferenceListResponse>(
      `/admin/price-preferences`,
      {
        method: "GET",
        headers,
        query,
      }
    )
  }

  async create(
    body: HttpTypes.AdminCreatePricePreference,
    query?: HttpTypes.AdminPricePreferenceParams,
    headers?: ClientHeaders
  ) {
    return this.client.fetch<HttpTypes.AdminPricePreferenceResponse>(
      `/admin/price-preferences`,
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
    body: HttpTypes.AdminUpdatePricePreference,
    query?: HttpTypes.AdminPricePreferenceParams,
    headers?: ClientHeaders
  ) {
    return this.client.fetch<HttpTypes.AdminPricePreferenceResponse>(
      `/admin/price-preferences/${id}`,
      {
        method: "POST",
        headers,
        body,
        query,
      }
    )
  }

  async delete(id: string, headers?: ClientHeaders) {
    return this.client.fetch<HttpTypes.AdminPricePreferenceDeleteResponse>(
      `/admin/price-preferences/${id}`,
      {
        method: "DELETE",
        headers,
      }
    )
  }
}
