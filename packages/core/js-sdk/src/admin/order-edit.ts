import { HttpTypes } from "@medusajs/types"
import { Client } from "../client"
import { ClientHeaders } from "../types"

export class OrderEdit {
  private client: Client
  constructor(client: Client) {
    this.client = client
  }

  async initiateRequest(
    body: HttpTypes.AdminInitiateOrderEditRequest,
    query?: HttpTypes.SelectParams,
    headers?: ClientHeaders
  ) {
    return await this.client.fetch<HttpTypes.AdminOrderEditPreviewResponse>(
      `/admin/order-edits`,
      {
        method: "POST",
        headers,
        body,
        query,
      }
    )
  }

  async confirmRequest(
    id: string,
    query?: HttpTypes.SelectParams,
    headers?: ClientHeaders
  ) {
    return await this.client.fetch<HttpTypes.AdminOrderEditPreviewResponse>(
      `/admin/order-edits/${id}/confirm`,
      {
        method: "POST",
        headers,
        query,
      }
    )
  }

  async cancelRequest(
    id: string,
    query?: HttpTypes.SelectParams,
    headers?: ClientHeaders
  ) {
    return await this.client.fetch<HttpTypes.AdminOrderEditDeleteResponse>(
      `/admin/order-edits/${id}`,
      {
        method: "DELETE",
        headers,
        query,
      }
    )
  }

  async addItems(
    id: string,
    body: HttpTypes.AdminAddOrderEditItems,
    query?: HttpTypes.SelectParams,
    headers?: ClientHeaders
  ) {
    return await this.client.fetch<HttpTypes.AdminOrderEditPreviewResponse>(
      `/admin/order-edits/${id}/items`,
      {
        method: "POST",
        headers,
        body,
        query,
      }
    )
  }

  async updateOriginalItem(
    id: string,
    itemId: string,
    body: HttpTypes.AdminUpdateOrderEditItem,
    query?: HttpTypes.SelectParams,
    headers?: ClientHeaders
  ) {
    return await this.client.fetch<HttpTypes.AdminOrderEditPreviewResponse>(
      `/admin/order-edits/${id}/items/item/${itemId}`,
      {
        method: "POST",
        headers,
        body,
        query,
      }
    )
  }

  async updateAddedItem(
    id: string,
    actionId: string,
    body: HttpTypes.AdminUpdateOrderEditItem,
    query?: HttpTypes.SelectParams,
    headers?: ClientHeaders
  ) {
    return await this.client.fetch<HttpTypes.AdminOrderEditPreviewResponse>(
      `/admin/order-edits/${id}/items/${actionId}`,
      {
        method: "POST",
        headers,
        body,
        query,
      }
    )
  }

  async removeItem(
    id: string,
    actionId: string,
    query?: HttpTypes.SelectParams,
    headers?: ClientHeaders
  ) {
    return await this.client.fetch<HttpTypes.AdminOrderEditPreviewResponse>(
      `/admin/order-edits/${id}/items/${actionId}`,
      {
        method: "DELETE",
        headers,
        query,
      }
    )
  }
}
