import qs from "qs"
import { ResponsePromise } from "../typings"
import BaseResource from "./base"
import {
  StoreGetProductOptionsParams,
  StoreProductOptionsListRes,
} from "@medusajs/medusa/dist/api/routes/store/product-options"

class ProductOptionsResource extends BaseResource {
  /**
   * @description Retrieves a list of product options
   * @param {StoreGetProductOptionsParams} query is optional. Can contain a limit and offset for the
   * returned list
   * @param customHeaders
   * @return {ResponsePromise<StoreProductOptionsListRes>}
   */
  list(
    query?: StoreGetProductOptionsParams,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<StoreProductOptionsListRes> {
    let path = `/store/product-options`

    if (query) {
      const queryString = qs.stringify(query)
      path += `?${queryString}`
    }

    return this.client.request("GET", path, undefined, {}, customHeaders)
  }
}

export default ProductOptionsResource
