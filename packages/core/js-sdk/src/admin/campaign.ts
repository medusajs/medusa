import { HttpTypes } from "@medusajs/types"
import { Client } from "../client"
import { ClientHeaders } from "../types"

export class Campaign {
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

  async retrieve(
    id: string,
    query?: HttpTypes.AdminGetCampaignParams,
    headers?: ClientHeaders
  ) {
    return await this.client.fetch<HttpTypes.AdminCampaignResponse>(
      `/admin/campaigns/${id}`,
      {
        headers,
        query,
      }
    )
  }

  async list(
    query?: HttpTypes.AdminGetCampaignsParams,
    headers?: ClientHeaders
  ) {
    return await this.client.fetch<HttpTypes.AdminCampaignListResponse>(
      `/admin/campaigns`,
      {
        headers,
        query,
      }
    )
  }

  async create(
    payload: HttpTypes.AdminCreateCampaign,
    headers?: ClientHeaders
  ) {
    return await this.client.fetch<HttpTypes.AdminCampaignResponse>(
      `/admin/campaigns`,
      {
        method: "POST",
        headers,
        body: payload,
      }
    )
  }

  async update(
    id: string,
    payload: HttpTypes.AdminUpdateCampaign,
    headers?: ClientHeaders
  ) {
    return await this.client.fetch<HttpTypes.AdminCampaignResponse>(
      `/admin/campaigns/${id}`,
      {
        method: "POST",
        headers,
        body: payload,
      }
    )
  }

  async delete(id: string, headers?: ClientHeaders) {
    return await this.client.fetch<HttpTypes.DeleteResponse<"campaign">>(
      `/admin/campaigns/${id}`,
      {
        method: "DELETE",
        headers,
      }
    )
  }

  async batchPromotions(
    id: string,
    payload: HttpTypes.AdminBatchLink,
    headers?: ClientHeaders
  ) {
    return await this.client.fetch<HttpTypes.AdminCampaignResponse>(
      `/admin/campaigns/${id}/promotions`,
      {
        method: "POST",
        headers,
        body: payload,
      }
    )
  }
}
