import { HttpTypes, SelectParams } from "@medusajs/types"
import { Client } from "../client"
import { ClientHeaders } from "../types"

export class StockLocation {
  private client: Client
  constructor(client: Client) {
    this.client = client
  }

  async create(
    body: HttpTypes.AdminCreateStockLocation,
    query?: SelectParams,
    headers?: ClientHeaders
  ) {
    return await this.client.fetch<HttpTypes.AdminStockLocationResponse>(
      `/admin/stock-locations`,
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
    body: HttpTypes.AdminUpdateStockLocation,
    query?: SelectParams,
    headers?: ClientHeaders
  ) {
    return await this.client.fetch<HttpTypes.AdminStockLocationResponse>(
      `/admin/stock-locations/${id}`,
      {
        method: "POST",
        headers,
        body,
        query,
      }
    )
  }

  async delete(id: string, headers?: ClientHeaders) {
    return await this.client.fetch<HttpTypes.AdminStockLocationDeleteResponse>(
      `/admin/stock-locations/${id}`,
      {
        method: "DELETE",
        headers,
      }
    )
  }

  async retrieve(id: string, query?: SelectParams, headers?: ClientHeaders) {
    return await this.client.fetch<HttpTypes.AdminStockLocationResponse>(
      `/admin/stock-locations/${id}`,
      {
        method: "GET",
        headers,
        query,
      }
    )
  }

  async list(
    query?: HttpTypes.AdminStockLocationListParams,
    headers?: ClientHeaders
  ) {
    return await this.client.fetch<HttpTypes.AdminStockLocationListResponse>(
      `/admin/stock-locations`,
      {
        method: "GET",
        headers,
        query,
      }
    )
  }

  async updateSalesChannels(
    id: string,
    body: HttpTypes.AdminUpdateStockLocationSalesChannels,
    headers?: ClientHeaders
  ) {
    return await this.client.fetch<HttpTypes.AdminStockLocationResponse>(
      `/admin/stock-locations/${id}/sales-channels`,
      {
        method: "POST",
        headers,
        body,
      }
    )
  }

  async createFulfillmentSet(
    id: string,
    body: HttpTypes.AdminCreateStockLocationFulfillmentSet,
    headers?: ClientHeaders
  ) {
    return await this.client.fetch<HttpTypes.AdminStockLocationResponse>(
      `/admin/stock-locations/${id}/fulfillment-sets`,
      {
        method: "POST",
        headers,
        body,
      }
    )
  }

  async updateFulfillmentProviders(
    id: string,
    body: HttpTypes.AdminBatchLink,
    headers?: ClientHeaders
  ) {
    return await this.client.fetch<HttpTypes.AdminStockLocationResponse>(
      `/admin/stock-locations/${id}/fulfillment-providers`,
      {
        method: "POST",
        headers,
        body,
      }
    )
  }
}
