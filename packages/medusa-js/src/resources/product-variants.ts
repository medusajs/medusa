import {
  StoreGetVariantsParams,
  StoreVariantsListRes,
  StoreVariantsRes,
} from "@medusajs/medusa"
import qs from "qs"
import { ResponsePromise } from "../typings"
import BaseResource from "./base"

class ProductVariantsResource extends BaseResource {
  /**
   * @description Retrieves a single product variant
   * @param {string} id is required
   * @param customHeaders
   * @return {ResponsePromise<StoreVariantsRes>}
   */
  retrieve(id: string, customHeaders: Record<string, any> = {}): ResponsePromise<StoreVariantsRes> {
    const path = `/store/variants/${id}`
    return this.client.request("GET", path, {}, {}, customHeaders)
  }

  /**
   * @description Retrieves a list of of Product Variants
   * @param {StoreGetVariantsParams} query
   * @param customHeaders
   * @return {ResponsePromise<StoreVariantsListRes>}
   */
  list(query?: StoreGetVariantsParams, customHeaders: Record<string, any> = {}): ResponsePromise<StoreVariantsListRes> {
    let path = `/store/variants`
    if (query) {
      const queryString = qs.stringify(query)
      path += `?${queryString}`
    }

    return this.client.request("GET", path, undefined, {}, customHeaders)
  }
}

export default ProductVariantsResource
