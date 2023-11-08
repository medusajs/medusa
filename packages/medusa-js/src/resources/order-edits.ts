import {
  StoreOrderEditsRes,
  StorePostOrderEditsOrderEditDecline,
} from "@medusajs/medusa"
import { ResponsePromise } from "../typings"
import BaseResource from "./base"

/**
 * This class is used to send requests to [Store Order Edits API Routes](https://docs.medusajs.com/api/store#order-edits). All its method
 * are available in the JS Client under the `medusa.orderEdits` property.
 * 
 * Order edits are changes made to items in an order such as adding, updating their quantity, or deleting them. Order edits are created by the admin.
 * A customer can review order edit requests created by an admin and confirm or decline them.
 * 
 * Related Guide: [How to handle order edits in a storefront](https://docs.medusajs.com/modules/orders/storefront/handle-order-edits).
 */
class OrderEditsResource extends BaseResource {
  /**
   * Retrieve an Order Edit's details.
   * @param {string} id - The ID of the order edit.
   * @param {Record<string, any>} customHeaders - Custom headers to attach to the request.
   * @returns {ResponsePromise<StoreOrderEditsRes>} Resolves to the order edit's details.
   * 
   * @example
   * import Medusa from "@medusajs/medusa-js"
   * const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
   * medusa.orderEdits.retrieve(orderEditId)
   * .then(({ order_edit }) => {
   *   console.log(order_edit.id);
   * })
   */
  retrieve(
    id: string,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<StoreOrderEditsRes> {
    const path = `/store/order-edits/${id}`
    return this.client.request("GET", path, undefined, {}, customHeaders)
  }

  /**
   * Decline an Order Edit. The changes are not reflected on the original order.
   * @param {string} id - The ID of the order edit.
   * @param {StorePostOrderEditsOrderEditDecline} payload - The decline details.
   * @param {Record<string, any>} customHeaders - Custom headers to attach to the request.
   * @returns {ResponsePromise<StoreOrderEditsRes>} Resolves to the order edit's details.
   * 
   * @example
   * import Medusa from "@medusajs/medusa-js"
   * const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
   * medusa.orderEdits.decline(orderEditId)
   * .then(({ order_edit }) => {
   *   console.log(order_edit.id);
   * })
   */
  decline(
    id: string,
    payload: StorePostOrderEditsOrderEditDecline,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<StoreOrderEditsRes> {
    const path = `/store/order-edits/${id}/decline`
    return this.client.request("POST", path, payload, {}, customHeaders)
  }

  /**
   * Complete an Order Edit and reflect its changes on the original order. Any additional payment required must be authorized first using the {@link PaymentCollectionsResource} routes.
   * @param {string} id - The ID of the order edit.
   * @param {Record<string, any>} customHeaders - Custom headers to attach to the request.
   * @returns {ResponsePromise<StoreOrderEditsRes>} Resolves to the order edit's details.
   * 
   * @example
   * import Medusa from "@medusajs/medusa-js"
   * const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
   * medusa.orderEdits.complete(orderEditId)
   * .then(({ order_edit }) => {
   *   console.log(order_edit.id)
   * })
   */
  complete(id: string, customHeaders: Record<string, any> = {}): ResponsePromise<StoreOrderEditsRes> {
    const path = `/store/order-edits/${id}/complete`
    return this.client.request("POST", path, undefined, {}, customHeaders)
  }
}

export default OrderEditsResource
