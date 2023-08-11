import {
  AdminGetPaymentCollectionsParams,
  AdminPaymentCollectionDeleteRes,
  AdminPaymentCollectionsRes,
  AdminUpdatePaymentCollectionsReq,
} from "@medusajs/medusa"
import { ResponsePromise } from "../../typings"
import BaseResource from "../base"
import qs from "qs"

class AdminPaymentCollectionsResource extends BaseResource {
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

  update(
    id: string,
    payload: AdminUpdatePaymentCollectionsReq,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminPaymentCollectionsRes> {
    const path = `/admin/payment-collections/${id}`
    return this.client.request("POST", path, payload, {}, customHeaders)
  }

  delete(
    id: string,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminPaymentCollectionDeleteRes> {
    const path = `/admin/payment-collections/${id}`
    return this.client.request("DELETE", path, undefined, {}, customHeaders)
  }

  markAsAuthorized(
    id: string,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminPaymentCollectionsRes> {
    const path = `/admin/payment-collections/${id}/authorize`
    return this.client.request("POST", path, undefined, {}, customHeaders)
  }
}

export default AdminPaymentCollectionsResource
