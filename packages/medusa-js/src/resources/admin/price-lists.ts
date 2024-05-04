import {
  AdminDeletePriceListPricesPricesReq,
  AdminDeletePriceListsPriceListProductsPricesBatchReq,
  AdminGetPriceListPaginationParams,
  AdminGetPriceListsPriceListProductsParams,
  AdminPostPriceListPricesPricesReq,
  AdminPostPriceListsPriceListPriceListReq,
  AdminPostPriceListsPriceListReq,
  AdminPriceListDeleteBatchRes,
  AdminPriceListDeleteProductPricesRes,
  AdminPriceListDeleteRes,
  AdminPriceListDeleteVariantPricesRes,
  AdminPriceListRes,
  AdminPriceListsListRes,
  AdminPriceListsProductsListRes,
} from "@medusajs/medusa"
import qs from "qs"
import { ResponsePromise } from "../../typings"
import BaseResource from "../base"

/**
 * This class is used to send requests to [Admin Price List API Routes](https://docs.medusajs.com/api/admin#price-lists). All its method
 * are available in the JS Client under the `medusa.admin.priceLists` property.
 * 
 * All methods in this class require {@link AdminAuthResource.createSession | user authentication}.
 * 
 * A price list are special prices applied to products based on a set of conditions, such as customer group.
 * 
 * Related Guide: [How to manage price lists](https://docs.medusajs.com/modules/price-lists/admin/manage-price-lists).
 */
