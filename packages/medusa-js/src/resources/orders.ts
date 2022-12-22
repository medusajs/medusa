import {
  StoreGetOrdersParams,
  StoreOrdersRes,
  StorePostCustomersCustomerAcceptClaimReq,
  StorePostCustomersCustomerOrderClaimReq,
} from "@medusajs/medusa"
import qs from "qs"
import { ResponsePromise } from "../typings"
import BaseResource from "./base"

class OrdersResource extends BaseResource {
  /**
   * @description Retrieves an order
   * @param {string} id is required
   * @param customHeaders
   * @return {ResponsePromise<StoreOrdersRes>}
   */
  retrieve(
    id: string,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<StoreOrdersRes> {
    const path = `/store/orders/${id}`
    return this.client.request("GET", path, undefined, {}, customHeaders)
  }

  /**
   * @description Retrieves an order by cart id
   * @param {string} cart_id is required
   * @param customHeaders
   * @return {ResponsePromise<StoreOrdersRes>}
   */
  retrieveByCartId(
    cart_id: string,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<StoreOrdersRes> {
    const path = `/store/orders/cart/${cart_id}`
    return this.client.request("GET", path, undefined, {}, customHeaders)
  }

  /**
   * @description Look up an order using order details
   * @param {StoreGetOrdersParams} payload details used to look up the order
   * @param customHeaders
   * @return {ResponsePromise<StoreOrdersRes>}
   */
  lookupOrder(
    payload: StoreGetOrdersParams,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<StoreOrdersRes> {
    let path = `/store/orders?`

    const queryString = qs.stringify(payload)
    path = `/store/orders?${queryString}`

    return this.client.request("GET", path, payload, {}, customHeaders)
  }

  /**
   * @description Request access to a list of orders
   * @param {string[]} payload display ids of orders to request
   * @param customHeaders
   * @return {ResponsePromise}
   */
  requestCustomerOrders(
    payload: StorePostCustomersCustomerOrderClaimReq,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise {
    const path = `/store/orders/batch/customer/token`
    return this.client.request("POST", path, payload, {}, customHeaders)
  }

  /**
   * @description Grant access to a list of orders
   * @param {string} payload signed token to grant access
   * @param customHeaders
   * @return {ResponsePromise}
   */
  confirmRequest(
    payload: StorePostCustomersCustomerAcceptClaimReq,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise {
    const path = `/store/orders/customer/confirm`
    return this.client.request("POST", path, payload, {}, customHeaders)
  }
}

export default OrdersResource
