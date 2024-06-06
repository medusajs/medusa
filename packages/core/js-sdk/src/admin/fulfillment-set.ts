import { HttpTypes } from "@medusajs/types"
import { Client } from "../client"
import { ClientHeaders } from "../types"

export class FulfillmentSet {
  private client: Client
  constructor(client: Client) {
    this.client = client
  }

  async delete(id: string, headers?: ClientHeaders) {
    return await this.client.fetch<HttpTypes.AdminFulfillmentSetDeleteResponse>(
      `/admin/fulfillment-sets/${id}`,
      {
        method: "DELETE",
        headers,
      }
    )
  }

  async createServiceZone(
    id: string,
    body: HttpTypes.AdminCreateFulfillmentSetServiceZone,
    query?: HttpTypes.SelectParams,
    headers?: ClientHeaders
  ) {
    return await this.client.fetch<HttpTypes.AdminFulfillmentResponse>(
      `/admin/fulfillment-sets/${id}/service-zones`,
      {
        method: "POST",
        headers,
        body,
        query,
      }
    )
  }

  async retrieveServiceZones(
    fulfillmentSetId: string,
    serviceZoneId: string,
    query?: HttpTypes.SelectParams,
    headers?: ClientHeaders
  ) {
    return await this.client.fetch<HttpTypes.AdminServiceZoneResponse>(
      `/admin/fulfillment-sets/${fulfillmentSetId}/service-zones/${serviceZoneId}`,
      {
        method: "GET",
        headers,
        query,
      }
    )
  }

  async updateServiceZone(
    fulfillmentSetId: string,
    serviceZoneId: string,
    body: HttpTypes.AdminUpdateFulfillmentSetServiceZone,
    query?: HttpTypes.SelectParams,
    headers?: ClientHeaders
  ) {
    return await this.client.fetch<HttpTypes.AdminFulfillmentResponse>(
      `/admin/fulfillment-sets/${fulfillmentSetId}/service-zones/${serviceZoneId}`,
      {
        method: "POST",
        headers,
        body,
        query,
      }
    )
  }

  async deleteServiceZone(
    fulfillmentSetId: string,
    serviceZoneId: string,
    headers?: ClientHeaders
  ) {
    return await this.client.fetch<HttpTypes.AdminServiceZoneDeleteResponse>(
      `/admin/fulfillment-sets/${fulfillmentSetId}/service-zones/${serviceZoneId}`,
      {
        method: "DELETE",
        headers,
      }
    )
  }
}
