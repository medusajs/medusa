import {
  AdminPaymentRes,
  AdminPostPaymentRefundsReq,
  AdminRefundRes,
  GetPaymentsParams,
} from "@medusajs/medusa"
import qs from "qs"
import { ResponsePromise } from "../../typings"
import BaseResource from "../base"

class AdminPaymentsResource extends BaseResource {
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

  capturePayment(
    id: string,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminPaymentRes> {
    const path = `/admin/payments/${id}/capture`
    return this.client.request("POST", path, undefined, {}, customHeaders)
  }

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
