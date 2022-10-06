import {
  StoreOrderEditsRes,
  StorePostOrderEditsOrderEditDecline,
} from "@medusajs/medusa"
import { ResponsePromise } from "../typings"
import BaseResource from "./base"

class OrderEditsResource extends BaseResource {
  retrieve(
    id: string,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<StoreOrderEditsRes> {
    const path = `/store/order-edits/${id}`
    return this.client.request("GET", path, undefined, {}, customHeaders)
  }

  decline(
    id: string,
    payload: StorePostOrderEditsOrderEditDecline,
    customHeaders: Record<string, any> = {}
  ) {
    const path = `/store/order-edits/${id}/decline`
    return this.client.request("POST", path, payload, {}, customHeaders)
  }

  complete(id: string, customHeaders: Record<string, any> = {}) {
    const path = `/store/order-edits/${id}/complete`
    return this.client.request("POST", path, undefined, {}, customHeaders)
  }
}

export default OrderEditsResource
