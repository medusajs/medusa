import { HttpTypes } from "@medusajs/types"
import { Client } from "../client"
import { ClientHeaders } from "../types"

export class OrderEdit {
  private client: Client
  constructor(client: Client) {
    this.client = client
  }

  // async retrieve(id: string, query?: SelectParams, headers?: ClientHeaders) {
  //   return await this.client.fetch<{ order: HttpTypes.AdminOrder }>(
  //     `/admin/order-edits/${id}`,
  //     {
  //       query,
  //       headers,
  //     }
  //   )
  // }
  //
  // async list(
  //   queryParams?: FindParams & HttpTypes.AdminOrderFilters,
  //   headers?: ClientHeaders
  // ) {
  //   return await this.client.fetch<
  //     PaginatedResponse<{ orders: HttpTypes.AdminOrder[] }>
  //   >(`/admin/order-edits`, {
  //     query: queryParams,
  //     headers,
  //   })
  // }

  async initiateRequest(
    body: HttpTypes.AdminInitiateOrderEditRequest,
    query?: HttpTypes.SelectParams,
    headers?: ClientHeaders
  ) {
    return await this.client.fetch<HttpTypes.AdminOrderResponse>(
      `/admin/order-edits`,
      {
        method: "POST",
        headers,
        body,
        query,
      }
    )
  }

  async cancelRequest(
    id: string,
    query?: HttpTypes.SelectParams,
    headers?: ClientHeaders
  ) {
    return await this.client.fetch<HttpTypes.AdminOrderResponse>(
      `/admin/order-edits/${id}`,
      {
        method: "DELETE",
        headers,
        query,
      }
    )
  }
}
