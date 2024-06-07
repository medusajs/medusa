import { HttpTypes } from "@medusajs/types"
import { Client } from "../client"
import { ClientHeaders } from "../types"

export class Fulfillment {
  private client: Client
  constructor(client: Client) {
    this.client = client
  }

  async create(
    body: HttpTypes.AdminCreateFulfillment,
    query?: HttpTypes.SelectParams,
    headers?: ClientHeaders
  ) {
    return await this.client.fetch<HttpTypes.AdminFulfillmentResponse>(
      `/admin/fulfillments`,
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
    return await this.client.fetch<HttpTypes.AdminFulfillmentResponse>(
      `/admin/fulfillments/${id}`,
      {
        method: "POST",
        body: {},
        headers,
      }
    )
  }

  async createShipment(
    id: string,
    body: HttpTypes.AdminCreateFulfillmentShipment,
    query?: HttpTypes.SelectParams,
    headers?: ClientHeaders
  ) {
    return await this.client.fetch<HttpTypes.AdminFulfillmentResponse>(
      `/admin/fulfillments/${id}/shipments`,
      {
        method: "POST",
        headers,
        body,
        query,
      }
    )
  }
}
