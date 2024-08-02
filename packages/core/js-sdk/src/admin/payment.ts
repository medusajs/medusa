import { HttpTypes, SelectParams } from "@medusajs/types"
import { Client } from "../client"
import { ClientHeaders } from "../types"

export class Payment {
  private client: Client
  constructor(client: Client) {
    this.client = client
  }

  async list(query?: HttpTypes.AdminPaymentFilters, headers?: ClientHeaders) {
    return await this.client.fetch<HttpTypes.AdminPaymentsResponse>(
      `/admin/payments`,
      {
        query,
        headers,
      }
    )
  }

  async retrieve(
    id: string,
    query?: HttpTypes.AdminPaymentFilters,
    headers?: ClientHeaders
  ) {
    return await this.client.fetch<HttpTypes.AdminPaymentResponse>(
      `/admin/payments/${id}`,
      {
        query,
        headers,
      }
    )
  }

  async capture(
    id: string,
    body: HttpTypes.AdminCapturePayment,
    query?: SelectParams,
    headers?: ClientHeaders
  ) {
    return await this.client.fetch<HttpTypes.AdminPaymentResponse>(
      `/admin/payments/${id}/capture`,
      {
        method: "POST",
        headers,
        body,
        query,
      }
    )
  }

  async refund(
    id: string,
    body: HttpTypes.AdminRefundPayment,
    query?: SelectParams,
    headers?: ClientHeaders
  ) {
    return await this.client.fetch<HttpTypes.AdminPaymentResponse>(
      `/admin/payments/${id}/refund`,
      {
        method: "POST",
        headers,
        body,
        query,
      }
    )
  }
}
