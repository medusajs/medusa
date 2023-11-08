import {
  AdminGetPaymentCollectionsParams,
  AdminPaymentCollectionDeleteRes,
  AdminPaymentCollectionsRes,
  AdminUpdatePaymentCollectionsReq,
} from "@medusajs/medusa"
import { ResponsePromise } from "../../typings"
import BaseResource from "../base"
import qs from "qs"

/**
 * This class is used to send requests to [Admin Payment Collection API Routes](https://docs.medusajs.com/api/admin#payment-collections). All its method
 * are available in the JS Client under the `medusa.admin.paymentCollections` property.
 * 
 * All methods in this class require {@link AdminAuthResource.createSession | user authentication}.
 * 
 * A payment collection is useful for managing additional payments, such as for Order Edits, or installment payments.
 */
class AdminPaymentCollectionsResource extends BaseResource {
  /**
   * Retrieve a Payment Collection's details.
   * @param {string} id - The ID of the payment collection.
   * @param {AdminGetPaymentCollectionsParams} query - Configurations to apply on the retrieved payment collection.
   * @param {Record<string, any>} customHeaders - Custom headers to attach to the request.
   * @returns {ResponsePromise<AdminPaymentCollectionsRes>} Resolves to the payment collection's details.
   * 
   * @example
   * A simple example that retrieves a payment collection by its ID:
   * 
   * ```ts
   * import Medusa from "@medusajs/medusa-js"
   * const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
   * // must be previously logged in or use api token
   * medusa.admin.paymentCollections.retrieve(paymentCollectionId)
   * .then(({ payment_collection }) => {
   *     console.log(payment_collection.id)
   *   })
   * ```
   * 
   * To specify relations that should be retrieved:
   * 
   * ```ts
   * import Medusa from "@medusajs/medusa-js"
   * const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
   * // must be previously logged in or use api token
   * medusa.admin.paymentCollections.retrieve(paymentCollectionId, {
   *   expand: "currency"
   * })
   * .then(({ payment_collection }) => {
   *   console.log(payment_collection.id)
   * })
   * ```
   */
  retrieve(
    id: string,
    query?: AdminGetPaymentCollectionsParams,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminPaymentCollectionsRes> {
    let path = `/admin/payment-collections/${id}`

    if (query) {
      const queryString = qs.stringify(query)
      path += `?${queryString}`
    }

    return this.client.request("GET", path, undefined, {}, customHeaders)
  }

  /**
   * Update a payment collection's details.
   * @param {string} id - The ID of the payment collection.
   * @param {AdminUpdatePaymentCollectionsReq} payload - The attributes to update in the payment collection.
   * @param {Record<string, any>} customHeaders - Custom headers to attach to the request.
   * @returns {ResponsePromise<AdminPaymentCollectionsRes>} Resolves to the payment collection's details.
   * 
   * @example
   * import Medusa from "@medusajs/medusa-js"
   * const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
   * // must be previously logged in or use api token
   * medusa.admin.paymentCollections.update(paymentCollectionId, {
   *   description
   * })
   * .then(({ payment_collection }) => {
   *   console.log(payment_collection.id)
   * })
   */
  update(
    id: string,
    payload: AdminUpdatePaymentCollectionsReq,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminPaymentCollectionsRes> {
    const path = `/admin/payment-collections/${id}`
    return this.client.request("POST", path, payload, {}, customHeaders)
  }

  /**
   * Delete a payment collection. Only payment collections with the statuses `canceled` or `not_paid` can be deleted.
   * @param {string} id - The ID of the payment collection.
   * @param {Record<string, any>} customHeaders - Custom headers to attach to the request.
   * @returns {ResponsePromise<AdminPaymentCollectionDeleteRes>} Resolves to the deletion operation's details.
   * 
   * @example
   * import Medusa from "@medusajs/medusa-js"
   * const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
   * // must be previously logged in or use api token
   * medusa.admin.paymentCollections.delete(paymentCollectionId)
   * .then(({ id, object, deleted }) => {
   *   console.log(id)
   * })
   */
  delete(
    id: string,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminPaymentCollectionDeleteRes> {
    const path = `/admin/payment-collections/${id}`
    return this.client.request("DELETE", path, undefined, {}, customHeaders)
  }

  /**
   * Set the status of a payment collection as `authorized`. This will also change the `authorized_amount` of the payment collection.
   * @param {string} id - The ID of the payment collection.
   * @param {Record<string, any>} customHeaders - Custom headers to attach to the request.
   * @returns {ResponsePromise<AdminPaymentCollectionsRes>} Resolves to the payment collection's details.
   * 
   * @example
   * import Medusa from "@medusajs/medusa-js"
   * const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
   * // must be previously logged in or use api token
   * medusa.admin.paymentCollections.markAsAuthorized(paymentCollectionId)
   * .then(({ payment_collection }) => {
   *   console.log(payment_collection.id)
   * })
   */
  markAsAuthorized(
    id: string,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminPaymentCollectionsRes> {
    const path = `/admin/payment-collections/${id}/authorize`
    return this.client.request("POST", path, undefined, {}, customHeaders)
  }
}

export default AdminPaymentCollectionsResource
