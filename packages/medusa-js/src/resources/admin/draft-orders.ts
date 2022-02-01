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
    payload: AdminPostDraftOrdersDraftOrderReq
  ): ResponsePromise<AdminDraftOrdersRes> {
    const path = `/admin/draft-orders`
    return this.client.request("POST", path, payload)
  }

  /**
   * @description Add line item to draft order
   */
  addLineItem(
    id: string,
    payload: AdminPostDraftOrdersDraftOrderLineItemsReq
  ): ResponsePromise<AdminDraftOrdersRes> {
    const path = `/admin/draft-orders/${id}/line-items`
    return this.client.request("POST", path, payload)
  }

  /**
   * @description Delete draft order
   */
  delete(id: string): ResponsePromise<AdminDraftOrdersDeleteRes> {
    const path = `/admin/draft-orders/${id}`
    return this.client.request("DELETE", path)
  }

  /**
   * @description Remove line item
   */
  removeLineItem(
    id: string,
    itemId: string
  ): ResponsePromise<AdminDraftOrdersRes> {
    const path = `/admin/draft-orders/${id}/line-items/${itemId}`
    return this.client.request("DELETE", path)
  }

  /**
   * @description Retrieves a draft order
   */
  retrieve(id: string): ResponsePromise<AdminDraftOrdersRes> {
    const path = `/admin/draft-orders/${id}`
    return this.client.request("GET", path)
  }

  /**
   * @description Lists draft orders
   */
  list(
    query?: AdminGetDraftOrdersParams
  ): ResponsePromise<AdminDraftOrdersListRes> {
    let path = `/admin/draft-orders`

    if (query) {
      const queryString = qs.stringify(query)
      path = `/admin/draft-orders?${queryString}`
    }

    return this.client.request("GET", path)
  }

  /**
   * @description Mark a draft order as paid
   */
  markPaid(
    id: string
  ): ResponsePromise<AdminPostDraftOrdersDraftOrderRegisterPaymentRes> {
    const path = `/admin/draft-orders/${id}/register-payment`
    return this.client.request("POST", path, {})
  }

  /**
   * @description Update draft order
   */
  update(
    id: string,
    payload: AdminPostDraftOrdersDraftOrderReq
  ): ResponsePromise<AdminDraftOrdersRes> {
    const path = `/admin/draft-orders/${id}`
    return this.client.request("POST", path, payload)
  }

  /**
   * @description Update draft order line item
   */
  updateLineItem(
    id: string,
    itemId: string,
    payload: AdminPostDraftOrdersDraftOrderLineItemsItemReq
  ): ResponsePromise<AdminDraftOrdersRes> {
    const path = `/admin/draft-orders/${id}/line-items/${itemId}`
    return this.client.request("POST", path, payload)
  }
}

export default AdminDraftOrdersResource
