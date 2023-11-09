import {
  AdminDeleteProductCategoriesCategoryProductsBatchReq,
  AdminGetProductCategoriesParams,
  AdminPostProductCategoriesCategoryProductsBatchReq,
  AdminPostProductCategoriesReq,
  AdminProductCategoriesCategoryDeleteRes,
  AdminProductCategoriesListRes,
  AdminProductCategoriesCategoryRes,
  AdminGetProductCategoryParams,
  AdminPostProductCategoriesCategoryReq,
} from "@medusajs/medusa"
import qs from "qs"

import { ResponsePromise } from "../../typings"
import BaseResource from "../base"

/**
 * This class is used to send requests to [Admin Product Category API Routes](https://docs.medusajs.com/api/admin#product-categories). All its method
 * are available in the JS Client under the `medusa.admin.productCategories` property.
 * 
 * All methods in this class require {@link AdminAuthResource.createSession | user authentication}.
 * 
 * Products can be categoriezed into categories. A product can be added into more than one category.
 * 
 * Related Guide: [How to manage product categories](https://docs.medusajs.com/modules/products/admin/manage-categories).
 * 
 * @featureFlag product_categories
 */
class AdminProductCategoriesResource extends BaseResource {
  /**
   * Retrieve a product category's details.
   * @param {string} productCategoryId - The ID of the product category.
   * @param {AdminGetProductCategoryParams} query - Configurations to apply on the retrieved product category.
   * @param {Record<string, any>} customHeaders - Custom headers to attach to the request.
   * @returns {ResponsePromise<AdminProductCategoriesCategoryRes>} Resolves to the product category's details.
   * 
   * @example
   * A simple example that retrieves an order by its ID:
   * 
   * ```ts
   * import Medusa from "@medusajs/medusa-js"
   * const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
   * // must be previously logged in or use api token
   * medusa.admin.productCategories.retrieve(productCategoryId)
   * .then(({ product_category }) => {
   *   console.log(product_category.id);
   * })
   * ```
   * 
   * To specify relations that should be retrieved:
   * 
   * ```ts
   * import Medusa from "@medusajs/medusa-js"
   * const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
   * // must be previously logged in or use api token
   * medusa.admin.productCategories.retrieve(productCategoryId, {
   *   expand: "category_children"
   * })
   * .then(({ product_category }) => {
   *   console.log(product_category.id);
   * })
   * ```
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

  /**
   * Create a product category.
   * @param {AdminPostProductCategoriesReq} payload - The product category's details.
   * @param {Record<string, any>} customHeaders - Custom headers to attach to the request.
   * @returns {ResponsePromise<AdminProductCategoriesCategoryRes>} Resolves to the product category's details.
   * 
   * @example
   * import Medusa from "@medusajs/medusa-js"
   * const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
   * // must be previously logged in or use api token
   * medusa.admin.productCategories.create({
   *   name: "Skinny Jeans",
   * })
   * .then(({ product_category }) => {
   *   console.log(product_category.id);
   * })
   */
  create(
    payload: AdminPostProductCategoriesReq,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminProductCategoriesCategoryRes> {
    const path = `/admin/product-categories`
    return this.client.request("POST", path, payload, {}, customHeaders)
  }

  /**
   * Updates a product category.
   * @param {string} productCategoryId - The ID of the product category.
   * @param {AdminPostProductCategoriesCategoryReq} payload - The attributes to update in the product category.
   * @param {Record<string, any>} customHeaders - Custom headers to attach to the request.
   * @returns {ResponsePromise<AdminProductCategoriesCategoryRes>} Resolves to the product category's details.
   * 
   * @example
   * import Medusa from "@medusajs/medusa-js"
   * const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
   * // must be previously logged in or use api token
   * medusa.admin.productCategories.update(productCategoryId, {
   *   name: "Skinny Jeans"
   * })
   * .then(({ product_category }) => {
   *   console.log(product_category.id);
   * })
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
   * Retrieve a list of product categories. The product categories can be filtered by fields such as `q` or `handle` passed in the `query` parameter. 
   * The product categories can also be paginated.
   * @param {AdminGetProductCategoriesParams} query - Filters and pagination configurations to apply on the retrieved product categories.
   * @param {Record<string, any>} customHeaders - Custom headers to attach to the request.
   * @returns {ResponsePromise<AdminProductCategoriesListRes>} Resolves to the list of product categories with pagination fields.
   * 
   * @example
   * To list product categories:
   * 
   * ```ts
   * import Medusa from "@medusajs/medusa-js"
   * const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
   * // must be previously logged in or use api token
   * medusa.admin.productCategories.list()
   * .then(({ product_categories, limit, offset, count }) => {
   *   console.log(product_categories.length);
   * })
   * ```
   * 
   * To specify relations that should be retrieved within the product category:
   * 
   * ```ts
   * import Medusa from "@medusajs/medusa-js"
   * const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
   * // must be previously logged in or use api token
   * medusa.admin.productCategories.list({
   *   expand: "category_children"
   * })
   * .then(({ product_categories, limit, offset, count }) => {
   *   console.log(product_categories.length);
   * })
   * ```
   * 
   * By default, only the first `100` records are retrieved. You can control pagination by specifying the `limit` and `offset` properties:
   * 
   * ```ts
   * import Medusa from "@medusajs/medusa-js"
   * const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
   * // must be previously logged in or use api token
   * medusa.admin.productCategories.list({
   *   expand: "category_children",
   *   limit,
   *   offset
   * })
   * .then(({ product_categories, limit, offset, count }) => {
   *   console.log(product_categories.length);
   * })
   * ```
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
   * Delete a product category. This does not delete associated products.
   * @param {string} productCategoryId - The ID of the product category.
   * @param {Record<string, any>} customHeaders - Custom headers to attach to the request.
   * @returns {ResponsePromise<AdminProductCategoriesCategoryDeleteRes>} Resolves to the deletion operation's details.
   * 
   * @example
   * import Medusa from "@medusajs/medusa-js"
   * const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
   * // must be previously logged in or use api token
   * medusa.admin.productCategories.delete(productCategoryId)
   * .then(({ id, object, deleted }) => {
   *   console.log(id);
   * })
   */
  delete(
    productCategoryId: string,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminProductCategoriesCategoryDeleteRes> {
    const path = `/admin/product-categories/${productCategoryId}`
    return this.client.request("DELETE", path, undefined, {}, customHeaders)
  }

  /**
   * Remove a list of products from a product category.
   * @param {string} productCategoryId - The ID of the product category.
   * @param {AdminDeleteProductCategoriesCategoryProductsBatchReq} payload - The products to delete.
   * @param {Record<string, any>} customHeaders - Custom headers to attach to the request.
   * @returns {ResponsePromise<AdminProductCategoriesCategoryRes>} Resolves to the product category's details.
   * 
   * @example
   * import Medusa from "@medusajs/medusa-js"
   * const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
   * // must be previously logged in or use api token
   * medusa.admin.productCategories.removeProducts(productCategoryId, {
   *   product_ids: [
   *     {
   *       id: productId
   *     }
   *   ]
   * })
   * .then(({ product_category }) => {
   *   console.log(product_category.id);
   * })
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
   * Add a list of products to a product category.
   * @param {string} productCategoryId - The ID of the product category.
   * @param {AdminPostProductCategoriesCategoryProductsBatchReq} payload - The products to add.
   * @param {Record<string, any>} customHeaders - Custom headers to attach to the request.
   * @returns {ResponsePromise<AdminProductCategoriesCategoryRes>} Resolves to the product category's details.
   * 
   * @example
   * import Medusa from "@medusajs/medusa-js"
   * const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
   * // must be previously logged in or use api token
   * medusa.admin.productCategories.addProducts(productCategoryId, {
   *   product_ids: [
   *     {
   *       id: productId
   *     }
   *   ]
   * })
   * .then(({ product_category }) => {
   *   console.log(product_category.id);
   * })
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
