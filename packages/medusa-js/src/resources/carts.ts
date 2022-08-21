import {
  StoreCartsRes,
  StoreCompleteCartRes,
  StorePostCartReq,
  StorePostCartsCartPaymentSessionReq,
  StorePostCartsCartPaymentSessionUpdateReq,
  StorePostCartsCartReq,
  StorePostCartsCartShippingMethodReq,
} from "@medusajs/medusa"
import { ResponsePromise } from "../typings"
import BaseResource from "./base"
import LineItemsResource from "./line-items"

class CartsResource extends BaseResource {
  public lineItems = new LineItemsResource(this.client)

  /**
   * Adds a shipping method to cart
   * @param {string} cart_id Id of cart
   * @param {StorePostCartsCartShippingMethodReq} payload Containg id of shipping option and optional data
   * @param customHeaders
   * @return {ResponsePromise<StoreCartsRes>}
   */
  addShippingMethod(
    cart_id: string,
    payload: StorePostCartsCartShippingMethodReq,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<StoreCartsRes> {
    const path = `/store/carts/${cart_id}/shipping-methods`
    return this.client.request("POST", path, payload, {}, customHeaders)
  }

  /**
   * Completes a cart.
   * Payment authorization is attempted and if more work is required, we simply return the cart for further updates.
   * If payment is authorized and order is not yet created, we make sure to do so.
   * The completion of a cart can be performed idempotently with a provided header Idempotency-Key.
   * If not provuided, we will generate one for the request.
   * @param {string} cart_id is required
   * @param customHeaders
   * @return {ResponsePromise<StoreCompleteCartRes>}
   */
  complete(
    cart_id: string,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<StoreCompleteCartRes> {
    const path = `/store/carts/${cart_id}/complete`
    return this.client.request("POST", path, undefined, {}, customHeaders)
  }

  /**
   * Creates a cart
   * @param {StorePostCartReq} payload is optional and can contain a region_id and items.
   * The cart will contain the payload, if provided. Otherwise it will be empty
   * @param customHeaders
   * @return {ResponsePromise<StoreCartsRes>}
   */
  create(
    payload?: StorePostCartReq,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<StoreCartsRes> {
    const path = `/store/carts`
    return this.client.request("POST", path, payload, {}, customHeaders)
  }

  /**
   * Creates payment sessions.
   * Initializes the payment sessions that can be used to pay for the items of the cart.
   * This is usually called when a customer proceeds to checkout.
   * @param {string} cart_id is required
   * @param customHeaders
   * @return {ResponsePromise<StoreCartsRes>}
   */
  createPaymentSessions(
    cart_id: string,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<StoreCartsRes> {
    const path = `/store/carts/${cart_id}/payment-sessions`
    return this.client.request("POST", path, undefined, {}, customHeaders)
  }

  /**
   * Removes a discount from cart.
   * @param {string} cart_id is required
   * @param {string} code discount code to remove
   * @param customHeaders
   * @return {ResponsePromise<StoreCartsRes>}
   */
  deleteDiscount(
    cart_id: string,
    code: string,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<StoreCartsRes> {
    const path = `/store/carts/${cart_id}/discounts/${code}`
    return this.client.request("DELETE", path, undefined, {}, customHeaders)
  }

  /**
   * Removes a payment session from a cart.
   * Can be useful in case a payment has failed
   * @param {string} cart_id is required
   * @param {string} provider_id the provider id of the session e.g. "stripe"
   * @param customHeaders
   * @return {ResponsePromise<StoreCartsRes>}
   */
  deletePaymentSession(
    cart_id: string,
    provider_id: string,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<StoreCartsRes> {
    const path = `/store/carts/${cart_id}/payment-sessions/${provider_id}`
    return this.client.request("DELETE", path, undefined, {}, customHeaders)
  }

  /**
   * Refreshes a payment session.
   * @param {string} cart_id is required
   * @param {string} provider_id the provider id of the session e.g. "stripe"
   * @param customHeaders
   * @return {ResponsePromise<StoreCartsRes>}
   */
  refreshPaymentSession(
    cart_id: string,
    provider_id: string,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<StoreCartsRes> {
    const path = `/store/carts/${cart_id}/payment-sessions/${provider_id}/refresh`
    return this.client.request("POST", path, undefined, {}, customHeaders)
  }

  /**
   * Retrieves a cart
   * @param {string} cart_id is required
   * @param customHeaders
   * @return {ResponsePromise<StoreCartsRes>}
   */
  retrieve(
    cart_id: string,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<StoreCartsRes> {
    const path = `/store/carts/${cart_id}`
    return this.client.request("GET", path, undefined, {}, customHeaders)
  }

  /**
   * Refreshes a payment session.
   * @param {string} cart_id is required
   * @param {StorePostCartsCartPaymentSessionReq} payload the provider id of the session e.g. "stripe"
   * @param customHeaders
   * @return {ResponsePromise<StoreCartsRes>}
   */
  setPaymentSession(
    cart_id: string,
    payload: StorePostCartsCartPaymentSessionReq,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<StoreCartsRes> {
    const path = `/store/carts/${cart_id}/payment-session`
    return this.client.request("POST", path, payload, {}, customHeaders)
  }

  /**
   * Updates a cart
   * @param {string} cart_id is required
   * @param {StorePostCartsCartReq} payload is required and can contain region_id, email, billing and shipping address
   * @param customHeaders
   * @return {ResponsePromise<StoreCartsRes>}
   */
  update(
    cart_id: string,
    payload: StorePostCartsCartReq,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<StoreCartsRes> {
    const path = `/store/carts/${cart_id}`
    return this.client.request("POST", path, payload, {}, customHeaders)
  }

  /**
   * Updates the payment method
   * @param {string} cart_id is required
   * @param {string} provider_id is required
   * @param {StorePostCartsCartPaymentSessionUpdateReq} payload is required
   * @param customHeaders
   * @return {ResponsePromise<StoreCartsRes>}
   */
  updatePaymentSession(
    cart_id: string,
    provider_id: string,
    payload: StorePostCartsCartPaymentSessionUpdateReq,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<StoreCartsRes> {
    const path = `/store/carts/${cart_id}/payment-sessions/${provider_id}`
    return this.client.request("POST", path, payload, {}, customHeaders)
  }
}

export default CartsResource
