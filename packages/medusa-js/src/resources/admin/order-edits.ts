import {
  AdminOrderEditDeleteRes,
  AdminOrderEditItemChangeDeleteRes,
  AdminOrderEditsRes,
  AdminPostOrderEditsOrderEditReq,
  AdminPostOrderEditsReq,
} from "@medusajs/medusa"
import { ResponsePromise } from "../../typings"
import BaseResource from "../base"

class AdminOrderEditsResource extends BaseResource {
  retrieve(
    id: string,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminOrderEditsRes> {
    const path = `/admin/order-edits/${id}`
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
}

export default AdminOrderEditsResource
