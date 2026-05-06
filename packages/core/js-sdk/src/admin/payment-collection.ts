import { HttpTypes, SelectParams } from "@medusajs/types"
import { Client } from "../client.js"
import { ClientHeaders } from "../types.js"

/**
 * The main service interface for payment collections in the admin SDK.
 */
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
  /**
   * This method authorizes a payment session that is in `pending_authorization` status.
   * It sends a request to the
   * [Authorize Payment Session](https://docs.medusajs.com/api/admin#payment-collections_postpaymentcollectionsidpaymentsessionssessionidauthorize)
   * API route.
   *
   * This is used for payment methods where authorization happens asynchronously
   * (e.g., bank transfers, payment links). The method triggers a re-check with
   * the payment provider to see if the payment has been completed.
   *
   * @param id - The payment collection's ID.
   * @param sessionId - The payment session's ID.
   * @param query - Configure the fields to retrieve in the payment collection.
   * @param headers - Headers to pass in the request.
   * @returns The payment collection's details.
   *
   * @example
   * sdk.admin.paymentCollection.authorizePaymentSession("paycol_123", "payses_123")
   * .then(({ payment_collection }) => {
   *   console.log(payment_collection)
   * })
   */
  async authorizePaymentSession(
    id: string,
    sessionId: string,
    query?: SelectParams,
    headers?: ClientHeaders
  ) {
    return await this.client.fetch<HttpTypes.AdminPaymentCollectionResponse>(
      `/admin/payment-collections/${id}/payment-sessions/${sessionId}/authorize`,
      {
        method: "POST",
        headers,
        query,
      }
    )
  }

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

  /**
   * This method creates a payment session for a payment collection. It sends a request to the
   * [Create Payment Session](https://docs.medusajs.com/api/admin#payment-collections_postpaymentcollectionsidpayment-sessions)
   * API route.
   *
   * @param id - The payment collection's ID.
   * @param body - The payment session's details.
   * @param query - Configure the fields to retrieve in the payment collection.
   * @param headers - Headers to pass in the request.
   * @returns The payment collection's details.
   *
   * @example
   * sdk.admin.paymentCollection.createPaymentSession("paycol_123", {
   *   provider_id: "pp_stripe_stripe"
   * })
   * .then(({ payment_collection }) => {
   *   console.log(payment_collection)
   * })
   *
   * @since 2.14.2
   * @tags payment-collections
   */
  async createPaymentSession(
    id: string,
    body: HttpTypes.AdminInitializePaymentSession,
    query?: SelectParams,
    headers?: ClientHeaders
  ) {
    return await this.client.fetch<HttpTypes.AdminPaymentCollectionResponse>(
      `/admin/payment-collections/${id}/payment-sessions`,
      {
        method: "POST",
        headers,
        body,
        query,
      }
    )
  }
}
