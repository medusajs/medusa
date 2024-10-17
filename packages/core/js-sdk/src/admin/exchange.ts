import { HttpTypes } from "@medusajs/types"

import { Client } from "../client"
import { ClientHeaders } from "../types"

export class Exchange {
  /**
   * @ignore
   */
  private client: Client
  /**
   * @ignore
   */
  constructor(client: Client) {
    this.client = client
  }

  async list(
    query?: HttpTypes.AdminExchangeListParams,
    headers?: ClientHeaders
  ) {
    return await this.client.fetch<HttpTypes.AdminExchangeListResponse>(
      `/admin/exchanges`,
      {
        query,
        headers,
      }
    )
  }

  async retrieve(
    id: string,
    query?: HttpTypes.AdminExchangeParams,
    headers?: ClientHeaders
  ) {
    return await this.client.fetch<HttpTypes.AdminExchangeResponse>(
      `/admin/exchanges/${id}`,
      {
        query,
        headers,
      }
    )
  }

  async create(
    body: HttpTypes.AdminCreateExchange,
    query?: HttpTypes.SelectParams,
    headers?: ClientHeaders
  ) {
    return await this.client.fetch<HttpTypes.AdminExchangeResponse>(
      `/admin/exchanges`,
      {
        method: "POST",
        headers,
        body,
        query,
      }
    )
  }

  async cancel(
    id: string,
    query?: HttpTypes.SelectParams,
    headers?: ClientHeaders
  ) {
    return await this.client.fetch<HttpTypes.AdminExchangeResponse>(
      `/admin/exchanges/${id}/cancel`,
      {
        method: "POST",
        headers,
        query,
      }
    )
  }

  async delete(
    id: string,
    query?: HttpTypes.SelectParams,
    headers?: ClientHeaders
  ) {
    return await this.client.fetch<HttpTypes.AdminExchangeDeleteResponse>(
      `/admin/exchanges/${id}`,
      {
        method: "DELETE",
        headers,
        query,
      }
    )
  }

  async addItems(
    id: string,
    body: HttpTypes.AdminAddExchangeItems,
    query?: HttpTypes.SelectParams,
    headers?: ClientHeaders
  ) {
    return await this.client.fetch<HttpTypes.AdminExchangeResponse>(
      `/admin/exchanges/${id}/exchange-items`,
      {
        method: "POST",
        headers,
        body,
        query,
      }
    )
  }

