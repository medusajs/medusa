import {
  AdminTaxRatesRes,
  AdminTaxRatesListRes,
  AdminTaxRatesDeleteRes,
  AdminGetTaxRatesParams,
  AdminGetTaxRatesTaxRateParams,
  AdminDeleteTaxRatesTaxRateProductsReq,
  AdminDeleteTaxRatesTaxRateProductsParams,
  AdminDeleteTaxRatesTaxRateProductTypesReq,
  AdminDeleteTaxRatesTaxRateProductTypesParams,
  AdminDeleteTaxRatesTaxRateShippingOptionsReq,
  AdminDeleteTaxRatesTaxRateShippingOptionsParams,
  AdminPostTaxRatesReq,
  AdminPostTaxRatesTaxRateReq,
  AdminPostTaxRatesTaxRateProductsReq,
  AdminPostTaxRatesTaxRateProductTypesReq,
  AdminPostTaxRatesTaxRateShippingOptionsReq,
} from "@medusajs/medusa"
import qs from "qs"
import { ResponsePromise } from "../../typings"
import BaseResource from "../base"
import { AdminPostTaxRatesTaxRateProductsParams } from "@medusajs/medusa"
import { AdminPostTaxRatesTaxRateShippingOptionsParams } from "@medusajs/medusa"
import { AdminPostTaxRatesParams } from "@medusajs/medusa"
import { AdminPostTaxRatesTaxRateParams } from "@medusajs/medusa"

/**
 * This class is used to send requests to [Admin Tax Rate API Routes](https://docs.medusajs.com/api/admin#tax-rates). All its method
 * are available in the JS Client under the `medusa.admin.taxRates` property.
 * 
 * All methods in this class require {@link AdminAuthResource.createSession | user authentication}.
 * 
 * Each region has at least a default tax rate. Admins can create and manage additional tax rates that can be applied for certain conditions, such as for specific product types.
 * 
 * Related Guide: [How to manage tax rates](https://docs.medusajs.com/modules/taxes/admin/manage-tax-rates).
 */
