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
 * This class is used to send requests to [Admin Order API Routes](https://docs.medusajs.com/api/admin#orders).
 * 
 * All methods in this class require {@link auth.createSession | user authentication}.
 */
class AdminOrdersResource extends BaseResource {
  /**
   * Update and order's details.
   * @param {string} id - The ID of the order.
   * @param {AdminPostOrdersOrderReq} payload - The attributes to update in the order.
   * @param {Record<string, any>} customHeaders - Custom headers to attach to the request.
   * @returns {ResponsePromise<AdminOrdersRes>} - The order's details.
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
   * });
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
   * @param {string} id - The ID of the order.
   * @param {FindParams} query - Configurations to apply on the retrieved order.
   * @param {Record<string, any>} customHeaders - Custom headers to attach to the request.
   * @returns {ResponsePromise<AdminOrdersRes>} - The order's details.
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
   * });
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
   * });
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
   * @returns {ResponsePromise<AdminOrdersListRes>} The list of orders with pagination fields.
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
   * });
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
   * });
   * ```
   * 
   * By default, only the first `50` records are retrieved. You can control pagination by specifying the skip and take parameters:
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
   * });
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
   * @param {string} id - The ID of the order.
   * @param {Record<string, any>} customHeaders - Custom headers to attach to the request.
   * @returns {ResponsePromise<AdminOrdersRes>} - The order's details.
   * 
   * @example
   * import Medusa from "@medusajs/medusa-js"
   * const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
   * // must be previously logged in or use api token
   * medusa.admin.orders.complete(orderId)
   * .then(({ order }) => {
   *   console.log(order.id);
   * });
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
   * @returns {ResponsePromise<AdminOrdersRes>} - The order's details.
   * 
   * @example
   * import Medusa from "@medusajs/medusa-js"
   * const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
   * // must be previously logged in or use api token
   * medusa.admin.orders.capturePayment(orderId)
   * .then(({ order }) => {
   *   console.log(order.id);
   * });
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
   * @param {AdminPostOrdersOrderRefundsReq} payload - The details of the refund.
   * @param {Record<string, any>} customHeaders - Custom headers to attach to the request.
   * @returns {ResponsePromise<AdminOrdersRes>} - The order's details.
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
   * });
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
   * Create a fulfillment of an order using the fulfillment provider.
   * @param {string} id - The ID of the order that the fulfillment belongs to.
   * @param {AdminPostOrdersOrderFulfillmentsReq} payload - The details of the fulfillment to be created.
   * @param {Record<string, any>} customHeaders - Custom headers to attach to the request.
   * @returns {ResponsePromise<AdminOrdersRes>} - The order's details.
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
   * });
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
   * Cancel an order's fulfillment and change its status.
   * @param {string} id - The ID of the order that the fulfillment belongs to.
   * @param {string} fulfillmentId - The ID of the fulfillment.
   * @param {Record<string, any>} customHeaders - Custom headers to attach to the request.
   * @returns {ResponsePromise<AdminOrdersRes>} - The order's details.
   * 
   * @example
   * import Medusa from "@medusajs/medusa-js"
   * const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
   * // must be previously logged in or use api token
   * medusa.admin.orders.cancelFulfillment(orderId, fulfillmentId)
   * .then(({ order }) => {
   *   console.log(order.id);
   * });
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
   * Cancel a swap's fulfillment and change its status.
   * @param {string} id - The ID of the order that the swap is associated with.
   * @param {string} swapId - The ID of the swap the fulfillment belongs to.
   * @param {string} fulfillmentId - The ID of the fulfillment. 
   * @param {Record<string, any>} customHeaders - Custom headers to attach to the request.
   * @returns {ResponsePromise<AdminOrdersRes>} - The order's details.
   * 
   * @example
   * import Medusa from "@medusajs/medusa-js"
   * const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
   * // must be previously logged in or use api token
   * medusa.admin.orders.cancelSwapFulfillment(orderId, swapId, fulfillmentId)
   * .then(({ order }) => {
   *   console.log(order.id);
   * });
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
   * Cancel a claim's fulfillment and change its status.
   * @param {string} id - The ID of the order that the claim is associated with.
   * @param {string} claimId - The ID of the claim.
   * @param {string} fulfillmentId - The ID of the fulfillment.
   * @param {Record<string, any>} customHeaders - Custom headers to attach to the request.
   * @returns {ResponsePromise<AdminOrdersRes>} - The order's details.
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

  createShipment(
    id: string,
    payload: AdminPostOrdersOrderShipmentReq,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminOrdersRes> {
    const path = `/admin/orders/${id}/shipment`
    return this.client.request("POST", path, payload, {}, customHeaders)
  }

  requestReturn(
    id: string,
    payload: AdminPostOrdersOrderReturnsReq,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminOrdersRes> {
    const path = `/admin/orders/${id}/return`
    return this.client.request("POST", path, payload, {}, customHeaders)
  }

  cancel(
    id: string,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminOrdersRes> {
    const path = `/admin/orders/${id}/cancel`
    return this.client.request("POST", path, undefined, {}, customHeaders)
  }

  addShippingMethod(
    id: string,
    payload: AdminPostOrdersOrderShippingMethodsReq,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminOrdersRes> {
    const path = `/admin/orders/${id}/shipping-methods`
    return this.client.request("POST", path, payload, {}, customHeaders)
  }

  archive(
    id: string,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminOrdersRes> {
    const path = `/admin/orders/${id}/archive`
    return this.client.request("POST", path, undefined, {}, customHeaders)
  }

  createSwap(
    id: string,
    payload: AdminPostOrdersOrderSwapsReq,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminOrdersRes> {
    const path = `/admin/orders/${id}/swaps`
    return this.client.request("POST", path, payload, {}, customHeaders)
  }

  cancelSwap(
    id: string,
    swapId: string,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminOrdersRes> {
    const path = `/admin/orders/${id}/swaps/${swapId}/cancel`
    return this.client.request("POST", path, undefined, {}, customHeaders)
  }

  fulfillSwap(
    id: string,
    swapId: string,
    payload: AdminPostOrdersOrderSwapsSwapFulfillmentsReq,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminOrdersRes> {
    const path = `/admin/orders/${id}/swaps/${swapId}/fulfillments`
    return this.client.request("POST", path, payload, {}, customHeaders)
  }

  createSwapShipment(
    id: string,
    swapId: string,
    payload: AdminPostOrdersOrderSwapsSwapShipmentsReq,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminOrdersRes> {
    const path = `/admin/orders/${id}/swaps/${swapId}/shipments`
    return this.client.request("POST", path, payload, {}, customHeaders)
  }

  processSwapPayment(
    id: string,
    swapId: string,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminOrdersRes> {
    const path = `/admin/orders/${id}/swaps/${swapId}/process-payment`
    return this.client.request("POST", path, undefined, {}, customHeaders)
  }

  createClaim(
    id: string,
    payload: AdminPostOrdersOrderClaimsReq,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminOrdersRes> {
    const path = `/admin/orders/${id}/claims`
    return this.client.request("POST", path, payload, {}, customHeaders)
  }

  cancelClaim(
    id: string,
    claimId: string,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminOrdersRes> {
    const path = `/admin/orders/${id}/claims/${claimId}/cancel`
    return this.client.request("POST", path, undefined, {}, customHeaders)
  }

  updateClaim(
    id: string,
    claimId: string,
    payload: AdminPostOrdersOrderClaimsClaimReq,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminOrdersRes> {
    const path = `/admin/orders/${id}/claims/${claimId}`
    return this.client.request("POST", path, payload, {}, customHeaders)
  }

  fulfillClaim(
    id: string,
    claimId: string,
    payload: AdminPostOrdersOrderClaimsClaimFulfillmentsReq,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminOrdersRes> {
    const path = `/admin/orders/${id}/claims/${claimId}/fulfillments`
    return this.client.request("POST", path, payload, {}, customHeaders)
  }

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