  async updateItem(
    id: string,
    actionId: string,
    body: HttpTypes.AdminUpdateExchangeItem,
    query?: HttpTypes.SelectParams,
    headers?: ClientHeaders
  ) {
    return await this.client.fetch<HttpTypes.AdminExchangeResponse>(
      `/admin/exchanges/${id}/exchange-items/${actionId}`,
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
    return await this.client.fetch<HttpTypes.AdminReturnResponse>(
      `/admin/exchanges/${id}/exchange-items/${actionId}`,
      {
        method: "DELETE",
        headers,
        query,
      }
    )
  }

  async addInboundItems(
    id: string,
    body: HttpTypes.AdminAddExchangeInboundItems,
    query?: HttpTypes.SelectParams,
    headers?: ClientHeaders
  ) {
    return await this.client.fetch<HttpTypes.AdminExchangeResponse>(
      `/admin/exchanges/${id}/inbound/items`,
      {
        method: "POST",
        headers,
        body,
        query,
      }
    )
  }

  async updateInboundItem(
    id: string,
    actionId: string,
    body: HttpTypes.AdminUpdateExchangeInboundItem,
    query?: HttpTypes.SelectParams,
    headers?: ClientHeaders
  ) {
    return await this.client.fetch<HttpTypes.AdminExchangeResponse>(
      `/admin/exchanges/${id}/inbound/items/${actionId}`,
      {
        method: "POST",
        headers,
        body,
        query,
      }
    )
  }

  async removeInboundItem(
    id: string,
    actionId: string,
    query?: HttpTypes.SelectParams,
    headers?: ClientHeaders
  ) {
    return await this.client.fetch<HttpTypes.AdminExchangeResponse>(
      `/admin/exchanges/${id}/inbound/items/${actionId}`,
      {
        method: "DELETE",
        headers,
        query,
      }
    )
  }

  async addInboundShipping(
    id: string,
    body: HttpTypes.AdminExchangeAddInboundShipping,
    query?: HttpTypes.SelectParams,
    headers?: ClientHeaders
  ) {
    return await this.client.fetch<HttpTypes.AdminExchangeResponse>(
      `/admin/exchanges/${id}/inbound/shipping-method`,
      {
        method: "POST",
        headers,
        body,
        query,
      }
    )
  }

  async updateInboundShipping(
    id: string,
    actionId: string,
    body: HttpTypes.AdminExchangeUpdateInboundShipping,
    query?: HttpTypes.SelectParams,
    headers?: ClientHeaders
  ) {
    return await this.client.fetch<HttpTypes.AdminExchangeResponse>(
      `/admin/exchanges/${id}/inbound/shipping-method/${actionId}`,
      {
        method: "POST",
        headers,
        body,
        query,
      }
    )
  }

  async deleteInboundShipping(
    id: string,
    actionId: string,
    query?: HttpTypes.SelectParams,
    headers?: ClientHeaders
  ) {
    return await this.client.fetch<HttpTypes.AdminExchangeResponse>(
      `/admin/exchanges/${id}/inbound/shipping-method/${actionId}`,
      {
        method: "DELETE",
        headers,
        query,
      }
    )
  }

  async addOutboundItems(
    id: string,
    body: HttpTypes.AdminAddExchangeOutboundItems,
    query?: HttpTypes.SelectParams,
    headers?: ClientHeaders
  ) {
    return await this.client.fetch<HttpTypes.AdminExchangeResponse>(
      `/admin/exchanges/${id}/outbound/items`,
      {
        method: "POST",
        headers,
        body,
        query,
      }
    )
  }

  async updateOutboundItem(
    id: string,
    actionId: string,
    body: HttpTypes.AdminUpdateExchangeOutboundItem,
    query?: HttpTypes.SelectParams,
    headers?: ClientHeaders
  ) {
    return await this.client.fetch<HttpTypes.AdminExchangeResponse>(
      `/admin/exchanges/${id}/outbound/items/${actionId}`,
      {
        method: "POST",
        headers,
        body,
        query,
      }
    )
  }

  async removeOutboundItem(
    id: string,
    actionId: string,
    query?: HttpTypes.SelectParams,
    headers?: ClientHeaders
  ) {
    return await this.client.fetch<HttpTypes.AdminExchangeResponse>(
      `/admin/exchanges/${id}/outbound/items/${actionId}`,
      {
        method: "DELETE",
        headers,
        query,
      }
    )
  }

  async addOutboundShipping(
    id: string,
    body: HttpTypes.AdminExchangeAddOutboundShipping,
    query?: HttpTypes.SelectParams,
    headers?: ClientHeaders
  ) {
    return await this.client.fetch<HttpTypes.AdminExchangeResponse>(
      `/admin/exchanges/${id}/outbound/shipping-method`,
      {
        method: "POST",
        headers,
        body,
        query,
      }
    )
  }

  async updateOutboundShipping(
    id: string,
    actionId: string,
    body: HttpTypes.AdminExchangeUpdateOutboundShipping,
    query?: HttpTypes.SelectParams,
    headers?: ClientHeaders
  ) {
    return await this.client.fetch<HttpTypes.AdminExchangeResponse>(
      `/admin/exchanges/${id}/outbound/shipping-method/${actionId}`,
      {
        method: "POST",
        headers,
        body,
        query,
      }
    )
  }

  async deleteOutboundShipping(
    id: string,
    actionId: string,
    query?: HttpTypes.SelectParams,
    headers?: ClientHeaders
  ) {
    return await this.client.fetch<HttpTypes.AdminExchangeResponse>(
      `/admin/exchanges/${id}/outbound/shipping-method/${actionId}`,
      {
        method: "DELETE",
        headers,
        query,
      }
    )
  }

  async request(
    id: string,
    body: HttpTypes.AdminRequestExchange,
    query?: HttpTypes.SelectParams,
    headers?: ClientHeaders
  ) {
    return await this.client.fetch<HttpTypes.AdminExchangeResponse>(
      `/admin/exchanges/${id}/request`,
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
    return await this.client.fetch<HttpTypes.AdminExchangeResponse>(
      `/admin/exchanges/${id}/request`,
      {
        method: "DELETE",
        headers,
        query,
      }
    )
  }
}
