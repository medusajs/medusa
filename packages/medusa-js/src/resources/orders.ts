import { StoreGetOrdersParams, StoreOrdersRes } from "@medusajs/medusa"
import qs from "qs"
import { ResponsePromise } from "../typings"
import BaseResource from "./base"

class OrdersResource extends BaseResource {
  /**
   * @description Retrieves an order
   * @param {string} id is required
   * @return {ResponsePromise<StoreOrdersRes>}
   */
  retrieve(id: string): ResponsePromise<StoreOrdersRes> {
    const path = `/store/orders/${id}`
    return this.client.request("GET", path)
  }

  /**
   * @description Retrieves an order by cart id
   * @param {string} cart_id is required
   * @return {ResponsePromise<StoreOrdersRes>}
   */
  retrieveByCartId(cart_id: string): ResponsePromise<StoreOrdersRes> {
    const path = `/store/orders/cart/${cart_id}`
    return this.client.request("GET", path)
  }

  /**
   * @description Look up an order using order details
   * @param {StoreGetOrdersParams} payload details used to look up the order
   * @return {ResponsePromise<StoreOrdersRes>}
   */
  lookupOrder(payload: StoreGetOrdersParams): ResponsePromise<StoreOrdersRes> {
    let path = `/store/orders?`

    const queryString = qs.stringify(payload)
    path = `/store/orders?${queryString}`

    return this.client.request("GET", path, payload)
  }
}

export default OrdersResource
