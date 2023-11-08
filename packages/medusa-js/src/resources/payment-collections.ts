import {
  StoreGetPaymentCollectionsParams,
  StorePaymentCollectionSessionsReq,
  StorePaymentCollectionsRes,
  StorePaymentCollectionsSessionRes,
  StorePostPaymentCollectionsBatchSessionsAuthorizeReq,
  StorePostPaymentCollectionsBatchSessionsReq,
} from "@medusajs/medusa"
import { ResponsePromise } from "../typings"
import BaseResource from "./base"
import qs from "qs"

/**
 * This class is used to send requests to [Store Payment Collection API Routes](https://docs.medusajs.com/api/store#payment-collections). All its method
 * are available in the JS Client under the `medusa.paymentCollections` property.
 * 
 * A payment collection is useful for managing additional payments, such as for Order Edits, or installment payments.
 */
class PaymentCollectionsResource extends BaseResource {

  /**
   * Retrieve a Payment Collection's details.
   * @param {string} id - The ID of the payment collection.
   * @param {StoreGetPaymentCollectionsParams} query - Configurations to apply on the retrieved payment collection.
   * @param {Record<string, any>} customHeaders - Custom headers to attach to the request.
   * @returns {ResponsePromise<StorePaymentCollectionsRes>} Resolves to the payment collection's details.
   * 
   * @example
   * A simple example that retrieves a payment collection by its ID:
   * 
   * ```ts
   * import Medusa from "@medusajs/medusa-js"
   * const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
   * // must be previously logged in or use api token
   * medusa.paymentCollections.retrieve(paymentCollectionId)
   * .then(({ payment_collection }) => {
   *   console.log(payment_collection.id)
   * })
   * ```
   * 
   * To specify relations that should be retrieved:
   * 
   * ```ts
   * import Medusa from "@medusajs/medusa-js"
   * const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
   * // must be previously logged in or use api token
   * medusa.paymentCollections.retrieve(paymentCollectionId, {
   *   expand: "region"
   * })
   * .then(({ payment_collection }) => {
   *   console.log(payment_collection.id)
   * })
   * ```
   */
  retrieve(
    id: string,
    query?: StoreGetPaymentCollectionsParams,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<StorePaymentCollectionsRes> {
    let path = `/store/payment-collections/${id}`

    if (query) {
      const queryString = qs.stringify(query)
      path += `?${queryString}`
    }

    return this.client.request("GET", path, undefined, {}, customHeaders)
  }

  /**
   * Authorize a Payment Session of a Payment Collection.
   * @param {string} id  - The ID of the payment collection.
   * @param {string} session_id - The ID of the payment session.
   * @param {Record<string, any>} customHeaders - Custom headers to attach to the request.
   * @returns {ResponsePromise<StorePaymentCollectionsRes>} Resolves to the payment collection's details.
   * 
   * @example
   * import Medusa from "@medusajs/medusa-js"
   * const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
   * // must be previously logged in or use api token
   * medusa.paymentCollections.authorize(paymentId, sessionId)
   * .then(({ payment_collection }) => {
   *   console.log(payment_collection.id);
   * })
   */
  authorizePaymentSession(
    id: string,
    session_id: string,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<StorePaymentCollectionsRes> {
    const path = `/store/payment-collections/${id}/sessions/${session_id}/authorize`
    return this.client.request("POST", path, undefined, {}, customHeaders)
  }

  /**
   * Authorize the Payment Sessions of a Payment Collection.
   * @param {string} id - The ID of the payment collection.
   * @param {StorePostPaymentCollectionsBatchSessionsAuthorizeReq} payload - The list of payment session IDs to authorize.
   * @param {Record<string, any>} customHeaders - Custom headers to attach to the request.
   * @returns {ResponsePromise<StorePaymentCollectionsRes>} Resolves to the payment collection's details.
   * 
   * @example
   * import Medusa from "@medusajs/medusa-js"
   * const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
   * // must be previously logged in or use api token
   * medusa.paymentCollections.authorize(paymentId)
   * .then(({ payment_collection }) => {
   *   console.log(payment_collection.id);
   * })
   */
  authorizePaymentSessionsBatch(
    id: string,
    payload: StorePostPaymentCollectionsBatchSessionsAuthorizeReq,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<StorePaymentCollectionsRes> {
    const path = `/store/payment-collections/${id}/sessions/batch/authorize`
    return this.client.request("POST", path, payload, {}, customHeaders)
  }

  /**
   * Create, update, or delete a list of payment sessions of a Payment Collections. If a payment session is not provided in the `sessions` array, it's deleted.
   * @param {string} id - The ID of the payment collection.
   * @param {StorePostPaymentCollectionsBatchSessionsReq} payload - The attributes of each session to update.
   * @param {Record<string, any>} customHeaders - Custom headers to attach to the request.
   * @returns {ResponsePromise<StorePaymentCollectionsRes>} Resolves to the payment collection's details.
   * 
   * @example
   * To add two new payment sessions:
   * 
   * ```ts
   * import Medusa from "@medusajs/medusa-js"
   * const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
   * // must be previously logged in or use api token
 *
   * // Total amount = 10000
   * medusa.paymentCollections.managePaymentSessionsBatch(paymentId, {
   *   sessions: [
   *     {
   *       provider_id: "stripe",
   *       amount: 5000,
   *     },
   *     {
   *       provider_id: "manual",
   *       amount: 5000,
   *     },
   *   ]
   * })
   * .then(({ payment_collection }) => {
   *   console.log(payment_collection.id);
   * })
   * ```
   * 
   * To update a payment session and another one by not including it in the payload:
   * 
   * ```ts
   * medusa.paymentCollections.managePaymentSessionsBatch(paymentId, {
   *   sessions: [
   *     {
   *       provider_id: "stripe",
   *       amount: 10000,
   *       session_id: "ps_123456"
   *     },
   *   ]
   * })
   * .then(({ payment_collection }) => {
   *   console.log(payment_collection.id);
   * })
   * ```
   */
  managePaymentSessionsBatch(
    id: string,
    payload: StorePostPaymentCollectionsBatchSessionsReq,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<StorePaymentCollectionsRes> {
    const path = `/store/payment-collections/${id}/sessions/batch`
    return this.client.request("POST", path, payload, {}, customHeaders)
  }

  /**
   * Create a Payment Session for a payment provider in a Payment Collection.
   * @param {string} id - The ID of the payment collection.
   * @param {StorePaymentCollectionSessionsReq} payload - The payment session to create.
   * @param {Record<string, any>} customHeaders - Custom headers to attach to the request.
   * @returns {ResponsePromise<StorePaymentCollectionsRes>} Resolves to the payment collection's details.
   * 
   * @example
   * import Medusa from "@medusajs/medusa-js"
   * const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
   * // must be previously logged in or use api token
   * medusa.paymentCollections.managePaymentSession(payment_id, { provider_id: "stripe" })
   * .then(({ payment_collection }) => {
   *   console.log(payment_collection.id);
   * })
   */
  managePaymentSession(
    id: string,
    payload: StorePaymentCollectionSessionsReq,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<StorePaymentCollectionsRes> {
    const path = `/store/payment-collections/${id}/sessions`
    return this.client.request("POST", path, payload, {}, customHeaders)
  }

  /**
   * Refresh a Payment Session's data to ensure that it is in sync with the Payment Collection.
   * @param {string} id - The ID of the payment collection. 
   * @param {string} session_id - The ID of the payment session.
   * @param customHeaders 
   * @returns {ResponsePromise<StorePaymentCollectionsSessionRes>} Resolves to the refreshed payment session's details.
   * 
   * @example
   * import Medusa from "@medusajs/medusa-js"
   * const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
   * medusa.paymentCollections.refreshPaymentSession(paymentCollectionId, sessionId)
   * .then(({ payment_session }) => {
   *   console.log(payment_session.id);
   * })
   */
  refreshPaymentSession(
    id: string,
    session_id: string,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<StorePaymentCollectionsSessionRes> {
    const path = `/store/payment-collections/${id}/sessions/${session_id}`
    return this.client.request("POST", path, undefined, {}, customHeaders)
  }
}

export default PaymentCollectionsResource
