import {
  AdminDraftOrdersDeleteRes,
  AdminDraftOrdersListRes,
  AdminDraftOrdersRes,
  AdminGetDraftOrdersParams,
  AdminPostDraftOrdersDraftOrderLineItemsItemReq,
  AdminPostDraftOrdersDraftOrderLineItemsReq,
  AdminPostDraftOrdersDraftOrderRegisterPaymentRes,
  AdminPostDraftOrdersDraftOrderReq,
  AdminPostDraftOrdersReq,
} from "@medusajs/medusa"
import qs from "qs"
import { ResponsePromise } from "../../typings"
import BaseResource from "../base"

/**
 * This class is used to send requests to [Admin Draft Order API Routes](https://docs.medusajs.com/api/admin#draft-orders). All its method
 * are available in the JS Client under the `medusa.admin.draftOrders` property.
 * 
 * All methods in this class require {@link AdminAuthResource.createSession | user authentication}.
 * 
 * A draft order is an order created manually by the admin. It allows admins to create orders without direct involvement from the customer.
 * 
 * Related Guide: [How to manage draft orders](https://docs.medusajs.com/modules/orders/admin/manage-draft-orders).
 */
class AdminDraftOrdersResource extends BaseResource {
  /**
   * Create a Draft Order. A draft order is not transformed into an order until payment is captured.
   * @param {AdminPostDraftOrdersReq} payload - The draft order to create.
   * @param {Record<string, any>} customHeaders - Custom headers to attach to the request.
   * @returns {ResponsePromise<AdminDraftOrdersRes>} Resolves to the draft order's details
   * 
   * @example
   * import Medusa from "@medusajs/medusa-js"
   * const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
   * // must be previously logged in or use api token
   * medusa.admin.draftOrders.create({
   *   email: "user@example.com",
   *   region_id,
   *   items: [
   *     {
   *       quantity: 1
   *     }
   *   ],
   *   shipping_methods: [
   *     {
   *       option_id
   *     }
   *   ],
   * })
   * .then(({ draft_order }) => {
   *   console.log(draft_order.id);
   * })
   */
  create(
    payload: AdminPostDraftOrdersReq,
    customHeaders: Record<string, any> = {}): ResponsePromise<AdminDraftOrdersRes> {
    const path = `/admin/draft-orders`
    return this.client.request("POST", path, payload, {}, customHeaders)
  }

