import {
  AdminDeleteProductCategoriesCategoryProductsBatchReq,
  AdminGetProductCategoriesParams,
  AdminPostProductCategoriesCategoryProductsBatchReq,
  AdminPostProductCategoriesReq,
  AdminPostProductCategoriesCategoryParams,
  AdminProductCategoriesCategoryDeleteRes,
  AdminProductCategoriesListRes,
  AdminProductCategoriesCategoryRes,
  AdminGetProductCategoryParams,
  AdminPostProductCategoriesCategoryReq,
} from "@medusajs/medusa"
import qs from "qs"

import { ResponsePromise } from "../../typings"
import BaseResource from "../base"

class AdminProductCategoriesResource extends BaseResource {
  /** retrieve a product category
   * @experimental This feature is under development and may change in the future.
   * To use this feature please enable featureflag `product_categories` in your medusa backend project.
   * @description gets a product category
   * @returns a medusa product category
   */
  retrieve(
    productCategoryId: string,
    query?: AdminGetProductCategoryParams,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminProductCategoriesCategoryRes> {
    let path = `/admin/product-categories/${productCategoryId}`

    if (query) {
      const queryString = qs.stringify(query)
      path = `${path}?${queryString}`
    }

    return this.client.request("GET", path, undefined, {}, customHeaders)
  }

  /* *
   * Create a medusa product category
   * @returns the created product category
   */
  create(
    payload: AdminPostProductCategoriesReq,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminProductCategoriesCategoryRes> {
    const path = `/admin/product-categories`
    return this.client.request("POST", path, payload, {}, customHeaders)
  }

  /** update a product category
   * @experimental This feature is under development and may change in the future.
   * To use this feature please enable featureflag `product_categories` in your medusa backend project.
   * @description updates a product category
   * @returns the updated medusa product category
   */
  update(
    productCategoryId: string,
    payload: AdminPostProductCategoriesCategoryReq,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminProductCategoriesCategoryRes> {
    const path = `/admin/product-categories/${productCategoryId}`
    return this.client.request("POST", path, payload, {}, customHeaders)
  }

  /**
   * Retrieve a list of product categories
   * @experimental This feature is under development and may change in the future.
   * To use this feature please enable featureflag `product_categories` in your medusa backend project.
   * @description Retrieve a list of product categories
   * @returns the list of product category as well as the pagination properties
   */
  list(
    query?: AdminGetProductCategoriesParams,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminProductCategoriesListRes> {
    let path = `/admin/product-categories`

    if (query) {
      const queryString = qs.stringify(query)
      path += `?${queryString}`
    }

    return this.client.request("GET", path, undefined, {}, customHeaders)
  }

  /**
   * Delete a product category
   * @experimental This feature is under development and may change in the future.
   * To use this feature please enable featureflag `product_categories` in your medusa backend project.
   * @description gets a product category
   * @returns an deletion result
   */
  delete(
    productCategoryId: string,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminProductCategoriesCategoryDeleteRes> {
    const path = `/admin/product-categories/${productCategoryId}`
    return this.client.request("DELETE", path, undefined, {}, customHeaders)
  }

  /**
   * Remove products from a product category
   * @experimental This feature is under development and may change in the future.
   * To use this feature please enable featureflag `product_categories` in your medusa backend project.
   * @description Remove products from a product category
   * @returns a medusa product category
   */
  removeProducts(
    productCategoryId: string,
    payload: AdminDeleteProductCategoriesCategoryProductsBatchReq,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminProductCategoriesCategoryRes> {
    const path = `/admin/product-categories/${productCategoryId}/products/batch`
    return this.client.request("DELETE", path, payload, {}, customHeaders)
  }

  /**
   * Add products to a product category
   * @experimental This feature is under development and may change in the future.
   * To use this feature please enable featureflag `product_categories` in your medusa backend project.
   * @description Add products to a product category
   * @returns a medusa product category
   */
  addProducts(
    productCategoryId: string,
    payload: AdminPostProductCategoriesCategoryProductsBatchReq,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminProductCategoriesCategoryRes> {
    const path = `/admin/product-categories/${productCategoryId}/products/batch`
    return this.client.request("POST", path, payload, {}, customHeaders)
  }
}

export default AdminProductCategoriesResource
