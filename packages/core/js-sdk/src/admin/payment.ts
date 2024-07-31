import { HttpTypes, SelectParams } from "@medusajs/types"
import { Client } from "../client"
import { ClientHeaders } from "../types"

export class Payment {
  private client: Client
  constructor(client: Client) {
    this.client = client
  }

  async capture(
    id: string,
    body: HttpTypes.AdminCapturePayment,
    query?: SelectParams,
    headers?: ClientHeaders
  ) {
    return await this.client.fetch<{ payment: HttpTypes.AdminPayment }>(
      `/admin/payments/${id}/capture`,
      {
        method: "POST",
        headers,
        body,
        query,
      }
    )
  }
}
