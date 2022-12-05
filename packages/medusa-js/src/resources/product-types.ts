import {
  StoreGetProductTypesParams,
  StoreProductTypesListRes,
} from "@medusajs/medusa"
import qs from "qs"
import { ResponsePromise } from "../typings"
import BaseResource from "./base"

class ProductTypesResource extends BaseResource {
  /**
   * @description Retrieves a list of product types
   * @param {StoreGetProductTypesParams} query is optional. Can contain a limit and offset for the returned list
   * @param customHeaders
   * @return {ResponsePromise<StoreProductTypesListRes>}
   */
  list(
    query?: StoreGetProductTypesParams,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<StoreProductTypesListRes> {
    let path = `/store/product-types`

    if (query) {
      const queryString = qs.stringify(query)
      path += `?${queryString}`
    }

    return this.client.request("GET", path, undefined, {}, customHeaders)
  }
}

export default ProductTypesResource
