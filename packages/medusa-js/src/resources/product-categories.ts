import {
  StoreGetProductCategoriesParams,
  StoreGetProductCategoriesRes,
  StoreGetProductCategoriesCategoryParams,
  StoreGetProductCategoriesCategoryRes,
} from "@medusajs/medusa"
import qs from "qs"
import { ResponsePromise } from "../typings"
import BaseResource from "./base"

class ProductCategoriesResource extends BaseResource {
  /**
   * @description Retrieves a single product category
   * @param {string} id - id of the product category
   * @param {string} query is optional. Can contain a fields or relations for the returned list
   * @param customHeaders
   * @return {ResponsePromise<StoreGetProductCategoriesCategoryRes>}
   */
  retrieve(
    id: string,
    query?: StoreGetProductCategoriesCategoryParams,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<StoreGetProductCategoriesCategoryRes> {
    let path = `/store/product-categories/${id}`

    if (query) {
      const queryString = qs.stringify(query)
      path = `${path}?${queryString}`
    }

    return this.client.request("GET", path, undefined, {}, customHeaders)
  }

  /**
   * @description Retrieves a list of product categories
   * @param {string} query is optional. Can contain a limit and offset for the returned list
   * @param customHeaders
   * @return {ResponsePromise<StoreGetProductCategoriesRes>}
   */
  list(
    query?: StoreGetProductCategoriesParams,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<StoreGetProductCategoriesRes> {
    let path = `/store/product-categories`

    if (query) {
      const queryString = qs.stringify(query)
      path = `${path}?${queryString}`
    }

    return this.client.request("GET", path, undefined, {}, customHeaders)
  }
}

export default ProductCategoriesResource
