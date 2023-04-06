import {
  StoreGetProductTagsParams,
  StoreProductTagsListRes,
} from "@medusajs/medusa"
import qs from "qs"
import { ResponsePromise } from "../typings"
import BaseResource from "./base"

class ProductTagsResource extends BaseResource {
  /**
   * @description Retrieves a list of product tags
   * @param {StoreGetProductTagsParams} query is optional. Can contain a limit and offset for the returned list
   * @param customHeaders
   * @return {ResponsePromise<StoreProductTagsListRes>}
   */
  list(
    query?: StoreGetProductTagsParams,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<StoreProductTagsListRes> {
    let path = `/store/product-tags`

    if (query) {
      const queryString = qs.stringify(query)
      path += `?${queryString}`
    }

    return this.client.request("GET", path, undefined, {}, customHeaders)
  }
}

export default ProductTagsResource
