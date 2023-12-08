import {
  StoreCartsRes,
  StorePostCartsCartLineItemsItemReq,
  StorePostCartsCartLineItemsReq,
} from "@medusajs/medusa"
import { ResponsePromise } from "../typings"
import BaseResource from "./base"

/**
 * This class is used to send requests to Line Item API Routes part of the [Store Cart API Routes](https://docs.medusajs.com/api/store#carts). All its method
 * are available in the JS Client under the `medusa.carts.lineItems` property.
 */
class LineItemsResource extends BaseResource {
  /**
   * Generates a Line Item with a given Product Variant and adds it to the Cart
   * @param {string} cart_id - The cart's ID.
   * @param {StorePostCartsCartLineItemsReq} payload - The line item to be created.
   * @param {Record<string, any>} customHeaders - Custom headers to attach to the request.
   * @returns {ResponsePromise<StoreCartsRes>} Resolves to the associated cart's details.
   * 
   * @example
   * import Medusa from "@medusajs/medusa-js"
   * const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
   * medusa.carts.lineItems.create(cart_id, {
   *   variant_id,
   *   quantity: 1
   * })
   * .then(({ cart }) => {
   *   console.log(cart.id);
   * })
   */
  create(
    cart_id: string,
    payload: StorePostCartsCartLineItemsReq,
    customHeaders: Record<string, any> = {}): ResponsePromise<StoreCartsRes> {
    const path = `/store/carts/${cart_id}/line-items`
    return this.client.request("POST", path, payload, {}, customHeaders)
  }

  /**
   * Update a line item's data.
   * @param {string} cart_id - The ID of the line item's cart.
   * @param {string} line_id - The ID of the line item to update.
   * @param {StorePostCartsCartLineItemsItemReq} payload - The data to update in the line item.
   * @param {Record<string, any>} customHeaders - Custom headers to attach to the request.
   * @returns {ResponsePromise<StoreCartsRes>} Resolves to the associated cart's details.
   * 
   * @example
   * import Medusa from "@medusajs/medusa-js"
   * const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
   * medusa.carts.lineItems.update(cartId, lineId, {
   *   quantity: 1
   * })
   * .then(({ cart }) => {
   *   console.log(cart.id);
   * })
   */
  update(
    cart_id: string,
    line_id: string,
    payload: StorePostCartsCartLineItemsItemReq,
    customHeaders: Record<string, any> = {}): ResponsePromise<StoreCartsRes> {
    const path = `/store/carts/${cart_id}/line-items/${line_id}`
    return this.client.request("POST", path, payload, {}, customHeaders)
  }

  /**
   * Delete a line item from a cart. The payment sessions will be updated and the totals will be recalculated.
   * @param {string} cart_id - The ID of the line item's cart.
   * @param {string} line_id - The ID of the line item to delete.
   * @param {Record<string, any>} customHeaders - Custom headers to attach to the request.
   * @returns {ResponsePromise<StoreCartsRes>} Resolves to the associated cart's details.
   * 
   * @example
   * import Medusa from "@medusajs/medusa-js"
   * const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
   * medusa.carts.lineItems.delete(cartId, lineId)
   * .then(({ cart }) => {
   *   console.log(cart.id);
   * })
   */
  delete(cart_id: string, line_id: string, customHeaders: Record<string, any> = {}): ResponsePromise<StoreCartsRes> {
    const path = `/store/carts/${cart_id}/line-items/${line_id}`
    return this.client.request("DELETE", path, undefined, {}, customHeaders)
  }
}

export default LineItemsResource
