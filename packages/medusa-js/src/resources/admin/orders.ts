import {
  AdminGetOrdersParams,
  AdminOrdersListRes,
  AdminOrdersRes,
  AdminPostOrdersOrderClaimsClaimFulfillmentsReq,
  AdminPostOrdersOrderClaimsClaimReq,
  AdminPostOrdersOrderClaimsClaimShipmentsReq,
  AdminPostOrdersOrderClaimsReq,
  AdminPostOrdersOrderFulfillmentsReq,
  AdminPostOrdersOrderRefundsReq,
  AdminPostOrdersOrderReq,
  AdminPostOrdersOrderReturnsReq,
  AdminPostOrdersOrderShipmentReq,
  AdminPostOrdersOrderShippingMethodsReq,
  AdminPostOrdersOrderSwapsReq,
  AdminPostOrdersOrderSwapsSwapFulfillmentsReq,
  AdminPostOrdersOrderSwapsSwapShipmentsReq,
} from "@medusajs/medusa"
import { FindParams } from "@medusajs/medusa/dist/types/common"
import qs from "qs"
import { ResponsePromise } from "../../typings"
import BaseResource from "../base"

/**
 * This class is used to send requests to [Admin Order API Routes](https://docs.medusajs.com/api/admin#orders). All its method
 * are available in the JS Client under the `medusa.admin.orders` property.
 * 
 * All methods in this class require {@link AdminAuthResource.createSession | user authentication}.
 * 
 * Orders are purchases made by customers, typically through a storefront using {@link CartsResource}. Draft orders created by the admin are also transformed to an Order once the payment is captured.
 * Managing orders include managing fulfillment, payment, claims, reservations, and more.
 * 
 * Related Guide: [How to manage orders](https://docs.medusajs.com/modules/orders/admin/manage-orders).
 */
