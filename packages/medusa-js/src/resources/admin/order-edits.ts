import {
  AdminOrderEditDeleteRes,
  AdminOrderEditItemChangeDeleteRes,
  AdminOrderEditsListRes,
  AdminOrderEditsRes,
  AdminPostOrderEditsEditLineItemsLineItemReq,
  AdminPostOrderEditsEditLineItemsReq,
  AdminPostOrderEditsOrderEditReq,
  AdminPostOrderEditsReq,
  GetOrderEditsOrderEditParams,
  GetOrderEditsParams,
} from "@medusajs/medusa"
import { ResponsePromise } from "../../typings"
import BaseResource from "../base"
import qs from "qs"

/**
 * This class is used to send requests to [Admin Order Edit API Routes](https://docs.medusajs.com/api/admin#order-edits). All its method
 * are available in the JS Client under the `medusa.admin.orderEdits` property.
 * 
 * All methods in this class require {@link AdminAuthResource.createSession | user authentication}.
 * 
 * An admin can edit an order to remove, add, or update an item's quantity. When an admin edits an order, they're stored as an `OrderEdit`.
 * 
 * Related Guide: [How to edit an order](https://docs.medusajs.com/modules/orders/admin/edit-order).
 */
class AdminOrderEditsResource extends BaseResource {
  /**
   * Retrieve an order edit's details.
   * @param {string} id - The ID of the order edit.
   * @param {GetOrderEditsOrderEditParams} query - Configurations to apply on the retrieved order edit.
   * @param {Record<string, any>} customHeaders - Custom headers to attach to the request.
   * @returns {ResponsePromise<AdminOrderEditsRes>} Resolves to the order edit's details.
   * 
   * @example
   * A simple example that retrieves an order edit by its ID:
   * 
   * ```ts
   * import Medusa from "@medusajs/medusa-js"
   * const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
   * // must be previously logged in or use api token
   * medusa.admin.orderEdits.retrieve(orderEditId)
   * .then(({ order_edit }) => {
   *   console.log(order_edit.id)
   * })
   * ```
   * 
   * To specify relations that should be retrieved:
   * 
   * ```ts
   * import Medusa from "@medusajs/medusa-js"
   * const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
   * // must be previously logged in or use api token
   * medusa.admin.orderEdits.retrieve(orderEditId, {
   *   expand: "order"
   * })
   * .then(({ order_edit }) => {
   *   console.log(order_edit.id)
   * })
   * ```
   */
  retrieve(
    id: string,
    query?: GetOrderEditsOrderEditParams,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminOrderEditsRes> {
    let path = `/admin/order-edits/${id}`

    if (query) {
      const queryString = qs.stringify(query)
      path += `?${queryString}`
    }

    return this.client.request("GET", path, undefined, {}, customHeaders)
  }

  /**
   * Retrieve a list of order edits. The order edits can be filtered by fields such as `q` or `order_id` passed to the `query` parameter. The order edits can also be paginated.
   * @param {GetOrderEditsParams} query - Filters and pagination configurations applied to retrieved order edits.
   * @param {Record<string, any>} customHeaders - Custom headers to attach to the request.
   * @returns {ResponsePromise<AdminOrderEditsListRes>} Resolves to the list of order edits with pagination fields.
   * 
   * @example
   * To list order edits:
   * 
   * ```ts
   * import Medusa from "@medusajs/medusa-js"
   * const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
   * // must be previously logged in or use api token
   * medusa.admin.orderEdits.list()
   * .then(({ order_edits, count, limit, offset }) => {
   *   console.log(order_edits.length)
   * })
   * ```
   * 
   * To specify relations that should be retrieved within the order edits:
   * 
   * ```ts
   * import Medusa from "@medusajs/medusa-js"
   * const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
   * // must be previously logged in or use api token
   * medusa.admin.orderEdits.list({
   *   expand: "order"
   * })
   * .then(({ order_edits, count, limit, offset }) => {
   *   console.log(order_edits.length)
   * })
   * ```
   * 
   * By default, only the first `50` records are retrieved. You can control pagination by specifying the `limit` and `offset` properties:
   * 
   * ```ts
   * import Medusa from "@medusajs/medusa-js"
   * const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
   * // must be previously logged in or use api token
   * medusa.admin.orderEdits.list({
   *   expand: "order",
   *   limit,
   *   offset
   * })
   * .then(({ order_edits, count, limit, offset }) => {
   *   console.log(order_edits.length)
   * })
   * ```
   */
  list(
    query?: GetOrderEditsParams,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminOrderEditsListRes> {
    let path = `/admin/order-edits`

    if (query) {
      const queryString = qs.stringify(query)
      path += `?${queryString}`
    }

    return this.client.request("GET", path, undefined, {}, customHeaders)
  }

  /**
   * Create an order edit.
   * @param {AdminPostOrderEditsReq} payload - The order edit to create.
   * @param {Record<string, any>} customHeaders - Custom headers to attach to the request.
   * @returns {ResponsePromise<AdminOrderEditsRes>} Resolves to the order edit's details.
   * 
   * @example
   * import Medusa from "@medusajs/medusa-js"
   * const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
   * // must be previously logged in or use api token
   * medusa.admin.orderEdits.create({ orderId })
   * .then(({ order_edit }) => {
   *   console.log(order_edit.id)
   * })
   */
  create(
    payload: AdminPostOrderEditsReq,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminOrderEditsRes> {
    const path = `/admin/order-edits`
    return this.client.request("POST", path, payload, {}, customHeaders)
  }

  /**
   * Update an Order Edit's details.
   * @param {string} id - The ID of the order edit.
   * @param {AdminPostOrderEditsOrderEditReq} payload - The attributes to update in an order edit.
   * @param {Record<string, any>} customHeaders - Custom headers to attach to the request.
   * @returns {ResponsePromise<AdminOrderEditsRes>} Resolves to the order edit's details.
   * 
   * @example
   * import Medusa from "@medusajs/medusa-js"
   * const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
   * // must be previously logged in or use api token
   * medusa.admin.orderEdits.update(orderEditId, {
   *   internal_note: "internal reason XY"
   * })
   * .then(({ order_edit }) => {
   *   console.log(order_edit.id)
   * })
   */
  update(
    id: string,
    payload: AdminPostOrderEditsOrderEditReq,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminOrderEditsRes> {
    const path = `/admin/order-edits/${id}`
    return this.client.request("POST", path, payload, {}, customHeaders)
  }

  /**
   * Delete an order edit. Only order edits that have the status `created` can be deleted.
   * @param {string} id - The ID of the order edit.
   * @param {Record<string, any>} customHeaders - Custom headers to attach to the request.
   * @returns {ResponsePromise<AdminOrderEditDeleteRes>} Resolves to the deletion operation's details.
   * 
   * @example
   * import Medusa from "@medusajs/medusa-js"
   * const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
   * // must be previously logged in or use api token
   * medusa.admin.orderEdits.delete(orderEditId)
   * .then(({ id, object, deleted }) => {
   *   console.log(id)
   * })
   */
  delete(
    id: string,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminOrderEditDeleteRes> {
    const path = `/admin/order-edits/${id}`
    return this.client.request("DELETE", path, undefined, {}, customHeaders)
  }

  /**
   * Create a line item change in the order edit that indicates adding an item in the original order. The item will not be added to the original order until the order edit is
   * confirmed.
   * @param {string} id - The ID of the order edit to add the line item change to.
   * @param {AdminPostOrderEditsEditLineItemsReq} payload - The line item change to be created.
   * @param {Record<string, any>} customHeaders - Custom headers to attach to the request.
   * @returns {ResponsePromise<AdminOrderEditsRes>} Resolves to the order edit's details.
   * 
   * @example
   * import Medusa from "@medusajs/medusa-js"
   * const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
   * // must be previously logged in or use api token
   * medusa.admin.orderEdits.addLineItem(orderEditId, {
   *   variant_id,
   *   quantity
   * })
   * .then(({ order_edit }) => {
   *    console.log(order_edit.id)
   * })
   */
  addLineItem(
    id: string,
    payload: AdminPostOrderEditsEditLineItemsReq,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminOrderEditsRes> {
    const path = `/admin/order-edits/${id}/items`
    return this.client.request("POST", path, payload, {}, customHeaders)
  }

  /**
   * Delete a line item change that indicates the addition, deletion, or update of a line item in the original order.
   * @param {string} orderEditId - The ID of the order edit.
   * @param {string} itemChangeId - The ID of the line item change.
   * @param {Record<string, any>} customHeaders - Custom headers to attach to the request.
   * @returns {ResponsePromise<AdminOrderEditItemChangeDeleteRes>} Resolves to the deletion operation's details.
   * 
   * @example
   * import Medusa from "@medusajs/medusa-js"
   * const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
   * // must be previously logged in or use api token
   * medusa.admin.orderEdits.deleteItemChange(orderEdit_id, itemChangeId)
   * .then(({ id, object, deleted }) => {
   *   console.log(id)
   * })
   */
  deleteItemChange(
    orderEditId: string,
    itemChangeId: string,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminOrderEditItemChangeDeleteRes> {
    const path = `/admin/order-edits/${orderEditId}/changes/${itemChangeId}`
    return this.client.request("DELETE", path, undefined, {}, customHeaders)
  }

  /**
   * Request customer confirmation of an order edit. This would emit the event `order-edit.requested` which Notification Providers listen to and send
   * a notification to the customer about the order edit.
   * @param {string} id - The ID of the order edit.
   * @param {Record<string, any>} customHeaders - Custom headers to attach to the request.
   * @returns {ResponsePromise<AdminOrderEditsRes>} Resolves to the order edit's details.
   * 
   * @example
   * import Medusa from "@medusajs/medusa-js"
   * const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
   * // must be previously logged in or use api token
   * medusa.admin.orderEdits.requestConfirmation(orderEditId)
   * .then({ order_edit }) => {
   *   console.log(order_edit.id)
   * })
   */
  requestConfirmation(
    id: string,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminOrderEditsRes> {
    const path = `/admin/order-edits/${id}/request`
    return this.client.request("POST", path, undefined, {}, customHeaders)
  }

  /**
   * Cancel an order edit.
   * @param {string} id - The ID of the order edit to cancel.
   * @param {Record<string, any>} customHeaders - Custom headers to attach to the request.
   * @returns {ResponsePromise<AdminOrderEditsRes>} Resolves to the order edit's details.
   * 
   * @example
   * import Medusa from "@medusajs/medusa-js"
   * const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
   * // must be previously logged in or use api token
   * medusa.admin.orderEdits.cancel(orderEditId)
   * .then(({ order_edit }) => {
   *   console.log(order_edit.id)
   * })
   */
  cancel(
    id: string,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminOrderEditsRes> {
    const path = `/admin/order-edits/${id}/cancel`
    return this.client.request("POST", path, undefined, {}, customHeaders)
  }

  /**
   * Confirm an order edit. This will reflect the changes in the order edit on the associated order.
   * @param {string} id - The ID of the order edit to confirm.
   * @param {Record<string, any>} customHeaders - Custom headers to attach to the request.
   * @returns {ResponsePromise<AdminOrderEditsRes>} Resolves to the order edit's details.
   * 
   * @example
   * import Medusa from "@medusajs/medusa-js"
   * const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
   * // must be previously logged in or use api token
   * medusa.admin.orderEdits.confirm(orderEditId)
   * .then(({ order_edit }) => {
   *   console.log(order_edit.id)
   * })
   */
  confirm(
    id: string,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminOrderEditsRes> {
    const path = `/admin/order-edits/${id}/confirm`
    return this.client.request("POST", path, undefined, {}, customHeaders)
  }

  /**
   * Create or update a line item change in the order edit that indicates addition, deletion, or update of a line item into an original order. Line item changes
   * are only reflected on the original order after the order edit is confirmed.
   * @param {string} orderEditId - The ID of the order edit that the line item belongs to.
   * @param {string} itemId - The ID of the line item to create or update its line item change.
   * @param {AdminPostOrderEditsEditLineItemsLineItemReq} payload - The creation or update of the line item change.
   * @param {Record<string, any>} customHeaders - Custom headers to attach to the request.
   * @returns {ResponsePromise<AdminOrderEditsRes>} Resolves to the order edit's details.
   * 
   * @example
   * import Medusa from "@medusajs/medusa-js"
   * const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
   * // must be previously logged in or use api token
   * medusa.admin.orderEdits.updateLineItem(orderEditId, lineItemId, {
   *   quantity: 5
   * })
   * .then(({ order_edit }) => {
   *   console.log(order_edit.id)
   * })
   */
  updateLineItem(
    orderEditId: string,
    itemId: string,
    payload: AdminPostOrderEditsEditLineItemsLineItemReq,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminOrderEditsRes> {
    const path = `/admin/order-edits/${orderEditId}/items/${itemId}`
    return this.client.request("POST", path, payload, {}, customHeaders)
  }

  /**
   * Create a line item change in the order edit that indicates deleting an item in the original order. The item in the original order will not be deleted until the order edit is
   * confirmed.
   * @param {string} orderEditId - The ID of the order edit that the line item change belongs to. 
   * @param {string} itemId - The ID of the line item.
   * @param {Record<string, any>} customHeaders - Custom headers to attach to the request.
   * @returns {ResponsePromise<AdminOrderEditsRes>} Resolves to the order edit's details.
   * 
   * @example
   * import Medusa from "@medusajs/medusa-js"
   * const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
   * // must be previously logged in or use api token
   * medusa.admin.orderEdits.removeLineItem(orderEditId, lineItemId)
   * .then(({ order_edit }) => {
   *   console.log(order_edit.id)
   * })
   */
  removeLineItem(
    orderEditId: string,
    itemId: string,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminOrderEditsRes> {
    const path = `/admin/order-edits/${orderEditId}/items/${itemId}`
    return this.client.request("DELETE", path, undefined, {}, customHeaders)
  }
}

export default AdminOrderEditsResource
