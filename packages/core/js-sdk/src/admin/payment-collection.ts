import { HttpTypes, SelectParams } from "@medusajs/types"
import { Client } from "../client"
import { ClientHeaders } from "../types"

export class PaymentCollection {
  private client: Client
  constructor(client: Client) {
    this.client = client
  }

  async list(
    query?: HttpTypes.AdminPaymentCollectionFilters,
    headers?: ClientHeaders
  ) {
    return await this.client.fetch<HttpTypes.AdminPaymentCollectionsResponse>(
      `/admin/payment-collections`,
      {
        query,
        headers,
      }
    )
  }

  async retrieve(
    id: string,
    query?: HttpTypes.AdminPaymentCollectionFilters,
    headers?: ClientHeaders
  ) {
    return await this.client.fetch<HttpTypes.AdminPaymentCollectionResponse>(
      `/admin/payment-collections/${id}`,
      {
        query,
        headers,
      }
    )
  }

  async create(
    body: HttpTypes.AdminCreatePaymentCollection,
    query?: SelectParams,
    headers?: ClientHeaders
  ) {
    return await this.client.fetch<HttpTypes.AdminPaymentCollectionResponse>(
      `/admin/payment-collections`,
      {
        method: "POST",
        headers,
        body,
        query,
      }
    )
  }

  async delete(id: string, headers?: ClientHeaders) {
    return await this.client.fetch<HttpTypes.AdminDeletePaymentCollectionResponse>(
      `/admin/payment-collections/${id}`,
      {
        method: "DELETE",
        headers,
      }
    )
  }
}
