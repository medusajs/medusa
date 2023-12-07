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

/**
 * This class is used to send requests to [Store Cart API Routes](https://docs.medusajs.com/api/store#carts). All its method
 * are available in the JS Client under the `medusa.carts` property.
 * 
 * A cart is a virtual shopping bag that customers can use to add items they want to purchase.
 * A cart is then used to checkout and place an order.
 * 
 * Related Guide: [How to implement cart functionality in your storefront](https://docs.medusajs.com/modules/carts-and-checkout/storefront/implement-cart).
 */
class CartsResource extends BaseResource {
  /**
   * An instance of {@link LineItemsResource} used to send requests to line-item-related routes part of the [Store Cart API Routes](https://docs.medusajs.com/api/store#carts).
   */
  public lineItems = new LineItemsResource(this.client)

  /**
   * Add a shipping method to the cart. The validation of the `data` field is handled by the fulfillment provider of the chosen shipping option.
   * @param {string} cart_id - The ID of the cart to add the shipping method to.
   * @param {StorePostCartsCartShippingMethodReq} payload - The shipping method to add.
   * @param {Record<string, any>} customHeaders - Custom headers to attach to the request.
   * @returns {ResponsePromise<StoreCartsRes>} Resolves to the cart's details.
   * 
   * @example
   * import Medusa from "@medusajs/medusa-js"
   * const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
   * medusa.carts.addShippingMethod(cartId, {
   *   option_id
   * })
   * .then(({ cart }) => {
   *   console.log(cart.id);
   * })
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
   * Complete a cart and place an order or create a swap, based on the cart's type. This includes attempting to authorize the cart's payment.
   * If authorizing the payment requires more action, the cart will not be completed and the order will not be placed or the swap will not be created.
   * An idempotency key will be generated if none is provided in the header `Idempotency-Key` and added to
   * the response. If an error occurs during cart completion or the request is interrupted for any reason, the cart completion can be retried by passing the idempotency
   * key in the `Idempotency-Key` header.
   * @param {string} cart_id - The ID of the cart to complete.
   * @param {Record<string, any>} customHeaders - Custom headers to attach to the request.
   * @returns {ResponsePromise<StoreCompleteCartRes>} Resolves to the completion details.
   * 
   * @example
   * import Medusa from "@medusajs/medusa-js"
   * const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
   * medusa.carts.complete(cartId)
   * .then(({ cart }) => {
   *   console.log(cart.id);
   * })
   */
  complete(
    cart_id: string,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<StoreCompleteCartRes> {
    const path = `/store/carts/${cart_id}/complete`
    return this.client.request("POST", path, undefined, {}, customHeaders)
  }

  /**
   * Create a Cart. Although optional, specifying the cart's region and sales channel can affect the cart's pricing and
   * the products that can be added to the cart respectively. So, make sure to set those early on and change them if necessary, such as when the customer changes their region.
   * If a customer is logged in, make sure to pass its ID or email within the cart's details so that the cart is attached to the customer.
   * @param {StorePostCartReq} payload - The cart to create.
   * @param {Record<string, any>} customHeaders - Custom headers to attach to the request.
   * @returns {ResponsePromise<StoreCartsRes>} Resolves to the created cart's details.
   * 
   * @example
   * import Medusa from "@medusajs/medusa-js"
   * const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
   * medusa.carts.create()
   * .then(({ cart }) => {
   *   console.log(cart.id);
   * })
   */
  create(
    payload?: StorePostCartReq,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<StoreCartsRes> {
    const path = `/store/carts`
    return this.client.request("POST", path, payload, {}, customHeaders)
  }

  /**
   * Create Payment Sessions for each of the available Payment Providers in the Cart's Region. If there's only one payment session created,
   * it will be selected by default. The creation of the payment session uses the payment provider and may require sending requests to third-party services.
   * @param {string} cart_id - The ID of the cart to create the payment sessions for.
   * @param {Record<string, any>} customHeaders - Custom headers to attach to the request.
   * @returns {ResponsePromise<StoreCartsRes>} Resolves to the cart's details.
   * 
   * @example
   * import Medusa from "@medusajs/medusa-js"
   * const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
   * medusa.carts.createPaymentSessions(cartId)
   * .then(({ cart }) => {
   *   console.log(cart.id);
   * })
   */
  createPaymentSessions(
    cart_id: string,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<StoreCartsRes> {
    const path = `/store/carts/${cart_id}/payment-sessions`
    return this.client.request("POST", path, undefined, {}, customHeaders)
  }

  /**
   * Remove a Discount from a Cart. This only removes the application of the discount, and not completely deletes it. The totals will be re-calculated and the payment sessions
   * will be refreshed after the removal.
   * @param {string} cart_id - the ID of the cart to remove the discount from.
   * @param {string} code - The code of the discount to remove from the cart.
   * @param {Record<string, any>} customHeaders - Custom headers to attach to the request.
   * @returns {ResponsePromise<StoreCartsRes>} Resolves to the cart's details.
   * 
   * @example
   * import Medusa from "@medusajs/medusa-js"
   * const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
   * medusa.carts.deleteDiscount(cartId, code)
   * .then(({ cart }) => {
   *   console.log(cart.id);
   * })
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
   * Delete a Payment Session in a Cart. May be useful if a payment has failed. The totals will be recalculated.
   * @param {string} cart_id - The ID of the cart to delete the payment session from.
   * @param {string} provider_id - The ID of the payment provider that the session is associated with.
   * @param {Record<string, any>} customHeaders - Custom headers to attach to the request.
   * @returns {ResponsePromise<StoreCartsRes>} Resolves to the cart's details.
   * 
   * @example
   * import Medusa from "@medusajs/medusa-js"
   * const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
   * medusa.carts.deletePaymentSession(cartId, "manual")
   * .then(({ cart }) => {
   *   console.log(cart.id);
   * })
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
   * Refresh a Payment Session to ensure that it is in sync with the Cart. This is usually not necessary, but is provided for edge cases.
   * @param {string} cart_id - The ID of the cart to refresh its payment session.
   * @param {string} provider_id - The ID of the payment provider that's associated with the payment session.
   * @param {Record<string, any>} customHeaders - Custom headers to attach to the request.
   * @returns {ResponsePromise<StoreCartsRes>} Resolves to the cart's details.
   * 
   * @example
   * import Medusa from "@medusajs/medusa-js"
   * const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
   * medusa.carts.refreshPaymentSession(cartId, "manual")
   * .then(({ cart }) => {
   *   console.log(cart.id);
   * })
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
   * Retrieve a Cart's details. This includes recalculating its totals.
   * @param {string} cart_id - The cart's ID.
   * @param {Record<string, any>} customHeaders - Custom headers to attach to the request.
   * @returns {ResponsePromise<StoreCartsRes>} Resolves to the cart's details.
   * 
   * @example
   * import Medusa from "@medusajs/medusa-js"
   * const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
   * medusa.carts.retrieve(cartId)
   * .then(({ cart }) => {
   *   console.log(cart.id);
   * })
   */
  retrieve(
    cart_id: string,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<StoreCartsRes> {
    const path = `/store/carts/${cart_id}`
    return this.client.request("GET", path, undefined, {}, customHeaders)
  }

  /**
   * Select the Payment Session that will be used to complete the cart. This is typically used when the customer chooses their preferred payment method during checkout.
   * The totals of the cart will be recalculated.
   * @param {string} cart_id - The cart's ID.
   * @param {StorePostCartsCartPaymentSessionReq} payload - The associated payment provider.
   * @param {Record<string, any>} customHeaders - Custom headers to attach to the request.
   * @returns {ResponsePromise<StoreCartsRes>} Resolves to the cart's details.
   * 
   * @example
   * import Medusa from "@medusajs/medusa-js"
   * const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
   * medusa.carts.setPaymentSession(cartId, {
   *   provider_id: "manual"
   * })
   * .then(({ cart }) => {
   *   console.log(cart.id);
   * })
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
   * Update a Cart's details. If the cart has payment sessions and the region was not changed, the payment sessions are updated. The cart's totals are also recalculated.
   * @param {string} cart_id - The cart's ID.
   * @param {StorePostCartsCartReq} payload - The attributes to update in the cart.
   * @param {Record<string, any>} customHeaders - Custom headers to attach to the request.
   * @returns {ResponsePromise<StoreCartsRes>} Resolves to the cart's details.
   * 
   * @example
   * import Medusa from "@medusajs/medusa-js"
   * const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
   * medusa.carts.update(cartId, {
   *   email: "user@example.com"
   * })
   * .then(({ cart }) => {
   *   console.log(cart.id);
   * })
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
   * Update a Payment Session with additional data. This can be useful depending on the payment provider used.
   * All payment sessions are updated and cart totals are recalculated afterwards.
   * @param {string} cart_id - The cart's ID.
   * @param {string} provider_id - The ID of the payment provider that the payment session is associated with.
   * @param {StorePostCartsCartPaymentSessionUpdateReq} payload - The attributes to update in the payment session.
   * @param {Record<string, any>} customHeaders - Custom headers to attach to the request.
   * @returns {ResponsePromise<StoreCartsRes>} Resolves to the cart's details.
   * 
   * @example
   * import Medusa from "@medusajs/medusa-js"
   * const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
   * medusa.carts.updatePaymentSession(cartId, "manual", {
   *   data: {
   * 
   *   }
   * })
   * .then(({ cart }) => {
   *   console.log(cart.id);
   * })
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