class AdminOrdersResource extends BaseResource {
  /**
   * Update and order's details.
   * @param {string} id - The order's ID.
   * @param {AdminPostOrdersOrderReq} payload - The attributes to update in the order.
   * @param {Record<string, any>} customHeaders - Custom headers to attach to the request.
   * @returns {ResponsePromise<AdminOrdersRes>} Resolves to the order's details.
   * 
   * @example
   * import Medusa from "@medusajs/medusa-js"
   * const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
   * // must be previously logged in or use api token
   * medusa.admin.orders.update(orderId, {
   *   email: "user@example.com"
   * })
   * .then(({ order }) => {
   *   console.log(order.id);
   * })
   */
  update(
    id: string,
    payload: AdminPostOrdersOrderReq,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminOrdersRes> {
    const path = `/admin/orders/${id}`
    return this.client.request("POST", path, payload, {}, customHeaders)
  }

  /**
   * Retrieve an order's details.
   * @param {string} id - The order's ID.
   * @param {FindParams} query - Configurations to apply on the retrieved order.
   * @param {Record<string, any>} customHeaders - Custom headers to attach to the request.
   * @returns {ResponsePromise<AdminOrdersRes>} Resolves to the order's details.
   * 
   * @example
   * A simple example that retrieves an order by its ID:
   * 
   * ```ts
   * import Medusa from "@medusajs/medusa-js"
   * const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
   * // must be previously logged in or use api token
   * medusa.admin.orders.retrieve(orderId)
   * .then(({ order }) => {
   *   console.log(order.id);
   * })
   * ```
   * 
   * To specify relations that should be retrieved:
   * 
   * ```ts
   * import Medusa from "@medusajs/medusa-js"
   * const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
   * // must be previously logged in or use api token
   * medusa.admin.orders.retrieve(orderId, {
   *   expand: "customer"
   * })
   * .then(({ order }) => {
   *   console.log(order.id);
   * })
   * ```
   */
  retrieve(
    id: string,
    query?: FindParams,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminOrdersRes> {
    let path = `/admin/orders/${id}`

    if (query) {
      const queryString = qs.stringify(query)
      path = `/admin/orders/${id}?${queryString}`
    }

    return this.client.request("GET", path, undefined, {}, customHeaders)
  }

  /**
   * Retrieve a list of orders. The orders can be filtered by fields such as `status` or `display_id` passed in the `query` parameter. The order can also be paginated.
   * @param {AdminGetOrdersParams} query - Filters and pagination configurations applied on the retrieved orders.
   * @param {Record<string, any>} customHeaders - Custom headers to attach to the request.
   * @returns {ResponsePromise<AdminOrdersListRes>} Resolves to the list of orders with pagination fields.
   * 
   * @example
   * To list orders:
   * 
   * ```ts
   * import Medusa from "@medusajs/medusa-js"
   * const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
   * // must be previously logged in or use api token
   * medusa.admin.orders.list()
   * .then(({ orders, limit, offset, count }) => {
   *   console.log(orders.length);
   * })
   * ```
   * 
   * To specify relations that should be retrieved within the orders:
   * 
   * ```ts
   * import Medusa from "@medusajs/medusa-js"
   * const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
   * // must be previously logged in or use api token
   * medusa.admin.orders.list({
   *   expand: "customers"
   * })
   * .then(({ orders, limit, offset, count }) => {
   *   console.log(orders.length);
   * })
   * ```
   * 
   * By default, only the first `50` records are retrieved. You can control pagination by specifying the `limit` and `offset` properties:
   * 
   * ```ts
   * import Medusa from "@medusajs/medusa-js"
   * const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
   * // must be previously logged in or use api token
   * medusa.admin.orders.list({
   *   expand: "customers",
   *   limit,
   *   offset
   * })
   * .then(({ orders, limit, offset, count }) => {
   *   console.log(orders.length);
   * })
   * ```
   */
  list(
    query?: AdminGetOrdersParams,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminOrdersListRes> {
    let path = `/admin/orders`

    if (query) {
      const queryString = qs.stringify(query)
      path = `/admin/orders?${queryString}`
    }

    return this.client.request("GET", path, undefined, {}, customHeaders)
  }

  /**
   * Complete an order and change its status. A canceled order can't be completed.
   * @param {string} id - The order's ID.
   * @param {Record<string, any>} customHeaders - Custom headers to attach to the request.
   * @returns {ResponsePromise<AdminOrdersRes>} Resolves to the order's details.
   * 
   * @example
   * import Medusa from "@medusajs/medusa-js"
   * const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
   * // must be previously logged in or use api token
   * medusa.admin.orders.complete(orderId)
   * .then(({ order }) => {
   *   console.log(order.id);
   * })
   */
  complete(
    id: string,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminOrdersRes> {
    const path = `/admin/orders/${id}/complete`
    return this.client.request("POST", path, undefined, {}, customHeaders)
  }

  /**
   * Capture all the payments associated with an order. The payment of canceled orders can't be captured.
   * @param {string} id - The ID of the order whose payments should be captured.
   * @param {Record<string, any>} customHeaders - Custom headers to attach to the request.
   * @returns {ResponsePromise<AdminOrdersRes>} Resolves to the order's details.
   * 
   * @example
   * import Medusa from "@medusajs/medusa-js"
   * const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
   * // must be previously logged in or use api token
   * medusa.admin.orders.capturePayment(orderId)
   * .then(({ order }) => {
   *   console.log(order.id);
   * })
   */
  capturePayment(
    id: string,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminOrdersRes> {
    const path = `/admin/orders/${id}/capture`
    return this.client.request("POST", path, undefined, {}, customHeaders)
  }

  /**
   * Refund an amount for an order. The amount must be less than or equal the `refundable_amount` of the order.
   * @param {string} id - The ID of the order whose customer should be refunded.
   * @param {AdminPostOrdersOrderRefundsReq} payload - The refund's details.
   * @param {Record<string, any>} customHeaders - Custom headers to attach to the request.
   * @returns {ResponsePromise<AdminOrdersRes>} Resolves to the order's details.
   * 
   * @example
   * import Medusa from "@medusajs/medusa-js"
   * const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
   * // must be previously logged in or use api token
   * medusa.admin.orders.refundPayment(orderId, {
   *   amount: 1000,
   *   reason: "Do not like it"
   * })
   * .then(({ order }) => {
   *   console.log(order.id);
   * })
   */
  refundPayment(
    id: string,
    payload: AdminPostOrdersOrderRefundsReq,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminOrdersRes> {
    const path = `/admin/orders/${id}/refund`
    return this.client.request("POST", path, payload, {}, customHeaders)
  }

  /**
   * Create a Fulfillment of an Order using the fulfillment provider, and change the order's fulfillment status to either `partially_fulfilled` or `fulfilled`, depending on
 *  whether all the items were fulfilled.
   * @param {string} id - The ID of the order that the fulfillment belongs to.
   * @param {AdminPostOrdersOrderFulfillmentsReq} payload - The fulfillment to be created.
   * @param {Record<string, any>} customHeaders - Custom headers to attach to the request.
   * @returns {ResponsePromise<AdminOrdersRes>} Resolves to the order's details.
   * 
   * @example
   * import Medusa from "@medusajs/medusa-js"
   * const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
   * // must be previously logged in or use api token
   * medusa.admin.orders.createFulfillment(orderId, {
   *   items: [
   *     {
   *       item_id,
   *       quantity: 1
   *     }
   *   ]
   * })
   * .then(({ order }) => {
   *   console.log(order.id);
   * })
   */
  createFulfillment(
    id: string,
    payload: AdminPostOrdersOrderFulfillmentsReq,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminOrdersRes> {
    const path = `/admin/orders/${id}/fulfillment`
    return this.client.request("POST", path, payload, {}, customHeaders)
  }

  /**
   * Cancel an order's fulfillment and change its fulfillment status to `canceled`.
   * @param {string} id - The ID of the order that the fulfillment belongs to.
   * @param {string} fulfillmentId - The fulfillment's ID.
   * @param {Record<string, any>} customHeaders - Custom headers to attach to the request.
   * @returns {ResponsePromise<AdminOrdersRes>} Resolves to the order's details.
   * 
   * @example
   * import Medusa from "@medusajs/medusa-js"
   * const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
   * // must be previously logged in or use api token
   * medusa.admin.orders.cancelFulfillment(orderId, fulfillmentId)
   * .then(({ order }) => {
   *   console.log(order.id);
   * })
   */
  cancelFulfillment(
    id: string,
    fulfillmentId: string,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminOrdersRes> {
    const path = `/admin/orders/${id}/fulfillments/${fulfillmentId}/cancel`
    return this.client.request("POST", path, undefined, {}, customHeaders)
  }

  /**
   * Cancel a swap's fulfillment and change its fulfillment status to `canceled`.
   * @param {string} id - The ID of the order that the swap is associated with.
   * @param {string} swapId - The ID of the swap the fulfillment belongs to.
   * @param {string} fulfillmentId - The fulfillment's ID. 
   * @param {Record<string, any>} customHeaders - Custom headers to attach to the request.
   * @returns {ResponsePromise<AdminOrdersRes>} Resolves to the order's details.
   * 
   * @example
   * import Medusa from "@medusajs/medusa-js"
   * const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
   * // must be previously logged in or use api token
   * medusa.admin.orders.cancelSwapFulfillment(orderId, swapId, fulfillmentId)
   * .then(({ order }) => {
   *   console.log(order.id);
   * })
   */
  cancelSwapFulfillment(
    id: string,
    swapId: string,
    fulfillmentId: string,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminOrdersRes> {
    const path = `/admin/orders/${id}/swaps/${swapId}/fulfillments/${fulfillmentId}/cancel`
    return this.client.request("POST", path, undefined, {}, customHeaders)
  }

  /**
   * Cancel a claim's fulfillment and change its fulfillment status to `canceled`.
   * @param {string} id - The ID of the order that the claim is associated with.
   * @param {string} claimId - The claim's ID.
   * @param {string} fulfillmentId - The fulfillment's ID.
   * @param {Record<string, any>} customHeaders - Custom headers to attach to the request.
   * @returns {ResponsePromise<AdminOrdersRes>} Resolves to the order's details.
   * 
   * @example
   * import Medusa from "@medusajs/medusa-js"
   * const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
   * // must be previously logged in or use api token
   * medusa.admin.orders.cancelClaimFulfillment(orderId, claimId, fulfillmentId)
   * .then(({ order }) => {
   *   console.log(order.id);
   * })
   */
  cancelClaimFulfillment(
    id: string,
    claimId: string,
    fulfillmentId: string,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminOrdersRes> {
    const path = `/admin/orders/${id}/claims/${claimId}/fulfillments/${fulfillmentId}/cancel`
    return this.client.request("POST", path, undefined, {}, customHeaders)
  }

  /**
   * Create a shipment and mark a fulfillment as shipped. This changes the order's fulfillment status to either `partially_shipped` or `shipped`, depending on
   * whether all the items were shipped.
   * @param {string} id - The ID of the order
   * @param {AdminPostOrdersOrderShipmentReq} payload - The shipment to be created.
   * @param {Record<string, any>} customHeaders - Custom headers to attach to the request.
   * @returns {ResponsePromise<AdminOrdersRes>} Resolves to the order's details.
   * 
   * @example
   * import Medusa from "@medusajs/medusa-js"
   * const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
   * // must be previously logged in or use api token
   * medusa.admin.orders.createShipment(order_id, {
   *   fulfillment_id
   * })
   * .then(({ order }) => {
   *   console.log(order.id);
   * })
   */
  createShipment(
    id: string,
    payload: AdminPostOrdersOrderShipmentReq,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminOrdersRes> {
    const path = `/admin/orders/${id}/shipment`
    return this.client.request("POST", path, payload, {}, customHeaders)
  }

  /**
   * Request and create a return for items in an order. If the return shipping method is specified, it will be automatically fulfilled.
   * @param {string} id - The order's ID.
   * @param {AdminPostOrdersOrderReturnsReq} payload - The return to be created.
   * @param {Record<string, any>} customHeaders - Custom headers to attach to the request.
   * @returns {ResponsePromise<AdminOrdersRes>} Resolves to the order's details. You can access the return under the `returns` property.
   * 
   * @example
   * import Medusa from "@medusajs/medusa-js"
   * const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
   * // must be previously logged in or use api token
   * medusa.admin.orders.requestReturn(orderId, {
   *   items: [
   *     {
   *       item_id,
   *       quantity: 1
   *     }
   *   ]
   * })
   * .then(({ order }) => {
   *   console.log(order.id);
   * })
   */
  requestReturn(
    id: string,
    payload: AdminPostOrdersOrderReturnsReq,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminOrdersRes> {
    const path = `/admin/orders/${id}/return`
    return this.client.request("POST", path, payload, {}, customHeaders)
  }

  /**
   * Cancel an order and change its status. This will also cancel any associated fulfillments and payments, and it may fail if the payment or fulfillment Provider 
   * is unable to cancel the payment/fulfillment.
   * @param {string} id - The order's ID.
   * @param {Record<string, any>} customHeaders - Custom headers to attach to the request.
   * @returns {ResponsePromise<AdminOrdersRes>} Resolves to the order's details.
   * 
   * @example
   * import Medusa from "@medusajs/medusa-js"
   * const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
   * // must be previously logged in or use api token
   * medusa.admin.orders.cancel(orderId)
   * .then(({ order }) => {
   *   console.log(order.id);
   * })
   */
  cancel(
    id: string,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminOrdersRes> {
    const path = `/admin/orders/${id}/cancel`
    return this.client.request("POST", path, undefined, {}, customHeaders)
  }

  /**
   * Add a shipping method to an order. If another shipping method exists with the same shipping profile, the previous shipping method will be replaced.
   * @param {string} id - The order's ID. 
   * @param {AdminPostOrdersOrderShippingMethodsReq} payload - The shipping method to be added.
   * @param {Record<string, any>} customHeaders - Custom headers to attach to the request.
   * @returns {ResponsePromise<AdminOrdersRes>} Resolves to the order's details.
   * 
   * @example
   * import Medusa from "@medusajs/medusa-js"
   * const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
   * // must be previously logged in or use api token
   * medusa.admin.orders.addShippingMethod(orderId, {
   *   price: 1000,
   *   option_id
   * })
   * .then(({ order }) => {
   *   console.log(order.id);
   * })
   */
  addShippingMethod(
    id: string,
    payload: AdminPostOrdersOrderShippingMethodsReq,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminOrdersRes> {
    const path = `/admin/orders/${id}/shipping-methods`
    return this.client.request("POST", path, payload, {}, customHeaders)
  }

  /**
   * Archive an order and change its status.
   * @param {string} id - The order's ID.
   * @param {Record<string, any>} customHeaders - Custom headers to attach to the request.
   * @returns {ResponsePromise<AdminOrdersRes>} Resolves to the order's details.
   * 
   * @example
   * import Medusa from "@medusajs/medusa-js"
   * const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
   * // must be previously logged in or use api token
   * medusa.admin.orders.archive(orderId)
   * .then(({ order }) => {
   *   console.log(order.id);
   * })
   */
  archive(
    id: string,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminOrdersRes> {
    const path = `/admin/orders/${id}/archive`
    return this.client.request("POST", path, undefined, {}, customHeaders)
  }

  /**
   * Create a swap for an order. This includes creating a return that is associated with the swap.
   * @param {string} id - The order's ID.
   * @param {AdminPostOrdersOrderSwapsReq} payload - The swap to be created.
   * @param {Record<string, any>} customHeaders - Custom headers to attach to the request.
   * @returns {ResponsePromise<AdminOrdersRes>} Resolves to the order's details. You can access the swap under the `swaps` property.
   * 
   * @example
   * import Medusa from "@medusajs/medusa-js"
   * const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
   * // must be previously logged in or use api token
   * medusa.admin.orders.createSwap(orderId, {
   *   return_items: [
   *     {
   *       item_id,
   *       quantity: 1
   *     }
   *   ]
   * })
   * .then(({ order }) => {
   *   console.log(order.id);
   * })
   */
  createSwap(
    id: string,
    payload: AdminPostOrdersOrderSwapsReq,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminOrdersRes> {
    const path = `/admin/orders/${id}/swaps`
    return this.client.request("POST", path, payload, {}, customHeaders)
  }

  /**
   * Cancel a swap and change its status.
   * @param {string} id - The ID of the order that the swap belongs to.
   * @param {string} swapId - The swap's ID.
   * @param {Record<string, any>} customHeaders - Custom headers to attach to the request.
   * @returns {ResponsePromise<AdminOrdersRes>} Resolves to the order's details. You can access the swap under the `swaps` property.
   * 
   * @example
   * import Medusa from "@medusajs/medusa-js"
   * const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
   * // must be previously logged in or use api token
   * medusa.admin.orders.cancelSwap(orderId, swapId)
   * .then(({ order }) => {
   *   console.log(order.id);
   * })
   */
  cancelSwap(
    id: string,
    swapId: string,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminOrdersRes> {
    const path = `/admin/orders/${id}/swaps/${swapId}/cancel`
    return this.client.request("POST", path, undefined, {}, customHeaders)
  }

  /**
   * Create a Fulfillment for a Swap and change its fulfillment status to `fulfilled`. If it requires any additional actions,
   * its fulfillment status may change to `requires_action`.
   * @param {string} id - The ID of the order that the swap belongs to.
   * @param {string} swapId - The swap's ID.
   * @param {AdminPostOrdersOrderSwapsSwapFulfillmentsReq} payload - The fulfillment to be created.
   * @param {Record<string, any>} customHeaders - Custom headers to attach to the request.
   * @returns {ResponsePromise<AdminOrdersRes>} Resolves to the order's details. You can access the swap under the `swaps` property.
   * 
   * @example
   * import Medusa from "@medusajs/medusa-js"
   * const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
   * // must be previously logged in or use api token
   * medusa.admin.orders.fulfillSwap(orderId, swapId, {
   *   no_notification: true,
   * })
   * .then(({ order }) => {
   *   console.log(order.id);
   * })
   */
  fulfillSwap(
    id: string,
    swapId: string,
    payload: AdminPostOrdersOrderSwapsSwapFulfillmentsReq,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminOrdersRes> {
    const path = `/admin/orders/${id}/swaps/${swapId}/fulfillments`
    return this.client.request("POST", path, payload, {}, customHeaders)
  }

  /**
   * Create a shipment for a swap and mark its fulfillment as shipped. This changes the swap's fulfillment status to either `shipped` or `partially_shipped`, depending on
   * whether all the items were shipped.
   * @param {string} id - The ID of the order that the swap belongs to.
   * @param {string} swapId - The swap's ID.
   * @param {AdminPostOrdersOrderSwapsSwapShipmentsReq} payload - The shipment to be created.
   * @param {Record<string, any>} customHeaders - Custom headers to attach to the request.
   * @returns {ResponsePromise<AdminOrdersRes>} Resolves to the order's details. You can access the swap under the `swaps` property.
   * 
   * @example
   * import Medusa from "@medusajs/medusa-js"
   * const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
   * // must be previously logged in or use api token
   * medusa.admin.orders.createSwapShipment(orderId, swapId, {
   *   fulfillment_id
   * })
   * .then(({ order }) => {
   *   console.log(order.id);
   * })
   */
  createSwapShipment(
    id: string,
    swapId: string,
    payload: AdminPostOrdersOrderSwapsSwapShipmentsReq,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminOrdersRes> {
    const path = `/admin/orders/${id}/swaps/${swapId}/shipments`
    return this.client.request("POST", path, payload, {}, customHeaders)
  }

  /**
   * Process a swap's payment either by refunding or issuing a payment. This depends on the `difference_due` of the swap. If `difference_due` is negative, the amount is refunded.
   * If `difference_due` is positive, the amount is captured.
   * @param {string} id - The ID of the order that the swap belongs to.
   * @param {string} swapId - The swap's ID.
   * @param {Record<string, any>} customHeaders - Custom headers to attach to the request.
   * @returns {ResponsePromise<AdminOrdersRes>} Resolves to the order's details. You can access the swap under the `swaps` property.
   * 
   * @example
   * import Medusa from "@medusajs/medusa-js"
   * const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
   * // must be previously logged in or use api token
   * medusa.admin.orders.processSwapPayment(orderId, swapId)
   * .then(({ order }) => {
   *   console.log(order.id);
   * })
   */
  processSwapPayment(
    id: string,
    swapId: string,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminOrdersRes> {
    const path = `/admin/orders/${id}/swaps/${swapId}/process-payment`
    return this.client.request("POST", path, undefined, {}, customHeaders)
  }

  /**
   * Create a claim for an order. If a return shipping method is specified, a return will also be created and associated with the claim. If the claim's type is `refund`,
   * the refund is processed as well.
   * @param {string} id - The order's ID.
   * @param {AdminPostOrdersOrderClaimsReq} payload - The claim to be created.
   * @param {Record<string, any>} customHeaders - Custom headers to attach to the request.
   * @returns {ResponsePromise<AdminOrdersRes>} Resolves to the order's details. You can access the swap under the `claims` property.
   * 
   * @example
   * import Medusa from "@medusajs/medusa-js"
   * const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
   * // must be previously logged in or use api token
   * medusa.admin.orders.createClaim(orderId, {
   *   type: 'refund',
   *   claim_items: [
   *     {
   *       item_id,
   *       quantity: 1
   *     }
   *   ]
   * })
   * .then(({ order }) => {
   *   console.log(order.id);
   * })
   */
  createClaim(
    id: string,
    payload: AdminPostOrdersOrderClaimsReq,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminOrdersRes> {
    const path = `/admin/orders/${id}/claims`
    return this.client.request("POST", path, payload, {}, customHeaders)
  }

  /**
   * Cancel a claim and change its status. A claim can't be canceled if it has a refund, if its fulfillments haven't been canceled, of if its associated return hasn't been canceled.
   * @param {string} id - The ID of the order that the claim belongs to.
   * @param {string} claimId - The claim's ID. 
   * @param {Record<string, any>} customHeaders - Custom headers to attach to the request.
   * @returns {ResponsePromise<AdminOrdersRes>} Resolves to the order's details. You can access the swap under the `claims` property.
   * 
   * @example
   * import Medusa from "@medusajs/medusa-js"
   * const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
   * // must be previously logged in or use api token
   * medusa.admin.orders.cancelClaim(orderId, claimId)
   * .then(({ order }) => {
   *   console.log(order.id);
   * })
   */
  cancelClaim(
    id: string,
    claimId: string,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminOrdersRes> {
    const path = `/admin/orders/${id}/claims/${claimId}/cancel`
    return this.client.request("POST", path, undefined, {}, customHeaders)
  }

  /**
   * Update a claim's details.
   * @param {string} id - The ID of the order that the claim belongs to.
   * @param {string} claimId - The claim's ID.
   * @param {AdminPostOrdersOrderClaimsClaimReq} payload - The attributes to update in the claim.
   * @param {Record<string, any>} customHeaders - Custom headers to attach to the request.
   * @returns {ResponsePromise<AdminOrdersRes>} Resolves to the order's details. You can access the swap under the `claims` property.
   * 
   * @example
   * import Medusa from "@medusajs/medusa-js"
   * const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
   * // must be previously logged in or use api token
   * medusa.admin.orders.updateClaim(orderId, claimId, {
   *   no_notification: true
   * })
   * .then(({ order }) => {
   *   console.log(order.id);
   * })
   */
  updateClaim(
    id: string,
    claimId: string,
    payload: AdminPostOrdersOrderClaimsClaimReq,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminOrdersRes> {
    const path = `/admin/orders/${id}/claims/${claimId}`
    return this.client.request("POST", path, payload, {}, customHeaders)
  }

  /**
   * Create a Fulfillment for a Claim, and change its fulfillment status to `partially_fulfilled` or `fulfilled` depending on whether all the items were fulfilled.
   * It may also change the status to `requires_action` if any actions are required.
   * @param {string} id - The ID of the order that the claim belongs to.
   * @param {string} claimId - The claim's ID.
   * @param {AdminPostOrdersOrderClaimsClaimFulfillmentsReq} payload - The fulfillment to be created.
   * @param {Record<string, any>} customHeaders - Custom headers to attach to the request.
   * @returns {ResponsePromise<AdminOrdersRes>} Resolves to the order's details. You can access the swap under the `claims` property.
   * 
   * @example
   * import Medusa from "@medusajs/medusa-js"
   * const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
   * // must be previously logged in or use api token
   * medusa.admin.orders.fulfillClaim(orderId, claimId, {
   * })
   * .then(({ order }) => {
   *   console.log(order.id);
   * })
   */
  fulfillClaim(
    id: string,
    claimId: string,
    payload: AdminPostOrdersOrderClaimsClaimFulfillmentsReq,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminOrdersRes> {
    const path = `/admin/orders/${id}/claims/${claimId}/fulfillments`
    return this.client.request("POST", path, payload, {}, customHeaders)
  }

  /**
   * Create a shipment for the claim and mark its fulfillment as shipped. If the shipment is created successfully, this changes the claim's fulfillment status
   * to either `partially_shipped` or `shipped`, depending on whether all the items were shipped.
   * @param {string} id - The ID of the order that the claim belongs to.
   * @param {string} claimId - The claim's ID.
   * @param {AdminPostOrdersOrderClaimsClaimShipmentsReq} payload - The shipment to create.
   * @param {Record<string, any>} customHeaders - Custom headers to attach to the request.
   * @returns {ResponsePromise<AdminOrdersRes>} Resolves to the order's details. You can access the swap under the `claims` property.
   * 
   * @example
   * import Medusa from "@medusajs/medusa-js"
   * const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
   * // must be previously logged in or use api token
   * medusa.admin.orders.createClaimShipment(orderId, claimId, {
   *   fulfillment_id
   * })
   * .then(({ order }) => {
   *   console.log(order.id);
   * })
   */
  createClaimShipment(
    id: string,
    claimId: string,
    payload: AdminPostOrdersOrderClaimsClaimShipmentsReq,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminOrdersRes> {
    const path = `/admin/orders/${id}/claims/${claimId}/shipments`
    return this.client.request("POST", path, payload, {}, customHeaders)
  }
}

export default AdminOrdersResource
