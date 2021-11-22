import {
  StoreGetVariantsParams,
  StoreVariantsListRes,
  StoreVariantsRes,
} from "@medusajs/medusa"
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
    const path = `/store/variants`

    const search = Object.entries(query || {}).map(([key, value]) => {
      if (Array.isArray(value)) {
        return `${key}=${value.join(",")}`
      }

      return `${key}=${value}`
    })

    return this.client.request(
      "GET",
      `${path}${search.length > 0 && `?${search.join("&")}`}`
    )
  }
}

export default ProductVariantsResource
