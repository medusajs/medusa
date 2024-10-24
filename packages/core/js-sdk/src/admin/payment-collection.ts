import { HttpTypes, SelectParams } from "@medusajs/types"
import { Client } from "../client"
import { ClientHeaders } from "../types"

export class PaymentCollection {
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

  /**
   * This method creates a payment collection. It sends a request to the
   * [Create Payment Collection](https://docs.medusajs.com/api/admin#payment-collections_postpaymentcollections)
   * API route.
   * 
   * @param body - The details of the payment collection to create.
   * @param query - Configure the fields to retrieve in the payment collection.
   * @param headers - Headers to pass in the request
   * @returns The payment collection's details.
   * 
   * @example
   * sdk.admin.paymentCollection.create({
   *   order_id: "order_123"
   * })
   * .then(({ payment_collection }) => {
   *   console.log(payment_collection)
   * })
   */
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

  /**
   * This method deletes a payment collection. It sends a request to the
   * [Delete Payment Collection](https://docs.medusajs.com/api/admin#payment-collections_deletepaymentcollectionsid)
   * API route.
   * 
   * @param id - The payment collection's ID.
   * @param headers - Headers to pass in the request
   * @returns The deletion's details.
   * 
   * @example
   * sdk.admin.paymentCollection.delete("paycol_123")
   * .then(({ deleted }) => {
   *   console.log(deleted)
   * })
   */
  async delete(id: string, headers?: ClientHeaders) {
    return await this.client.fetch<HttpTypes.AdminDeletePaymentCollectionResponse>(
      `/admin/payment-collections/${id}`,
      {
        method: "DELETE",
        headers,
      }
    )
  }

  /**
   * This method marks a payment collection as paid. It sends a request to the 
   * [Mark as Paid](https://docs.medusajs.com/api/admin#payment-collections_postpaymentcollectionsidmarkaspaid)
   * API route.
   * 
   * The API route creates and authorizes a payment session, then capture its payment, 
   * using the manual payment provider.
   * 
   * @param id - The payment collection to mark as paid.
   * @param body - The details to mark the payment collection as paid.
   * @param query - Configure the fields to retrieve in the payment collection.
   * @param headers - Headers to pass in the request.
   * @returns The payment collection's details.
   * 
   * @example
   * sdk.admin.paymentCollection.markAsPaid("paycol_123", {
   *   order_id: "order_123"
   * })
   * .then(({ payment_collection }) => {
   *   console.log(payment_collection)
   * })
   */
  async markAsPaid(
    id: string,
    body: HttpTypes.AdminMarkPaymentCollectionAsPaid,
    query?: SelectParams,
    headers?: ClientHeaders
  ) {
    return await this.client.fetch<HttpTypes.AdminPaymentCollectionResponse>(
      `/admin/payment-collections/${id}/mark-as-paid`,
      {
        method: "POST",
        headers,
        body,
        query,
      }
    )
  }
}
