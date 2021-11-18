import {
  StoreGetShippingOptionsParams,
  StoreShippingOptionsListRes,
} from "@medusajs/medusa"
import { AxiosPromise } from "axios"
import BaseResource from "./base"

class ShippingOptionsResource extends BaseResource {
  /**
   * @description Lists shiping options available for a cart
   * @param {string} cart_id
   * @return {AxiosPromise<StoreShippingOptionsListRes>}
   */
  listCartOptions(cart_id: string): AxiosPromise<StoreShippingOptionsListRes> {
    const path = `/store/shipping-options/${cart_id}`
    return this.client.request("GET", path)
  }

  /**
   * @description Lists shiping options available
   * @param {StoreGetShippingOptionsParamsObject} query
   * @return {AxiosPromise<StoreShippingOptionsListRes>}
   */
  list(
    query?: StoreGetShippingOptionsParams
  ): AxiosPromise<StoreShippingOptionsListRes> {
    let path = `/store/shipping-options`

    const queryString = Object.entries(query || {}).map(([key, value]) => {
      let val = value
      if (Array.isArray(value)) {
        val = value.join(",")
      }

      return `${key}=${val}`
    })

    path = `/store/shipping-options?${queryString.join("&")}`

    return this.client.request("GET", path)
  }
}

export default ShippingOptionsResource
