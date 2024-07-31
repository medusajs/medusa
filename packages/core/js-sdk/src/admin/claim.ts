import { HttpTypes } from "@medusajs/types"

import { Client } from "../client"
import { ClientHeaders } from "../types"

export class Claim {
  private client: Client
  constructor(client: Client) {
    this.client = client
  }

  async list(query?: HttpTypes.AdminClaimListParams, headers?: ClientHeaders) {
    return await this.client.fetch<HttpTypes.AdminClaimListResponse>(
      `/admin/claims`,
      {
        query,
        headers,
      }
    )
  }

  async retrieve(
    id: string,
    query?: HttpTypes.AdminClaimParams,
    headers?: ClientHeaders
  ) {
    return await this.client.fetch<HttpTypes.AdminClaimResponse>(
      `/admin/claims/${id}`,
      {
        query,
        headers,
      }
    )
  }

  async create(
    body: HttpTypes.AdminCreateClaim,
    query?: HttpTypes.SelectParams,
    headers?: ClientHeaders
  ) {
    return await this.client.fetch<HttpTypes.AdminClaimResponse>(
      `/admin/claims`,
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
    return await this.client.fetch<HttpTypes.AdminClaimResponse>(
      `/admin/claims/${id}/cancel`,
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
    return await this.client.fetch<HttpTypes.AdminClaimDeleteResponse>(
      `/admin/claims/${id}`,
      {
        method: "DELETE",
        headers,
        query,
      }
    )
  }

  async addItems(
    id: string,
    body: HttpTypes.AdminAddClaimItems,
    query?: HttpTypes.SelectParams,
    headers?: ClientHeaders
  ) {
    return await this.client.fetch<HttpTypes.AdminClaimResponse>(
      `/admin/claims/${id}/claim-items`,
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
    body: HttpTypes.AdminUpdateClaimItem,
    query?: HttpTypes.SelectParams,
    headers?: ClientHeaders
  ) {
    return await this.client.fetch<HttpTypes.AdminClaimResponse>(
      `/admin/claims/${id}/claim-items/${actionId}`,
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
      `/admin/claims/${id}/claim-items/${actionId}`,
      {
        method: "DELETE",
        headers,
        query,
      }
    )
  }

  async addInboundItems(
    id: string,
    body: HttpTypes.AdminAddClaimInboundItems,
    query?: HttpTypes.SelectParams,
    headers?: ClientHeaders
  ) {
    return await this.client.fetch<HttpTypes.AdminClaimResponse>(
      `/admin/claims/${id}/inbound/items`,
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
    body: HttpTypes.AdminUpdateClaimInboundItem,
    query?: HttpTypes.SelectParams,
    headers?: ClientHeaders
  ) {
    return await this.client.fetch<HttpTypes.AdminClaimResponse>(
      `/admin/claims/${id}/inbound/items/${actionId}`,
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
    return await this.client.fetch<HttpTypes.AdminClaimResponse>(
      `/admin/claims/${id}/inbound/items/${actionId}`,
      {
        method: "DELETE",
        headers,
        query,
      }
    )
  }

  async addInboundShipping(
    id: string,
    body: HttpTypes.AdminClaimAddInboundShipping,
    query?: HttpTypes.SelectParams,
    headers?: ClientHeaders
  ) {
    return await this.client.fetch<HttpTypes.AdminClaimResponse>(
      `/admin/claims/${id}/inbound/shipping-method`,
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
    body: HttpTypes.AdminClaimUpdateInboundShipping,
    query?: HttpTypes.SelectParams,
    headers?: ClientHeaders
  ) {
    return await this.client.fetch<HttpTypes.AdminClaimResponse>(
      `/admin/claims/${id}/inbound/shipping-method/${actionId}`,
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
    return await this.client.fetch<HttpTypes.AdminClaimResponse>(
      `/admin/claims/${id}/inbound/shipping-method/${actionId}`,
      {
        method: "DELETE",
        headers,
        query,
      }
    )
  }

  async addOutboundItems(
    id: string,
    body: HttpTypes.AdminAddClaimOutboundItems,
    query?: HttpTypes.SelectParams,
    headers?: ClientHeaders
  ) {
    return await this.client.fetch<HttpTypes.AdminClaimResponse>(
      `/admin/claims/${id}/outbound/items`,
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
    body: HttpTypes.AdminUpdateClaimOutboundItem,
    query?: HttpTypes.SelectParams,
    headers?: ClientHeaders
  ) {
    return await this.client.fetch<HttpTypes.AdminClaimResponse>(
      `/admin/claims/${id}/outbound/items/${actionId}`,
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
    return await this.client.fetch<HttpTypes.AdminClaimResponse>(
      `/admin/claims/${id}/outbound/items/${actionId}`,
      {
        method: "DELETE",
        headers,
        query,
      }
    )
  }

  async addOutboundShipping(
    id: string,
    body: HttpTypes.AdminClaimAddOutboundShipping,
    query?: HttpTypes.SelectParams,
    headers?: ClientHeaders
  ) {
    return await this.client.fetch<HttpTypes.AdminClaimResponse>(
      `/admin/claims/${id}/outbound/shipping-method`,
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
    body: HttpTypes.AdminClaimUpdateOutboundShipping,
    query?: HttpTypes.SelectParams,
    headers?: ClientHeaders
  ) {
    return await this.client.fetch<HttpTypes.AdminClaimResponse>(
      `/admin/claims/${id}/outbound/shipping-method/${actionId}`,
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
    return await this.client.fetch<HttpTypes.AdminClaimResponse>(
      `/admin/claims/${id}/outbound/shipping-method/${actionId}`,
      {
        method: "DELETE",
        headers,
        query,
      }
    )
  }

  async request(
    id: string,
    body: HttpTypes.AdminRequestClaim,
    query?: HttpTypes.SelectParams,
    headers?: ClientHeaders
  ) {
    return await this.client.fetch<HttpTypes.AdminClaimResponse>(
      `/admin/claims/${id}/request`,
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
    return await this.client.fetch<HttpTypes.AdminClaimResponse>(
      `/admin/claims/${id}/request`,
      {
        method: "DELETE",
        headers,
        query,
      }
    )
  }
}