class AdminTaxRatesResource extends BaseResource {
  /**
   * Retrieve a tax rate's details.
   * @param {string} id - The tax rate's ID.
   * @param {AdminGetTaxRatesTaxRateParams} query - Configurations to apply on retrieved tax rates.
   * @param {Record<string, any>} customHeaders - Custom headers to attach to the request.
   * @returns {ResponsePromise<AdminTaxRatesRes>} Resolves to the tax rate's details.
   * 
   * @example
   * A simple example that retrieves a tax rate by its ID:
   * 
   * ```ts
   * import Medusa from "@medusajs/medusa-js"
   * const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
   * // must be previously logged in or use api token
   * medusa.admin.taxRates.retrieve(taxRateId)
   * .then(({ tax_rate }) => {
   *   console.log(tax_rate.id);
   * })
   * ```
   * 
   * To specify relations that should be retrieved:
   * 
   * ```ts
   * import Medusa from "@medusajs/medusa-js"
   * const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
   * // must be previously logged in or use api token
   * medusa.admin.taxRates.retrieve(taxRateId, {
   *   expand: "shipping_options"
   * })
   * .then(({ tax_rate }) => {
   *   console.log(tax_rate.id);
   * })
   * ```
   */
  retrieve(
    id: string,
    query?: AdminGetTaxRatesTaxRateParams,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminTaxRatesRes> {
    let path = `/admin/tax-rates/${id}`

    if (query) {
      const queryString = qs.stringify(query)
      path = `/admin/tax-rates/${id}?${queryString}`
    }

    return this.client.request("GET", path, undefined, {}, customHeaders)
  }

  /**
   * Retrieve a list of tax rates. The tax rates can be filtered by fields such as `name` or `rate` passed in the `query` parameter. The tax rates can also be paginated.
   * @param {AdminGetTaxRatesParams} query - Filters and pagination configurations applied to the retrieved tax rates.
   * @param {Record<string, any>} customHeaders - Custom headers to attach to the request.
   * @returns {ResponsePromise<AdminTaxRatesListRes>} Resolves to the list of tax rates with pagination fields.
   * 
   * @example
   * To list tax rates:
   * 
   * ```ts
   * import Medusa from "@medusajs/medusa-js"
   * const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
   * // must be previously logged in or use api token
   * medusa.admin.taxRates.list()
   * .then(({ tax_rates, limit, offset, count }) => {
   *   console.log(tax_rates.length);
   * })
   * ```
   * 
   * To specify relations that should be retrieved within the tax rates:
   * 
   * ```ts
   * import Medusa from "@medusajs/medusa-js"
   * const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
   * // must be previously logged in or use api token
   * medusa.admin.taxRates.list({
   *   expand: "shipping_options"
   * })
   * .then(({ tax_rates, limit, offset, count }) => {
   *   console.log(tax_rates.length);
   * })
   * ```
   * 
   * By default, only the first `50` records are retrieved. You can control pagination by specifying the `limit` and `offset` properties:
   * 
   * ```ts
   * import Medusa from "@medusajs/medusa-js"
   * const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
   * // must be previously logged in or use api token
   * medusa.admin.taxRates.list({
   *   expand: "shipping_options",
   *   limit,
   *   offset
   * })
   * .then(({ tax_rates, limit, offset, count }) => {
   *   console.log(tax_rates.length);
   * })
   * ```
   */
  list(
    query?: AdminGetTaxRatesParams,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminTaxRatesListRes> {
    let path = `/admin/tax-rates`

    if (query) {
      const queryString = qs.stringify(query)
      path = `/admin/tax-rates?${queryString}`
    }

    return this.client.request("GET", path, undefined, {}, customHeaders)
  }

  /**
   * Create a tax rate.
   * @param {AdminPostTaxRatesReq} payload - The tax rate to create.
   * @param {AdminPostTaxRatesParams} query - Configurations to apply on the retrieved tax rate.
   * @param {Record<string, any>} customHeaders - Custom headers to attach to the request.
   * @returns {ResponsePromise<AdminTaxRatesRes>} Resolves to the tax rate's details.
   * 
   * @example
   * import Medusa from "@medusajs/medusa-js"
   * const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
   * // must be previously logged in or use api token
   * medusa.admin.taxRates.create({
   *   code: "TEST",
   *   name: "New Tax Rate",
   *   region_id
   * })
   * .then(({ tax_rate }) => {
   *   console.log(tax_rate.id);
   * })
   */
  create(
    payload: AdminPostTaxRatesReq,
    query?: AdminPostTaxRatesParams,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminTaxRatesRes> {
    let path = `/admin/tax-rates`

    if (query) {
      const queryString = qs.stringify(query)
      path = `/admin/tax-rates?${queryString}`
    }

    return this.client.request("POST", path, payload, {}, customHeaders)
  }

  /**
   * Update a tax rate's details.
   * @param {string} id - The tax rate's ID.
   * @param {AdminPostTaxRatesTaxRateReq} payload - The attributes to update in the tax rate.
   * @param {AdminPostTaxRatesTaxRateParams} query - Configurations to apply on the retrieved tax rate.
   * @param {Record<string, any>} customHeaders - Custom headers to attach to the request.
   * @returns {ResponsePromise<AdminTaxRatesRes>} Resolves to the tax rate's details.
   * 
   * @example
   * import Medusa from "@medusajs/medusa-js"
   * const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
   * // must be previously logged in or use api token
   * medusa.admin.taxRates.update(taxRateId, {
   *   name: "New Tax Rate"
   * })
   * .then(({ tax_rate }) => {
   *   console.log(tax_rate.id);
   * })
   */
  update(
    id: string,
    payload: AdminPostTaxRatesTaxRateReq,
    query?: AdminPostTaxRatesTaxRateParams,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminTaxRatesRes> {
    let path = `/admin/tax-rates/${id}`

    if (query) {
      const queryString = qs.stringify(query)
      path = `/admin/tax-rates/${id}?${queryString}`
    }

    return this.client.request("POST", path, payload, {}, customHeaders)
  }

  /**
   * Add products to a tax rate.
   * @param {string} id - The tax rate's ID.
   * @param {AdminPostTaxRatesTaxRateProductsReq} payload - The products to add to the tax rate.
   * @param {AdminPostTaxRatesTaxRateProductsParams} query - Configurations to apply on the retrieved tax rate.
   * @param {Record<string, any>} customHeaders - Custom headers to attach to the request.
   * @returns {ResponsePromise<AdminTaxRatesRes>} Resolves to the tax rate's details.
   * 
   * @example
   * import Medusa from "@medusajs/medusa-js"
   * const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
   * // must be previously logged in or use api token
   * medusa.admin.taxRates.addProducts(taxRateId, {
   *   products: [
   *     productId
   *   ]
   * })
   * .then(({ tax_rate }) => {
   *   console.log(tax_rate.id);
   * })
   */
  addProducts(
    id: string,
    payload: AdminPostTaxRatesTaxRateProductsReq,
    query?: AdminPostTaxRatesTaxRateProductsParams,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminTaxRatesRes> {
    let path = `/admin/tax-rates/${id}/products/batch`

    if (query) {
      const queryString = qs.stringify(query)
      path = `/admin/tax-rates/${id}/products/batch?${queryString}`
    }

    return this.client.request("POST", path, payload, {}, customHeaders)
  }

  /**
   * Add product types to a tax rate.
   * @param {string} id - The tax rate's ID.
   * @param {AdminPostTaxRatesTaxRateProductTypesReq} payload - The product types to add to the tax rate.
   * @param {AdminGetTaxRatesTaxRateParams} query - Configurations to apply on the retrieved tax rate.
   * @param {Record<string, any>} customHeaders - Custom headers to attach to the request.
   * @returns {ResponsePromise<AdminTaxRatesRes>} Resolves to the tax rate's details.
   * 
   * @example
   * import Medusa from "@medusajs/medusa-js"
   * const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
   * // must be previously logged in or use api token
   * medusa.admin.taxRates.addProductTypes(taxRateId, {
   *   product_types: [
   *     productTypeId
   *   ]
   * })
   * .then(({ tax_rate }) => {
   *   console.log(tax_rate.id);
   * })
   */
  addProductTypes(
    id: string,
    payload: AdminPostTaxRatesTaxRateProductTypesReq,
    query?: AdminGetTaxRatesTaxRateParams,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminTaxRatesRes> {
    let path = `/admin/tax-rates/${id}/product-types/batch`

    if (query) {
      const queryString = qs.stringify(query)
      path = `/admin/tax-rates/${id}/product-types/batch?${queryString}`
    }

    return this.client.request("POST", path, payload, {}, customHeaders)
  }

  /**
   * Add shipping options to a tax rate.
   * @param {string} id - The tax rate's ID.
   * @param {AdminPostTaxRatesTaxRateShippingOptionsReq} payload - The shipping options to add to the tax rate.
   * @param {AdminPostTaxRatesTaxRateShippingOptionsParams} query - Configurations to apply on the retrieved tax rate.
   * @param {Record<string, any>} customHeaders - Custom headers to attach to the request.
   * @returns {ResponsePromise<AdminTaxRatesRes>} Resolves to the tax rate's details.
   * 
   * @example
   * import Medusa from "@medusajs/medusa-js"
   * const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
   * // must be previously logged in or use api token
   * medusa.admin.taxRates.addShippingOptions(taxRateId, {
   *   shipping_options: [
   *     shippingOptionId
   *   ]
   * })
   * .then(({ tax_rate }) => {
   *   console.log(tax_rate.id);
   * })
   */
  addShippingOptions(
    id: string,
    payload: AdminPostTaxRatesTaxRateShippingOptionsReq,
    query?: AdminPostTaxRatesTaxRateShippingOptionsParams,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminTaxRatesRes> {
    let path = `/admin/tax-rates/${id}/shipping-options/batch`

    if (query) {
      const queryString = qs.stringify(query)
      path = `/admin/tax-rates/${id}/shipping-options/batch?${queryString}`
    }

    return this.client.request("POST", path, payload, {}, customHeaders)
  }

  /**
   * Remove products from a tax rate. This only removes the association between the products and the tax rate. It does not delete the products.
   * @param {string} id - The tax rate's ID.
   * @param {AdminDeleteTaxRatesTaxRateProductsReq} payload - The products to remove from the tax rate.
   * @param {AdminGetTaxRatesTaxRateParams} query - Configurations to apply on the retrieved tax rate.
   * @param {Record<string, any>} customHeaders - Custom headers to attach to the request.
   * @returns {ResponsePromise<AdminTaxRatesRes>} Resolves to the tax rate's details.
   * 
   * @example
   * import Medusa from "@medusajs/medusa-js"
   * const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
   * // must be previously logged in or use api token
   * medusa.admin.taxRates.removeProducts(taxRateId, {
   *   products: [
   *     productId
   *   ]
   * })
   * .then(({ tax_rate }) => {
   *   console.log(tax_rate.id);
   * })
   */
  removeProducts(
    id: string,
    payload: AdminDeleteTaxRatesTaxRateProductsReq,
    query?: AdminDeleteTaxRatesTaxRateProductsParams,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminTaxRatesRes> {
    let path = `/admin/tax-rates/${id}/products/batch`

    if (query) {
      const queryString = qs.stringify(query)
      path = `/admin/tax-rates/${id}/products/batch?${queryString}`
    }

    return this.client.request("DELETE", path, payload, {}, customHeaders)
  }

  /**
   * Remove product types from a tax rate. This only removes the association between the product types and the tax rate. It does not delete the product types.
   * @param {string} id - The tax rate's ID.
   * @param {AdminDeleteTaxRatesTaxRateProductTypesReq} payload - The product types to remove from the tax rate.
   * @param {AdminGetTaxRatesTaxRateParams} query - Configurations to apply on the retrieved tax rate.
   * @param {Record<string, any>} customHeaders - Custom headers to attach to the request.
   * @returns {ResponsePromise<AdminTaxRatesRes>} Resolves to the tax rate's details.
   * 
   * @example
   * import Medusa from "@medusajs/medusa-js"
   * const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
   * // must be previously logged in or use api token
   * medusa.admin.taxRates.removeProductTypes(taxRateId, {
   *   product_types: [
   *     productTypeId
   *   ]
   * })
   * .then(({ tax_rate }) => {
   *   console.log(tax_rate.id);
   * })
   */
  removeProductTypes(
    id: string,
    payload: AdminDeleteTaxRatesTaxRateProductTypesReq,
    query?: AdminDeleteTaxRatesTaxRateProductTypesParams,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminTaxRatesRes> {
    let path = `/admin/tax-rates/${id}/product-types/batch`

    if (query) {
      const queryString = qs.stringify(query)
      path = `/admin/tax-rates/${id}/product-types/batch?${queryString}`
    }

    return this.client.request("DELETE", path, payload, {}, customHeaders)
  }

  /**
   * Remove shipping options from a tax rate. This only removes the association between the shipping options and the tax rate. It does not delete the shipping options.
   * @param {string} id - The tax rate's ID.
   * @param {AdminDeleteTaxRatesTaxRateShippingOptionsReq} payload - The shipping options to remove from the tax rate.
   * @param {AdminGetTaxRatesTaxRateParams} query - Configurations to apply on the retrieved tax rate.
   * @param {Record<string, any>} customHeaders - Custom headers to attach to the request.
   * @returns {ResponsePromise<AdminTaxRatesRes>} Resolves to the tax rate's details.
   * 
   * @example
   * import Medusa from "@medusajs/medusa-js"
   * const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
   * // must be previously logged in or use api token
   * medusa.admin.taxRates.removeShippingOptions(taxRateId, {
   *   shipping_options: [
   *     shippingOptionId
   *   ]
   * })
   * .then(({ tax_rate }) => {
   *   console.log(tax_rate.id);
   * })
   */
  removeShippingOptions(
    id: string,
    payload: AdminDeleteTaxRatesTaxRateShippingOptionsReq,
    query?: AdminDeleteTaxRatesTaxRateShippingOptionsParams,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminTaxRatesRes> {
    let path = `/admin/tax-rates/${id}/shipping-options/batch`

    if (query) {
      const queryString = qs.stringify(query)
      path = `/admin/tax-rates/${id}/shipping-options/batch?${queryString}`
    }

    return this.client.request("DELETE", path, payload, {}, customHeaders)
  }

  /**
   * Delete a tax rate. Resources associated with the tax rate, such as products or product types, are not deleted.
   * @param {string} id - The tax rate's ID.
   * @param {Record<string, any>} customHeaders - Custom headers to attach to the request.
   * @returns {ResponsePromise<AdminTaxRatesDeleteRes>} Resolves to the deletion operation's details.
   * 
   * @example
   * import Medusa from "@medusajs/medusa-js"
   * const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
   * // must be previously logged in or use api token
   * medusa.admin.taxRates.delete(taxRateId)
   * .then(({ id, object, deleted }) => {
   *   console.log(id);
   * })
   */
  delete(
    id: string,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminTaxRatesDeleteRes> {
    const path = `/admin/tax-rates/${id}`
    return this.client.request("DELETE", path, undefined, {}, customHeaders)
  }
}

export default AdminTaxRatesResource
