import {
  StoreGetOrdersParams,
  StoreOrdersRes,
  StorePostCustomersCustomerAcceptClaimReq,
  StorePostCustomersCustomerOrderClaimReq,
} from "@medusajs/medusa"
import qs from "qs"
import { ResponsePromise } from "../typings"
import BaseResource from "./base"

/**
 * This class is used to send requests to [Store Order API Routes](https://docs.medusajs.com/api/store#orders). All its method
 * are available in the JS Client under the `medusa.orders` property.
 * 
 * Orders are purchases made by customers, typically through a storefront.
 * Orders are placed and created using {@link CartsResource}. The methods in this class allow retrieving and claiming orders.
 * 
 * Related Guide: [How to retrieve order details in a storefront](https://docs.medusajs.com/modules/orders/storefront/retrieve-order-details).
 */
class OrdersResource extends BaseResource {
  /**
   * Retrieve an Order's details.
   * @param {string} id - The order's ID.
   * @param {Record<string, any>} customHeaders - Custom headers to attach to the request.
   * @returns {ResponsePromise<StoreOrdersRes>} Resolves to the details of the order.
   * 
   * @example
   * import Medusa from "@medusajs/medusa-js"
   * const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
   * medusa.orders.retrieve(orderId)
   * .then(({ order }) => {
   *   console.log(order.id);
   * })
   */
  retrieve(
    id: string,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<StoreOrdersRes> {
    const path = `/store/orders/${id}`
    return this.client.request("GET", path, undefined, {}, customHeaders)
  }

  /**
   * Retrieve an order's details by the ID of the cart that was used to create the order.
   * @param {string} cart_id - The cart's ID.
   * @param {Record<string, any>} customHeaders - Custom headers to attach to the request.
   * @returns {ResponsePromise<StoreOrdersRes>} Resolves to the details of the order.
   * 
   * @example
   * import Medusa from "@medusajs/medusa-js"
   * const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
   * medusa.orders.retrieveByCartId(cartId)
   * .then(({ order }) => {
   *   console.log(order.id);
   * })
   */
  retrieveByCartId(
    cart_id: string,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<StoreOrdersRes> {
    const path = `/store/orders/cart/${cart_id}`
    return this.client.request("GET", path, undefined, {}, customHeaders)
  }

  /**
   * Look up an order using filters. If the filters don't narrow down the results to a single order, a `404` response is returned with no orders.
   * @param {StoreGetOrdersParams} payload - Filters used to retrieve the order.
   * @param {Record<string, any>} customHeaders - Custom headers to attach to the request.
   * @returns {ResponsePromise<StoreOrdersRes>} Resolves to the details of the order.
   * 
   * @example
   * import Medusa from "@medusajs/medusa-js"
   * const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
   * medusa.orders.lookupOrder({
   *   display_id: 1,
   *   email: "user@example.com"
   * })
   * .then(({ order }) => {
   *   console.log(order.id);
   * })
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
   * Allow the logged-in customer to claim ownership of one or more orders. This generates a token that can be used later on to verify the claim using the {@link confirmRequest} method.
   * This also emits the event `order-update-token.created`. So, if you have a notification provider installed that handles this event and sends the customer a notification, such as an email,
   * the customer should receive instructions on how to finalize their claim ownership.
   * @param {StorePostCustomersCustomerOrderClaimReq} payload - The orders to claim.
   * @param {Record<string, any>} customHeaders - Custom headers to attach to the request.
   * @returns {ResponsePromise} Resolves when the request is created successfully.
   * 
   * @example
   * import Medusa from "@medusajs/medusa-js"
   * const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
   * // must be previously logged in or use api token
   * medusa.orders.requestCustomerOrders({
   *   order_ids,
   * })
   * .then(() => {
   *   // successful
   * })
   * .catch(() => {
   *   // an error occurred
   * })
   */
  requestCustomerOrders(
    payload: StorePostCustomersCustomerOrderClaimReq,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise {
    const path = `/store/orders/batch/customer/token`
    return this.client.request("POST", path, payload, {}, customHeaders)
  }

  /**
   * Verify the claim order token provided to the customer when they request ownership of an order.
   * @param {StorePostCustomersCustomerAcceptClaimReq} payload - The claim order to verify.
   * @param {Record<string, any>} customHeaders - Custom headers to attach to the request.
   * @returns {ResponsePromise} Resolves when the claim order is verified successfully.
   * 
   * @example
   * import Medusa from "@medusajs/medusa-js"
   * const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
   * // must be previously logged in or use api token
   * medusa.orders.confirmRequest(
   *   token,
   * )
   * .then(() => {
   *   // successful
   * })
   * .catch(() => {
   *   // an error occurred
   * })
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
