import BaseResource from "./base"
import { AxiosPromise } from "axios"
import { StoreVariantsListRes, StoreVariantsRes } from "@medusajs/medusa"
import { StoreVariantsListParamsObject } from "../types"

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
  list(
    query?: StoreVariantsListParamsObject
  ): AxiosPromise<StoreVariantsListRes> {
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
