import {
  StoreGetVariantsParams,
  StoreVariantsListRes,
  StoreVariantsRes,
} from "@medusajs/medusa"
import { AxiosPromise } from "axios"
import BaseResource from "./base"

class ProductVariantsResource extends BaseResource {
  /**
   * @description Retrieves a single product variant
   * @param {string} id is required
   * @return {AxiosPromise<StoreVariantsRes>}
   */
  retrieve(id: string): AxiosPromise<StoreVariantsRes> {
    const path = `/store/variants/${id}`
    return this.client.request("GET", path)
  }

  /**
   * @description Retrieves a list of of Product Variants
   * @param {StoreVariantsListParamsObject} query
   * @return {AxiosPromise<StoreVariantsListRes>}
   */
  list(query?: StoreGetVariantsParams): AxiosPromise<StoreVariantsListRes> {
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