class AdminPriceListResource extends BaseResource {
  /**
   * Create a price list.
   * @param {AdminPostPriceListsPriceListReq} payload - The price list to create.
   * @param {Record<string, any>} customHeaders - Custom headers to attach to the request.
   * @returns {ResponsePromise<AdminPriceListRes>} Resolves to the price list details.
   * 
   * @example
   * medusa.admin.priceLists.create({
   *   name: "New Price List",
   *   description: "A new price list",
   *   type: PriceListType.SALE,
   *   prices: [
   *     {
   *       amount: 1000,
   *       variant_id,
   *       currency_code: "eur"
   *     }
   *   ]
   * })
   * .then(({ price_list }) => {
   *   console.log(price_list.id);
   * })
   */
  create(
    payload: AdminPostPriceListsPriceListReq,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminPriceListRes> {
    const path = `/admin/price-lists`
    return this.client.request("POST", path, payload, {}, customHeaders)
  }

  /**
   * Update a price list's details.
   * @param {string} id - The ID of the price list.
   * @param {AdminPostPriceListsPriceListPriceListReq} payload - The attributes to update in the price list.
   * @param {Record<string, any>} customHeaders - Custom headers to attach to the request.
   * @returns {ResponsePromise<AdminPriceListRes>} Resolves to the price list details.
   * 
   * @example
   * import Medusa from "@medusajs/medusa-js"
   * const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
   * // must be previously logged in or use api token
   * medusa.admin.priceLists.update(priceListId, {
   *   name: "New Price List"
   * })
   * .then(({ price_list }) => {
   *   console.log(price_list.id);
   * })
   */
  update(
    id: string,
    payload: AdminPostPriceListsPriceListPriceListReq,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminPriceListRes> {
    const path = `/admin/price-lists/${id}`
    return this.client.request("POST", path, payload, {}, customHeaders)
  }

  /**
   * Delete a price list and its associated prices.
   * @param {string} id - The ID of the price list.
   * @param {Record<string, any>} customHeaders - Custom headers to attach to the request.
   * @returns {ResponsePromise<AdminPriceListDeleteRes>} Resolves to the deletion operation's details.
   * 
   * @example
   * import Medusa from "@medusajs/medusa-js"
   * const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
   * // must be previously logged in or use api token
   * medusa.admin.priceLists.delete(priceListId)
   * .then(({ id, object, deleted }) => {
   *   console.log(id);
   * })
   */
  delete(
    id: string,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminPriceListDeleteRes> {
    const path = `/admin/price-lists/${id}`
    return this.client.request("DELETE", path, undefined, {}, customHeaders)
  }

  /**
   * Retrieve a price list's details.
   * @param {string} id - The ID of the price list.
   * @param {Record<string, any>} customHeaders - Custom headers to attach to the request.
   * @returns {ResponsePromise<AdminPriceListRes>} Resolves to the price list details.
   * 
   * @example
   * import Medusa from "@medusajs/medusa-js"
   * const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
   * // must be previously logged in or use api token
   * medusa.admin.priceLists.retrieve(priceListId)
   * .then(({ price_list }) => {
   *   console.log(price_list.id);
   * })
   */
  retrieve(
    id: string,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminPriceListRes> {
    const path = `/admin/price-lists/${id}`
    return this.client.request("GET", path, undefined, {}, customHeaders)
  }

  /**
   * Retrieve a list of price lists. The price lists can be filtered by fields such as `q` or `status` passed in the `query` parameter. The price lists can also be sorted or paginated.
   * @param {AdminGetPriceListPaginationParams} query - Filters and pagination configurations to apply on the retrieved price lists.
   * @param {Record<string, any>} customHeaders - Custom headers to attach to the request.
   * @returns {ResponsePromise<AdminPriceListsListRes>} Resolves to the list of price lists with pagination fields.
   * 
   * @example
   * To list price lists:
   * 
   * ```ts
   * import Medusa from "@medusajs/medusa-js"
   * const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
   * // must be previously logged in or use api token
   * medusa.admin.priceLists.list()
   * .then(({ price_lists, limit, offset, count }) => {
   *   console.log(price_lists.length);
   * })
   * ```
   * 
   * To specify relations that should be retrieved within the price lists:
   * 
   * ```ts
   * import Medusa from "@medusajs/medusa-js"
   * const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
   * // must be previously logged in or use api token
   * medusa.admin.priceLists.list({
   *   expand: "prices"
   * })
   * .then(({ price_lists, limit, offset, count }) => {
   *   console.log(price_lists.length);
   * })
   * ```
   * 
   * By default, only the first `10` records are retrieved. You can control pagination by specifying the `limit` and `offset` properties:
   * 
   * ```ts
   * import Medusa from "@medusajs/medusa-js"
   * const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
   * // must be previously logged in or use api token
   * medusa.admin.priceLists.list({
   *   expand: "prices",
   *   limit,
   *   offset
   * })
   * .then(({ price_lists, limit, offset, count }) => {
   *   console.log(price_lists.length);
   * })
   * ```
   */
  list(
    query?: AdminGetPriceListPaginationParams,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminPriceListsListRes> {
    let path = `/admin/price-lists/`

    if (query) {
      const queryString = qs.stringify(query)
      path = `/admin/price-lists?${queryString}`
    }

    return this.client.request("GET", path, undefined, {}, customHeaders)
  }

  /**
   * Retrieve a price list's products. The products can be filtered by fields such as `q` or `status` passed in the `query` parameter. The products can also be sorted or paginated.
   * @param {string} id - The ID of the price list.
   * @param {AdminGetPriceListsPriceListProductsParams} query - Filters and pagination configurations applied on the retrieved products.
   * @param {Record<string, any>} customHeaders - Custom headers to attach to the request.
   * @returns {ResponsePromise<AdminPriceListsProductsListRes>} Resolves to the list of products with pagination fields.
   * 
   * @example
   * To list products in a price list:
   * 
   * ```ts
   * import Medusa from "@medusajs/medusa-js"
   * const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
   * // must be previously logged in or use api token
   * medusa.admin.priceLists.listProducts(priceListId)
   * .then(({ products, limit, offset, count }) => {
   *   console.log(products.length);
   * })
   * ```
   * 
   * To specify relations that should be retrieved within the products:
   * 
   * ```ts
   * import Medusa from "@medusajs/medusa-js"
   * const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
   * // must be previously logged in or use api token
   * medusa.admin.priceLists.listProducts(priceListId, {
   *   expand: "variants"
   * })
   * .then(({ products, limit, offset, count }) => {
   *   console.log(products.length);
   * })
   * ```
   * 
   * By default, only the first `50` records are retrieved. You can control pagination by specifying the `limit` and `offset` properties:
   * 
   * ```ts
   * import Medusa from "@medusajs/medusa-js"
   * const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
   * // must be previously logged in or use api token
   * medusa.admin.priceLists.listProducts(priceListId, {
   *   expand: "variants",
   *   limit,
   *   offset
   * })
   * .then(({ products, limit, offset, count }) => {
   *   console.log(products.length);
   * })
   * ```
   */
  listProducts(
    id: string,
    query?: AdminGetPriceListsPriceListProductsParams,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminPriceListsProductsListRes> {
    let path = `/admin/price-lists/${id}/products`

    if (query) {
      const queryString = qs.stringify(query)
      path = `/admin/price-lists/${id}/products?${queryString}`
    }

    return this.client.request("GET", path, undefined, {}, customHeaders)
  }

  /**
   * Add or update a list of prices in a price list.
   * @param {string} id - The ID of the price list.
   * @param {AdminPostPriceListPricesPricesReq} payload - The details of prices to add or update.
   * @param {Record<string, any>} customHeaders - Custom headers to attach to the request.
   * @returns {ResponsePromise<AdminPriceListRes>} Resolves to the price list's details.
   * 
   * @example
   * import Medusa from "@medusajs/medusa-js"
   * const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
   * // must be previously logged in or use api token
   * medusa.admin.priceLists.addPrices(priceListId, {
   *   prices: [
   *     {
   *       amount: 1000,
   *       variant_id,
   *       currency_code: "eur"
   *     }
   *   ]
   * })
   * .then(({ price_list }) => {
   *   console.log(price_list.id);
   * })
   */
  addPrices(
    id: string,
    payload: AdminPostPriceListPricesPricesReq,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminPriceListRes> {
    const path = `/admin/price-lists/${id}/prices/batch`
    return this.client.request("POST", path, payload, {}, customHeaders)
  }

  /**
   * Delete a list of prices in a price list
   * @param {string} id - The ID of the price list.
   * @param {AdminDeletePriceListPricesPricesReq} payload - The prices to delete.
   * @param {Record<string, any>} customHeaders - Custom headers to attach to the request.
   * @returns {ResponsePromise<AdminPriceListDeleteBatchRes>} Resolves to the deletion operation's details.
   * 
   * @example
   * import Medusa from "@medusajs/medusa-js"
   * const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
   * // must be previously logged in or use api token
   * medusa.admin.priceLists.deletePrices(priceListId, {
   *   price_ids: [
   *     price_id
   *   ]
   * })
   * .then(({ ids, object, deleted }) => {
   *   console.log(ids.length);
   * })
   */
  deletePrices(
    id: string,
    payload: AdminDeletePriceListPricesPricesReq,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminPriceListDeleteBatchRes> {
    const path = `/admin/price-lists/${id}/prices/batch`
    return this.client.request("DELETE", path, payload, {}, customHeaders)
  }

  /**
   * Delete all the prices related to a specific product in a price list.
   * @param {string} priceListId - The ID of the price list.
   * @param {string} productId - The product's ID.
   * @param {Record<string, any>} customHeaders - Custom headers to attach to the request.
   * @returns {ResponsePromise<AdminPriceListDeleteProductPricesRes>} Resolves to the deletion operation's details.
   * 
   * @example
   * import Medusa from "@medusajs/medusa-js"
   * const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
   * // must be previously logged in or use api token
   * medusa.admin.priceLists.deleteProductPrices(priceListId, productId)
   * .then(({ ids, object, deleted }) => {
   *   console.log(ids.length);
   * })
   */
  deleteProductPrices(
    priceListId: string,
    productId: string,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminPriceListDeleteProductPricesRes> {
    const path = `/admin/price-lists/${priceListId}/products/${productId}/prices`
    return this.client.request("DELETE", path, undefined, {}, customHeaders)
  }

  /**
   * Delete all the prices related to a specific product variant in a price list.
   * @param {string} priceListId - The ID of the price list.
   * @param {string} variantId - The ID of the product variant.
   * @param {Record<string, any>} customHeaders - Custom headers to attach to the request.
   * @returns {ResponsePromise<AdminPriceListDeleteVariantPricesRes>} Resolves to the deletion operation's details.
   * 
   * @example
   * import Medusa from "@medusajs/medusa-js"
   * const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
   * // must be previously logged in or use api token
   * medusa.admin.priceLists.deleteVariantPrices(priceListId, variantId)
   * .then(({ ids, object, deleted }) => {
   *   console.log(ids);
   * })
   */
  deleteVariantPrices(
    priceListId: string,
    variantId: string,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminPriceListDeleteVariantPricesRes> {
    const path = `/admin/price-lists/${priceListId}/variants/${variantId}/prices`
    return this.client.request("DELETE", path, undefined, {}, customHeaders)
  }

  /**
   * Delete all the prices associated with multiple products in a price list.
   * @param {string} priceListId - The ID of the price list.
   * @param {AdminDeletePriceListsPriceListProductsPricesBatchReq} payload - The products whose prices should be deleted.
   * @param {Record<string, any>} customHeaders - Custom headers to attach to the request.
   * @returns {ResponsePromise<AdminPriceListDeleteProductPricesRes>} Resolves to the deletion operation's details.
   * 
   * @example
   * import Medusa from "@medusajs/medusa-js"
   * const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
   * // must be previously logged in or use api token
   * medusa.admin.priceLists.deleteProductsPrices(priceListId, {
   *   product_ids: [
   *     productId1,
   *     productId2,
   *   ]
   * })
   * .then(({ ids, object, deleted }) => {
   *   console.log(ids.length);
   * })
   */
  deleteProductsPrices(
    priceListId: string,
    payload: AdminDeletePriceListsPriceListProductsPricesBatchReq,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminPriceListDeleteProductPricesRes> {
    const path = `/admin/price-lists/${priceListId}/products/prices/batch`
    return this.client.request("DELETE", path, payload, {}, customHeaders)
  }
}

export default AdminPriceListResource