  /**
   * Create a Line Item in the Draft Order.
   * @param {string} id - The ID of the draft order.
   * @param {AdminPostDraftOrdersDraftOrderLineItemsReq} payload - The line item to create.
   * @param {Record<string, any>} customHeaders - Custom headers to attach to the request.
   * @returns {ResponsePromise<AdminDraftOrdersRes>} Resolves to the draft order's details
   * 
   * @example
   * import Medusa from "@medusajs/medusa-js"
   * const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
   * // must be previously logged in or use api token
   * medusa.admin.draftOrders.addLineItem(draftOrderId, {
   *   quantity: 1
   * })
   * .then(({ draft_order }) => {
   *   console.log(draft_order.id);
   * })
   */
  addLineItem(
    id: string,
    payload: AdminPostDraftOrdersDraftOrderLineItemsReq,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminDraftOrdersRes> {
    const path = `/admin/draft-orders/${id}/line-items`
    return this.client.request("POST", path, payload, {}, customHeaders)
  }

  /**
   * Delete a Draft Order
   * @param {string} id - The ID of the draft order.
   * @param {Record<string, any>} customHeaders - Custom headers to attach to the request.
   * @returns {ResponsePromise<AdminDraftOrdersDeleteRes>} Resolves to the deletion operation details.
   * 
   * @example
   * import Medusa from "@medusajs/medusa-js"
   * const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
   * // must be previously logged in or use api token
   * medusa.admin.draftOrders.delete(draftOrderId)
   * .then(({ id, object, deleted }) => {
   *   console.log(id);
   * })
   */
  delete(
    id: string,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminDraftOrdersDeleteRes> {
    const path = `/admin/draft-orders/${id}`
    return this.client.request("DELETE", path, undefined, {}, customHeaders)
  }

  /**
   * Delete a Line Item from a Draft Order.
   * @param {string} id - The ID of the draft order that the line item belongs to.
   * @param {string} itemId - The ID of the line item to delete from the draft order.
   * @param {Record<string, any>} customHeaders - Custom headers to attach to the request.
   * @returns {ResponsePromise<AdminDraftOrdersRes>} Resolves to the draft order's details
   * 
   * @example
   * import Medusa from "@medusajs/medusa-js"
   * const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
   * // must be previously logged in or use api token
   * medusa.admin.draftOrders.removeLineItem(draftOrderId, itemId)
   * .then(({ draft_order }) => {
   *   console.log(draft_order.id);
   * })
   */
  removeLineItem(
    id: string,
    itemId: string,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminDraftOrdersRes> {
    const path = `/admin/draft-orders/${id}/line-items/${itemId}`
    return this.client.request("DELETE", path, undefined, {}, customHeaders)
  }

  /**
   * Retrieve a Draft Order's details.
   * @param {string} id - The ID of the draft order.
   * @param {Record<string, any>} customHeaders - Custom headers to attach to the request.
   * @returns {ResponsePromise<AdminDraftOrdersRes>} Resolves to the draft order's details.
   * 
   * @example
   * import Medusa from "@medusajs/medusa-js"
   * const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
   * // must be previously logged in or use api token
   * medusa.admin.draftOrders.retrieve(draftOrderId)
   * .then(({ draft_order }) => {
   *   console.log(draft_order.id);
   * })
   */
  retrieve(
    id: string,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminDraftOrdersRes> {
    const path = `/admin/draft-orders/${id}`
    return this.client.request("GET", path, undefined, {}, customHeaders)
  }

  /**
   * Retrieve an list of Draft Orders. The draft orders can be filtered by parameters such as `query`. The draft orders can also paginated.
   * @param {AdminGetDraftOrdersParams} query - Filters and pagination configurations to apply on the retrieved draft orders.
   * @param {Record<string, any>} customHeaders - Custom headers to attach to the request.
   * @returns {ResponsePromise<AdminDraftOrdersListRes>} Resolves to the list of draft orders with pagination fields.
   * 
   * @example
   * To list draft orders:
   * 
   * ```ts
   * import Medusa from "@medusajs/medusa-js"
   * const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
   * // must be previously logged in or use api token
   * medusa.admin.draftOrders.list()
   * .then(({ draft_orders, limit, offset, count }) => {
   *   console.log(draft_orders.length);
   * })
   * ```
   * 
   * By default, only the first `50` records are retrieved. You can control pagination by specifying the `limit` and `offset` properties:
   * 
   * ```ts
   * import Medusa from "@medusajs/medusa-js"
   * const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
   * // must be previously logged in or use api token
   * medusa.admin.draftOrders.list({
   *   limit,
   *   offset
   * })
   * .then(({ draft_orders, limit, offset, count }) => {
   *   console.log(draft_orders.length);
   * })
   * ```
   */
  list(
    query?: AdminGetDraftOrdersParams,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminDraftOrdersListRes> {
    let path = `/admin/draft-orders`

    if (query) {
      const queryString = qs.stringify(query)
      path = `/admin/draft-orders?${queryString}`
    }

    return this.client.request("GET", path, undefined, {}, customHeaders)
  }

  /**
   * Capture the draft order's payment. This will also set the draft order's status to `completed` and create an order from the draft order. The payment is captured through Medusa's system payment,
   * which is manual payment that isn't integrated with any third-party payment provider. It is assumed that the payment capturing is handled manually by the admin.
   * @param {string} id - The ID of the draft order.
   * @param {Record<string, any>} customHeaders - Custom headers to attach to the request.
   * @returns {ResponsePromise<AdminPostDraftOrdersDraftOrderRegisterPaymentRes>} Resolves to the created order's details.
   * 
   * @example
   * import Medusa from "@medusajs/medusa-js"
   * const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
   * // must be previously logged in or use api token
   * medusa.admin.draftOrders.markPaid(draftOrderId)
   * .then(({ order }) => {
   *   console.log(order.id);
   * })
   */
  markPaid(
    id: string,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminPostDraftOrdersDraftOrderRegisterPaymentRes> {
    const path = `/admin/draft-orders/${id}/pay`
    return this.client.request("POST", path, {}, customHeaders)
  }

  /**
   * Update a Draft Order's details.
   * @param {string} id - The ID of the draft order.
   * @param {AdminPostDraftOrdersDraftOrderReq} payload - The attributes to update in the draft order.
   * @param {Record<string, any>} customHeaders - Custom headers to attach to the request.
   * @returns {ResponsePromise<AdminDraftOrdersRes>} Resolves to the draft order's details.
   * 
   * @example
   * import Medusa from "@medusajs/medusa-js"
   * const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
   * // must be previously logged in or use api token
   * medusa.admin.draftOrders.update(draftOrderId, {
   *   email: "user@example.com"
   * })
   * .then(({ draft_order }) => {
   *   console.log(draft_order.id);
   * })
   */
  update(
    id: string,
    payload: AdminPostDraftOrdersDraftOrderReq,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminDraftOrdersRes> {
    const path = `/admin/draft-orders/${id}`
    return this.client.request("POST", path, payload, {}, customHeaders)
  }

  /**
   * Update a Line Item in a Draft Order.
   * @param {string} id - The ID of the draft order that the line item belongs to.
   * @param {string} itemId - The ID of the line item to update.
   * @param {AdminPostDraftOrdersDraftOrderLineItemsItemReq} payload - The attributes to update in the line item.
   * @param {Record<string, any>} customHeaders - Custom headers to attach to the request.
   * @returns {ResponsePromise<AdminDraftOrdersRes>} Resolves to the draft order's details.
   * 
   * @example
   * import Medusa from "@medusajs/medusa-js"
   * const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
   * // must be previously logged in or use api token
   * medusa.admin.draftOrders.updateLineItem(draftOrderId, lineId, {
   *   quantity: 1
   * })
   * .then(({ draft_order }) => {
   *   console.log(draft_order.id);
   * })
   */
  updateLineItem(
    id: string,
    itemId: string,
    payload: AdminPostDraftOrdersDraftOrderLineItemsItemReq,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminDraftOrdersRes> {
    const path = `/admin/draft-orders/${id}/line-items/${itemId}`
    return this.client.request("POST", path, payload, {}, customHeaders)
  }
}

export default AdminDraftOrdersResource
