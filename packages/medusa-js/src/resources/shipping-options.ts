import {
  StoreGetShippingOptionsParams,
  StoreShippingOptionsListRes,
} from "@medusajs/medusa"
import qs from "qs"
import { ResponsePromise } from "../typings"
import BaseResource from "./base"

class ShippingOptionsResource extends BaseResource {
  /**
   * @description Lists shiping options available for a cart
   * @param {string} cart_id
   * @param customHeaders
   * @return {ResponsePromise<StoreShippingOptionsListRes>}
   */
  listCartOptions(cart_id: string, customHeaders: Record<string, any> = {}): ResponsePromise<StoreShippingOptionsListRes> {
    const path = `/store/shipping-options/${cart_id}`
    return this.client.request("GET", path, undefined, {}, customHeaders)
  }

  /**
   * @description Lists shiping options available
   * @param {StoreGetShippingOptionsParams} query
   * @param customHeaders
   * @return {ResponsePromise<StoreShippingOptionsListRes>}
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
