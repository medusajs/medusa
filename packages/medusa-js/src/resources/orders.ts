import { StoreGetOrdersParams, StoreOrdersRes } from "@medusajs/medusa"
import { AxiosPromise } from "axios"
import BaseResource from "./base"

class OrdersResource extends BaseResource {
  /**
   * @description Retrieves an order
   * @param {string} id is required
   * @return {AxiosPromise<StoreOrdersRes>}
   */
  retrieve(id: string): AxiosPromise<StoreOrdersRes> {
    const path = `/store/orders/${id}`
    return this.client.request("GET", path)
  }

  /**
   * @description Retrieves an order by cart id
   * @param {string} cart_id is required
   * @return {AxiosPromise<StoreOrdersRes>}
   */
  retrieveByCartId(cart_id: string): AxiosPromise<StoreOrdersRes> {
    const path = `/store/orders/cart/${cart_id}`
    return this.client.request("GET", path)
  }

  /**
   * @description Look up an order using order details
   * @param {StoreGetOrdersParams} payload details used to look up the order
   * @return {AxiosPromise<StoreOrdersRes>}
   */
  lookupOrder(payload: StoreGetOrdersParams): AxiosPromise<StoreOrdersRes> {
    let path = `/store/orders?`

    const queryString = Object.entries(payload).map(([key, value]) => {
      let val = value
      if (Array.isArray(value)) {
        val = value.join(",")
      }

      return `${key}=${encodeURIComponent(val)}`
    })
    path = `/store/orders?${queryString.join("&")}`

    return this.client.request("GET", path, payload)
  }
}

export default OrdersResource
