import {
  StoreGetProductsParams,
  StorePostSearchReq,
  StorePostSearchRes,
  StoreProductsListRes,
  StoreProductsRes,
} from "@medusajs/medusa"
import qs from "qs"
import { ResponsePromise } from "../typings"
import BaseResource from "./base"
import ProductVariantsResource from "./product-variants"

class ProductsResource extends BaseResource {
  public variants = new ProductVariantsResource(this.client)

  /**
   * @description Retrieves a single Product
   * @param {string} id is required
   * @param customHeaders
   * @return {ResponsePromise<StoreProductsRes>}
   */
  retrieve(id: string, customHeaders: Record<string, any> = {}): ResponsePromise<StoreProductsRes> {
    const path = `/store/products/${id}`
    return this.client.request("GET", path, {}, {}, customHeaders)
  }

  /**
   * @description Searches for products
   * @param {StorePostSearchReq} searchOptions is required
   * @param customHeaders
   * @return {ResponsePromise<StorePostSearchRes>}
   */
  search(
    searchOptions: StorePostSearchReq,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<StorePostSearchRes> {
    const path = `/store/products/search`
    return this.client.request("POST", path, searchOptions, {}, customHeaders)
  }

  /**
   * @description Retrieves a list of products
   * @param {StoreGetProductsParams} query is optional. Can contain a limit and offset for the returned list
   * @param customHeaders
   * @return {ResponsePromise<StoreProductsListRes>}
   */
  list(query?: StoreGetProductsParams, customHeaders: Record<string, any> = {}): ResponsePromise<StoreProductsListRes> {
    let path = `/store/products`

    if (query) {
      const queryString = qs.stringify(query)
      path = `/store/products?${queryString}`
    }

    return this.client.request("GET", path, {}, {}, customHeaders)
  }
}

export default ProductsResource
