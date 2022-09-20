import { StoreOrderEditsRes } from "@medusajs/medusa"
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
    declinedReason: string,
    customHeaders: Record<string, any> = {}
  ) {
    const path = `/store/order-edits/${id}/decline`
    return this.client.request("POST", path, { declined_reason: declinedReason }, {}, customHeaders)
  }
}

export default OrderEditsResource
