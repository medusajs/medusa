import {
  StoreCartsRes,
  StorePostCartsCartLineItemsItemReq,
  StorePostCartsCartLineItemsReq,
} from "@medusajs/medusa"
import { ResponsePromise } from "../typings"
import BaseResource from "./base"

class LineItemsResource extends BaseResource {
  /**
   * Creates a line-item for a cart
   * @param {string} cart_id id of cart
   * @param {StorePostCartsCartLineItemsReq} payload details needed to create a line-item
   * @param customHeaders
   * @return {ResponsePromise<StoreCartsRes>}
   */
  create(
    cart_id: string,
    payload: StorePostCartsCartLineItemsReq,
    customHeaders: Record<string, any> = {}): ResponsePromise<StoreCartsRes> {
    const path = `/store/carts/${cart_id}/line-items`
    return this.client.request("POST", path, payload, {}, customHeaders)
  }

  /**
   * Updates a line-item.
   * Only quantity updates are allowed
   * @param {string} cart_id id of cart
   * @param {string} line_id id of item to update
   * @param {StorePostCartsCartLineItemsItemReq} payload details needed to update a line-item
   * @param customHeaders
   * @return {ResponsePromise<StoreCartsRes>}
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
   * Remove a line-item from a cart
   * @param {string} cart_id id of cart
   * @param {string} line_id id of item to remove
   * @param customHeaders
   * @return {ResponsePromise<StoreCartsRes>}
   */
  delete(cart_id: string, line_id: string, customHeaders: Record<string, any> = {}): ResponsePromise<StoreCartsRes> {
    const path = `/store/carts/${cart_id}/line-items/${line_id}`
    return this.client.request("DELETE", path, undefined, {}, customHeaders)
  }
}

export default LineItemsResource
