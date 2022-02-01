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
   * @return {ResponsePromise<StoreVariantsRes>}
   */
  retrieve(id: string): ResponsePromise<StoreVariantsRes> {
    const path = `/store/variants/${id}`
    return this.client.request("GET", path)
  }

  /**
   * @description Retrieves a list of of Product Variants
   * @param {StoreVariantsListParamsObject} query
   * @return {ResponsePromise<StoreVariantsListRes>}
   */
  list(query?: StoreGetVariantsParams): ResponsePromise<StoreVariantsListRes> {
    let path = `/store/variants`
    if (query) {
      const queryString = qs.stringify(query)
      path += `?${queryString}`
    }

    return this.client.request("GET", path)
  }
}

export default ProductVariantsResource
