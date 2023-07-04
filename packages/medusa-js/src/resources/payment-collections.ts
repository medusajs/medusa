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

class PaymentCollectionsResource extends BaseResource {
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

  authorizePaymentSession(
    id: string,
    session_id: string,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<StorePaymentCollectionsRes> {
    const path = `/store/payment-collections/${id}/sessions/${session_id}/authorize`
    return this.client.request("POST", path, undefined, {}, customHeaders)
  }

  authorizePaymentSessionsBatch(
    id: string,
    payload: StorePostPaymentCollectionsBatchSessionsAuthorizeReq,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<StorePaymentCollectionsRes> {
    const path = `/store/payment-collections/${id}/sessions/batch/authorize`
    return this.client.request("POST", path, payload, {}, customHeaders)
  }

  managePaymentSessionsBatch(
    id: string,
    payload: StorePostPaymentCollectionsBatchSessionsReq,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<StorePaymentCollectionsRes> {
    const path = `/store/payment-collections/${id}/sessions/batch`
    return this.client.request("POST", path, payload, {}, customHeaders)
  }

  managePaymentSession(
    id: string,
    payload: StorePaymentCollectionSessionsReq,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<StorePaymentCollectionsRes> {
    const path = `/store/payment-collections/${id}/sessions`
    return this.client.request("POST", path, payload, {}, customHeaders)
  }

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
