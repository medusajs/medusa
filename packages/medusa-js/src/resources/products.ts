import {
  StoreGetProductsParams,
  StorePostSearchReq,
  StorePostSearchRes,
  StoreProductsListRes,
  StoreProductsRes,
} from "@medusajs/medusa"
import { AxiosPromise } from "axios"
import BaseResource from "./base"
import ProductVariantsResource from "./product-variants"

class ProductsResource extends BaseResource {
  public variants = new ProductVariantsResource(this.client)

  /**
   * @description Retrieves a single Product
   * @param {string} id is required
   * @return {AxiosPromise<StoreProductsRes>}
   */
  retrieve(id: string): AxiosPromise<StoreProductsRes> {
    const path = `/store/products/${id}`
    return this.client.request("GET", path)
  }

  /**
   * @description Searches for products
   * @param {StorePostSearchReq} searchOptions is required
   * @return {AxiosPromise<StorePostSearchRes>}
   */
  search(searchOptions: StorePostSearchReq): AxiosPromise<StorePostSearchRes> {
    const path = `/store/products/search`
    return this.client.request("POST", path, searchOptions)
  }

  /**
   * @description Retrieves a list of products
   * @param {StoreGetProductsParams} query is optional. Can contain a limit and offset for the returned list
   * @return {AxiosPromise<StoreProductsListRes>}
   */
  list(query?: StoreGetProductsParams): AxiosPromise<StoreProductsListRes> {
    let path = `/store/products`

    if (query) {
      const queryString = Object.entries(query).map(([key, value]) => {
        return `${key}=${value}`
      })

      path = `/store/products?${queryString.join("&")}`
    }

    return this.client.request("GET", path)
  }
}

export default ProductsResource
