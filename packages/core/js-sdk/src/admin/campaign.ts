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

  /**
   * This method retrieves a campaign by its ID. It sends a request to the 
   * [Get Campaign](https://docs.medusajs.com/api/admin#campaigns_getcampaignsid) API route.
   * 
   * @param id - The campaign's ID.
   * @param query - Configure the fields to retrieve in the campaign.
   * @param headers - Headers to pass in the request
   * @returns The campaign's details.
   * 
   * @example
   * To retrieve a campaign by its ID:
   * 
   * ```ts
   * sdk.admin.campaign.retrieve("procamp_123")
   * .then(({ campaign }) => {
   *   console.log(campaign)
   * })
   * ```
   * 
   * To specify the fields and relations to retrieve:
   * 
   * ```ts
   * sdk.admin.campaign.retrieve("procamp_123", {
   *   fields: "id,*budget"
   * })
   * .then(({ campaign }) => {
   *   console.log(campaign)
   * })
   * ```
   * 
   * Learn more about the `fields` property in the [API reference](https://docs.medusajs.com/api/store#select-fields-and-relations).
   */
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

  /**
   * This method retrieves a paginated list of campaigns. It sends a request to the 
   * [List Campaigns](https://docs.medusajs.com/api/admin#campaigns_getcampaigns) API route.
   * 
   * @param query - Filters and pagination configurations.
   * @param headers - Headers to pass in the request.
   * @returns The paginated list of campaigns.
   * 
   * @example
   * To retrieve the list of campaigns:
   * 
   * ```ts
   * sdk.admin.campaign.list()
   * .then(({ campaigns, count, limit, offset }) => {
   *   console.log(campaigns)
   * })
   * ```
   * 
   * To configure the pagination, pass the `limit` and `offset` query parameters.
   * 
   * For example, to retrieve only 10 items and skip 10 items:
   * 
   * ```ts
   * sdk.admin.campaign.list({
   *   limit: 10,
   *   offset: 10
   * })
   * .then(({ campaigns, count, limit, offset }) => {
   *   console.log(campaigns)
   * })
   * ```
   * 
   * Using the `fields` query parameter, you can specify the fields and relations to retrieve
   * in each campaign:
   * 
   * ```ts
   * sdk.admin.campaign.list({
   *   fields: "id,*budget"
   * })
   * .then(({ campaigns, count, limit, offset }) => {
   *   console.log(campaigns)
   * })
   * ```
   * 
   * Learn more about the `fields` property in the [API reference](https://docs.medusajs.com/api/store#select-fields-and-relations).
   */
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

  /**
   * This method creates a campaign. It sends a request to the 
   * [Create Campaign](https://docs.medusajs.com/api/admin#campaigns_postcampaigns) API route.
   * 
   * @param payload - The details of the campaign to create.
   * @param headers - Headers to pass in the request
   * @returns The campaign's details.
   * 
   * @example
   * sdk.admin.campaign.create({
   *   name: "Summer Campaign"
   * })
   * .then(({ campaign }) => {
   *   console.log(campaign)
   * })
   */
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

  /**
   * This method updates a campaign. It sends a request to the 
   * [Update Campaign](https://docs.medusajs.com/api/admin#campaigns_postcampaignsid) API route.
   * 
   * @param id - The campaign's ID.
   * @param payload - The data to update in the campaign.
   * @param headers - Headers to pass in the request
   * @returns The campaign's details.
   * 
   * @example
   * sdk.admin.campaign.update("procamp_123", {
   *   name: "Summer Campaign"
   * })
   * .then(({ campaign }) => {
   *   console.log(campaign)
   * })
   */
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

  /**
   * This method deletes a campaign by its ID. It sends a request to the
   * [Delete Campaign](https://docs.medusajs.com/api/admin#campaigns_deletecampaignsid) API route.
   * 
   * @param id - The campaign's ID.
   * @param headers - Headers to pass in the request
   * @returns The deletion's details.
   * 
   * @example
   * sdk.admin.campaign.delete("procamp_123")
   * .then(({ deleted }) => {
   *   console.log(deleted)
   * })
   */
  async delete(id: string, headers?: ClientHeaders) {
    return await this.client.fetch<HttpTypes.DeleteResponse<"campaign">>(
      `/admin/campaigns/${id}`,
      {
        method: "DELETE",
        headers,
      }
    )
  }

  /**
   * This method manages the promotions of a campaign to either add or remove the association between them.
   * It sends a request to the [Manage Promotions](https://docs.medusajs.com/api/admin#campaigns_postcampaignsidpromotions)
   * API route.
   * 
   * @param id - The campaign's ID.
   * @param payload - The promotions to add or remove associations to them.
   * @param headers - Headers to pass in the request
   * @returns The campaign's details.
   */
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
