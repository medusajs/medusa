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
   * @return {ResponsePromise<StoreShippingOptionsListRes>}
   */
  listCartOptions(
    cart_id: string
  ): ResponsePromise<StoreShippingOptionsListRes> {
    const path = `/store/shipping-options/${cart_id}`
    return this.client.request("GET", path)
  }

  /**
   * @description Lists shiping options available
   * @param {StoreGetShippingOptionsParamsObject} query
   * @return {ResponsePromise<StoreShippingOptionsListRes>}
   */
  list(
    query?: StoreGetShippingOptionsParams
  ): ResponsePromise<StoreShippingOptionsListRes> {
    let path = `/store/shipping-options`

    if (query) {
      const queryString = qs.stringify(query)
      path = `/store/shipping-options?${queryString}`
    }

    return this.client.request("GET", path)
  }
}

export default ShippingOptionsResource
