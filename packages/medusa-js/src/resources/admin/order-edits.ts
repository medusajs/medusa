import {
  AdminOrderEditDeleteRes,
  AdminOrderEditItemChangeDeleteRes,
  AdminOrderEditsListRes,
  AdminOrderEditsRes,
  AdminPostOrderEditsEditLineItemsLineItemReq,
  AdminPostOrderEditsEditLineItemsReq,
  AdminPostOrderEditsOrderEditReq,
  AdminPostOrderEditsReq,
  GetOrderEditsOrderEditParams,
  GetOrderEditsParams,
} from "@medusajs/medusa"
import { ResponsePromise } from "../../typings"
import BaseResource from "../base"
import qs from "qs"

class AdminOrderEditsResource extends BaseResource {
  retrieve(
    id: string,
    query?: GetOrderEditsOrderEditParams,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminOrderEditsRes> {
    let path = `/admin/order-edits/${id}`

    if (query) {
      const queryString = qs.stringify(query)
      path += `?${queryString}`
    }

    return this.client.request("GET", path, undefined, {}, customHeaders)
  }

  list(
    query?: GetOrderEditsParams,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminOrderEditsListRes> {
    let path = `/admin/order-edits`

    if (query) {
      const queryString = qs.stringify(query)
      path += `?${queryString}`
    }

    return this.client.request("GET", path, undefined, {}, customHeaders)
  }

  create(
    payload: AdminPostOrderEditsReq,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminOrderEditsRes> {
    const path = `/admin/order-edits`
    return this.client.request("POST", path, payload, {}, customHeaders)
  }

  update(
    id: string,
    payload: AdminPostOrderEditsOrderEditReq,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminOrderEditsRes> {
    const path = `/admin/order-edits/${id}`
    return this.client.request("POST", path, payload, {}, customHeaders)
  }

  delete(
    id: string,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminOrderEditDeleteRes> {
    const path = `/admin/order-edits/${id}`
    return this.client.request("DELETE", path, undefined, {}, customHeaders)
  }

  addLineItem(
    id: string,
    payload: AdminPostOrderEditsEditLineItemsReq,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminOrderEditsRes> {
    const path = `/admin/order-edits/${id}/items`
    return this.client.request("POST", path, payload, {}, customHeaders)
  }

  deleteItemChange(
    orderEditId: string,
    itemChangeId: string,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminOrderEditItemChangeDeleteRes> {
    const path = `/admin/order-edits/${orderEditId}/changes/${itemChangeId}`
    return this.client.request("DELETE", path, undefined, {}, customHeaders)
  }

  requestConfirmation(
    id: string,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminOrderEditsRes> {
    const path = `/admin/order-edits/${id}/request`
    return this.client.request("POST", path, undefined, {}, customHeaders)
  }

  cancel(
    id: string,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminOrderEditsRes> {
    const path = `/admin/order-edits/${id}/cancel`
    return this.client.request("POST", path, undefined, {}, customHeaders)
  }

  confirm(
    id: string,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminOrderEditsRes> {
    const path = `/admin/order-edits/${id}/confirm`
    return this.client.request("POST", path, undefined, {}, customHeaders)
  }

  updateLineItem(
    orderEditId: string,
    itemId: string,
    payload: AdminPostOrderEditsEditLineItemsLineItemReq,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminOrderEditsRes> {
    const path = `/admin/order-edits/${orderEditId}/items/${itemId}`
    return this.client.request("POST", path, payload, {}, customHeaders)
  }

  removeLineItem(
    orderEditId: string,
    itemId: string,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminOrderEditsRes> {
    const path = `/admin/order-edits/${orderEditId}/items/${itemId}`
    return this.client.request("DELETE", path, undefined, {}, customHeaders)
  }
}

export default AdminOrderEditsResource
