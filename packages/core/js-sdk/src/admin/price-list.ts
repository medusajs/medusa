import { HttpTypes } from "@medusajs/types"
import { Client } from "../client"
import { ClientHeaders } from "../types"

export class PriceList {
  private client: Client

  constructor(client: Client) {
    this.client = client
  }

  async retrieve(
    id: string,
    query?: HttpTypes.AdminPriceListParams,
    headers?: ClientHeaders
  ) {
    return this.client.fetch<HttpTypes.AdminPriceListResponse>(
      `/admin/price-lists/${id}`,
      {
        method: "GET",
        headers,
        query,
      }
    )
  }

  async list(
    query?: HttpTypes.AdminPriceListListParams,
    headers?: ClientHeaders
  ) {
    return this.client.fetch<HttpTypes.AdminPriceListListResponse>(
      `/admin/price-lists`,
      {
        method: "GET",
        headers,
        query,
      }
    )
  }

  async create(
    body: HttpTypes.AdminCreatePriceList,
    query?: HttpTypes.AdminPriceListParams,
    headers?: ClientHeaders
  ) {
    return this.client.fetch<HttpTypes.AdminPriceListResponse>(
      `/admin/price-lists`,
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
    body: HttpTypes.AdminUpdatePriceList,
    query?: HttpTypes.AdminPriceListParams,
    headers?: ClientHeaders
  ) {
    return this.client.fetch<HttpTypes.AdminPriceListResponse>(
      `/admin/price-lists/${id}`,
      {
        method: "POST",
        headers,
        body,
        query,
      }
    )
  }

  async delete(id: string, headers?: ClientHeaders) {
    return this.client.fetch<HttpTypes.AdminPriceListDeleteResponse>(
      `/admin/price-lists/${id}`,
      {
        method: "DELETE",
        headers,
      }
    )
  }

  async batchPrices(
    id: string,
    body: HttpTypes.AdminBatchPriceListPrice,
    query?: HttpTypes.AdminPriceListParams,
    headers?: ClientHeaders
  ) {
    return this.client.fetch<HttpTypes.AdminPriceListResponse>(
      `/admin/price-lists/${id}/prices/batch`,
      {
        method: "POST",
        headers,
        body,
        query,
      }
    )
  }

  async linkProducts(
    id: string,
    body: HttpTypes.AdminLinkPriceListProducts,
    query?: HttpTypes.AdminPriceListParams,
    headers?: ClientHeaders
  ) {
    return this.client.fetch<HttpTypes.AdminPriceListResponse>(
      `/admin/price-lists/${id}/products`,
      {
        method: "POST",
        headers,
        body,
        query,
      }
    )
  }
}
