import {
  AdminPaymentRes,
  AdminPostPaymentRefundsReq,
  AdminRefundRes,
  GetPaymentsParams,
} from "@medusajs/medusa"
import qs from "qs"
import { ResponsePromise } from "../../typings"
import BaseResource from "../base"

/**
 * This class is used to send requests to [Admin Payment API Routes](https://docs.medusajs.com/api/admin#payments). All its method
 * are available in the JS Client under the `medusa.admin.payments` property.
 * 
 * All methods in this class require {@link AdminAuthResource.createSession | user authentication}.
 * 
 * A payment can be related to an order, swap, return, or more. It can be captured or refunded.
 */
class AdminPaymentsResource extends BaseResource {
  /**
   * Retrieve a payment's details.
   * @param {string} id - The payment's ID.
   * @param {GetPaymentsParams} query - Configurations to apply on the retrieved payment.
   * @param {Record<string, any>} customHeaders - Custom headers to attach to the request.
   * @returns {ResponsePromise<AdminPaymentRes>} Resolves to the payment's details.
   * 
   * @example
   * import Medusa from "@medusajs/medusa-js"
   * const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
   * // must be previously logged in or use api token
   * medusa.admin.payments.retrieve(paymentId)
   * .then(({ payment }) => {
   *   console.log(payment.id);
   * })
   */
  retrieve(
    id: string,
    query?: GetPaymentsParams,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminPaymentRes> {
    let path = `/admin/payments/${id}`

    if (query) {
      const queryString = qs.stringify(query)
      path = `/admin/payments/${id}?${queryString}`
    }

    return this.client.request("GET", path, undefined, {}, customHeaders)
  }

  /**
   * Capture a payment.
   * @param {string} id - The payment's ID.
   * @param {Record<string, any>} customHeaders - Custom headers to attach to the request.
   * @returns {ResponsePromise<AdminPaymentRes>} Resolves to the payment's details.
   * 
   * @example
   * import Medusa from "@medusajs/medusa-js"
   * const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
   * // must be previously logged in or use api token
   * medusa.admin.payments.capturePayment(paymentId)
   * .then(({ payment }) => {
   *   console.log(payment.id);
   * })
   */
  capturePayment(
    id: string,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminPaymentRes> {
    const path = `/admin/payments/${id}/capture`
    return this.client.request("POST", path, undefined, {}, customHeaders)
  }

  /**
   * Refund a payment. The payment must be captured first.
   * @param {string} id - The payment's ID.
   * @param {AdminPostPaymentRefundsReq} payload - The refund to be created.
   * @param {Record<string, any>} customHeaders - Custom headers to attach to the request.
   * @returns {ResponsePromise<AdminRefundRes>} Resolves to the refund's details.
   * 
   * @example
   * import Medusa from "@medusajs/medusa-js"
   * const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
   * // must be previously logged in or use api token
   * medusa.admin.payments.refundPayment(paymentId, {
   *   amount: 1000,
   *   reason: "return",
   *   note: "Do not like it",
   * })
   * .then(({ payment }) => {
   *   console.log(payment.id);
   * })
   */
  refundPayment(
    id: string,
    payload: AdminPostPaymentRefundsReq,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminRefundRes> {
    const path = `/admin/payments/${id}/refund`
    return this.client.request("POST", path, payload, {}, customHeaders)
  }
}

export default AdminPaymentsResource
