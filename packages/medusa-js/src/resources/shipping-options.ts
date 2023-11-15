import {
  StoreGetShippingOptionsParams,
  StoreShippingOptionsListRes,
} from "@medusajs/medusa"
import qs from "qs"
import { ResponsePromise } from "../typings"
import BaseResource from "./base"

/**
 * This class is used to send requests to [Store Shipping Option API Routes](https://docs.medusajs.com/api/store#shipping-options). All its method
 * are available in the JS Client under the `medusa.shippingOptions` property.
 * 
 * A shipping option is used to define the available shipping methods during checkout or when creating a return.
 * 
 * Related Guide: [Shipping Option architecture](https://docs.medusajs.com/modules/carts-and-checkout/shipping#shipping-option).
 */
class ShippingOptionsResource extends BaseResource {
  /**
   * Retrieve a list of shipping options available for a cart.
   * @param {string} cart_id - The cart's ID.
   * @param {Record<string, any>} customHeaders - Custom headers to attach to the request.
   * @returns {ResponsePromise<StoreShippingOptionsListRes>} Resolves to the list of shipping options.
   * 
   * @example
   * import Medusa from "@medusajs/medusa-js"
   * const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
   * medusa.shippingOptions.listCartOptions(cartId)
   * .then(({ shipping_options }) => {
   *   console.log(shipping_options.length);
   * })
   */
  listCartOptions(cart_id: string, customHeaders: Record<string, any> = {}): ResponsePromise<StoreShippingOptionsListRes> {
    const path = `/store/shipping-options/${cart_id}`
    return this.client.request("GET", path, undefined, {}, customHeaders)
  }

  /**
   * Retrieve a list of shipping options. The shipping options can be filtered using the `query` parameter.
   * @param {StoreGetShippingOptionsParams} query - The filters to apply on the shipping options.
   * @param {Record<string, any>} customHeaders - Custom headers to attach to the request.
   * @returns {ResponsePromise<StoreShippingOptionsListRes>} Resolves to the list of shipping options.
   * 
   * @example
   * import Medusa from "@medusajs/medusa-js"
   * const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
   * medusa.shippingOptions.list()
   * .then(({ shipping_options }) => {
   *   console.log(shipping_options.length);
   * })
   */
  list(
    query?: StoreGetShippingOptionsParams,
    customHeaders: Record<string, any> = {}): ResponsePromise<StoreShippingOptionsListRes> {
    let path = `/store/shipping-options`

    if (query) {
      const queryString = qs.stringify(query)
      path = `/store/shipping-options?${queryString}`
    }

    return this.client.request("GET", path, undefined, {}, customHeaders)
  }
}

export default ShippingOptionsResource
