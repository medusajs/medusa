import {
  AdminDraftOrdersDeleteRes,
  AdminDraftOrdersListRes,
  AdminDraftOrdersRes,
  AdminGetDraftOrdersParams,
  AdminPostDraftOrdersDraftOrderLineItemsItemReq,
  AdminPostDraftOrdersDraftOrderLineItemsReq,
  AdminPostDraftOrdersDraftOrderRegisterPaymentRes,
  AdminPostDraftOrdersDraftOrderReq,
} from "@medusajs/medusa"
import qs from "qs"
import { ResponsePromise } from "../../typings"
import BaseResource from "../base"

class AdminDraftOrdersResource extends BaseResource {
  /**
   * @description Creates a draft order
   */
  create(
    payload: AdminPostDraftOrdersDraftOrderReq,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminDraftOrdersRes> {
    const path = `/admin/draft-orders`
    return this.client.request("POST", path, payload, {}, customHeaders)
  }

  /**
   * @description Add line item to draft order
   */
  addLineItem(
    id: string,
    payload: AdminPostDraftOrdersDraftOrderLineItemsReq,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminDraftOrdersRes> {
    const path = `/admin/draft-orders/${id}/line-items`
    return this.client.request("POST", path, payload, {}, customHeaders)
  }

  /**
   * @description Delete draft order
   */
  delete(
    id: string,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminDraftOrdersDeleteRes> {
    const path = `/admin/draft-orders/${id}`
    return this.client.request("DELETE", path, undefined, {}, customHeaders)
  }

  /**
   * @description Remove line item
   */
  removeLineItem(
    id: string,
    itemId: string,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminDraftOrdersRes> {
    const path = `/admin/draft-orders/${id}/line-items/${itemId}`
    return this.client.request("DELETE", path, undefined, {}, customHeaders)
  }

  /**
   * @description Retrieves a draft order
   */
  retrieve(
    id: string,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminDraftOrdersRes> {
    const path = `/admin/draft-orders/${id}`
    return this.client.request("GET", path, undefined, {}, customHeaders)
  }

  /**
   * @description Lists draft orders
   */
  list(
    query?: AdminGetDraftOrdersParams,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminDraftOrdersListRes> {
    let path = `/admin/draft-orders`

    if (query) {
      const queryString = qs.stringify(query)
      path = `/admin/draft-orders?${queryString}`
    }

    return this.client.request("GET", path, undefined, {}, customHeaders)
  }

  /**
   * @description Mark a draft order as paid
   */
  markPaid(
    id: string,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminPostDraftOrdersDraftOrderRegisterPaymentRes> {
    const path = `/admin/draft-orders/${id}/pay`
    return this.client.request("POST", path, undefined)
  }

  /**
   * @description Update draft order
   */
  update(
    id: string,
    payload: AdminPostDraftOrdersDraftOrderReq,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminDraftOrdersRes> {
    const path = `/admin/draft-orders/${id}`
    return this.client.request("POST", path, payload, {}, customHeaders)
  }

  /**
   * @description Update draft order line item
   */
  updateLineItem(
    id: string,
    itemId: string,
    payload: AdminPostDraftOrdersDraftOrderLineItemsItemReq,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminDraftOrdersRes> {
    const path = `/admin/draft-orders/${id}/line-items/${itemId}`
    return this.client.request("POST", path, payload, {}, customHeaders)
  }
}

export default AdminDraftOrdersResource
