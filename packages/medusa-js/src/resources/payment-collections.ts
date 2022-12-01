import {
  GetPaymentCollectionsParams,
  StoreManageMultiplePaymentCollectionSessionRequest,
  StoreManagePaymentCollectionSessionRequest,
  StorePaymentCollectionSessionRes,
  StorePaymentCollectionRes,
} from "@medusajs/medusa"
import { ResponsePromise } from "../typings"
import BaseResource from "./base"
import qs from "qs"

class PaymentCollectionsResource extends BaseResource {
  retrieve(
    id: string,
    query?: GetPaymentCollectionsParams,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<StorePaymentCollectionRes> {
    let path = `/store/payment-collections/${id}`

    if (query) {
      const queryString = qs.stringify(query)
      path += `?${queryString}`
    }

    return this.client.request("GET", path, undefined, {}, customHeaders)
  }

  authorize(
    id: string,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<StorePaymentCollectionRes> {
    const path = `/store/payment-collections/${id}/authorize`
    return this.client.request("POST", path, undefined, {}, customHeaders)
  }

  manageMultiplePaymentSessions(
    id: string,
    payload: StoreManageMultiplePaymentCollectionSessionRequest,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<StorePaymentCollectionRes> {
    const path = `/store/payment-collections/${id}/multiple-sessions`
    return this.client.request("POST", path, payload, {}, customHeaders)
  }

  managePaymentSession(
    id: string,
    payload: StoreManagePaymentCollectionSessionRequest,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<StorePaymentCollectionRes> {
    const path = `/store/payment-collections/${id}/session`
    return this.client.request("POST", path, payload, {}, customHeaders)
  }

  refreshPaymentSession(
    id: string,
    session_id: string,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<StorePaymentCollectionSessionRes> {
    const path = `/store/payment-collections/${id}/sessions/${session_id}/refresh`
    return this.client.request("POST", path, undefined, {}, customHeaders)
  }
}

export default PaymentCollectionsResource
