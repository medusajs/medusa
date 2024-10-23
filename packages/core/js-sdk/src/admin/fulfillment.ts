import { HttpTypes } from "@medusajs/types"
import { Client } from "../client"
import { ClientHeaders } from "../types"

export class Fulfillment {
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
   * This method creates a fulfillment. It sends a request to the 
   * [Create Fulfillment](https://docs.medusajs.com/api/admin#fulfillments_postfulfillments)
   * API route.
   * 
   * @param body - The fulfillment's details.
   * @param query - Configure the fields to retrieve in the fulfillment.
   * @param headers - Headers to pass in the request.
   * @returns The fulfillment's details.
   * 
   * @example
   * sdk.admin.fulfillment.create({
   *   location_id: "sloc_123",
   *   provider_id: "my_fulfillment",
   *   delivery_address: {
   *     country_code: "us"
   *   },
   *   items: [
   *     {
   *       title: "Shirt",
   *       sku: "SHIRT",
   *       quantity: 1,
   *       barcode: "123"
   *     }
   *   ],
   *   labels: [],
   *   order: {},
   *   order_id: "order_123"
   * })
   * .then(({ fulfillment }) => {
   *   console.log(fulfillment)
   * })
   */
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

  /**
   * This method cancels a fulfillment. It sends a request to the
   * [Cancel Fulfillment](https://docs.medusajs.com/api/admin#fulfillments_postfulfillmentsidcancel)
   * API route.
   * 
   * @param id - The fulfillment's ID.
   * @param query - Configure the fields to retrieve in the fulfillment.
   * @param headers - Headers to pass in the request.
   * @returns The fulfillment's details.
   * 
   * @example
   * sdk.admin.fulfillment.cancel("ful_123")
   * .then(({ fulfillment }) => {
   *   console.log(fulfillment)
   * })
   */
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
        query
      }
    )
  }

  /**
   * This method creates a shipment for a fulfillment. It sends a request to the
   * [Create Shipment](https://docs.medusajs.com/api/admin#fulfillments_postfulfillmentsidshipment)
   * API route.
   * 
   * @param id - The fulfillment's ID.
   * @param body - The shipment's details.
   * @param query - Configure the fields to retrieve in the fulfillment.
   * @param headers - Headers to pass in the request.
   * @returns The fulfillment's details.
   * 
   * @example
   * sdk.admin.fulfillment.createShipment("ful_123", {
   *   labels: [
   *     {
   *       tracking_number: "123",
   *       tracking_url: "example.com",
   *       label_url: "example.com"
   *     }
   *   ]
   * })
   * .then(({ fulfillment }) => {
   *   console.log(fulfillment)
   * })
   */
  async createShipment(
    id: string,
    body: HttpTypes.AdminCreateFulfillmentShipment,
    query?: HttpTypes.SelectParams,
    headers?: ClientHeaders
  ) {
    return await this.client.fetch<HttpTypes.AdminFulfillmentResponse>(
      `/admin/fulfillments/${id}/shipment`,
      {
        method: "POST",
        headers,
        body,
        query,
      }
    )
  }
}
