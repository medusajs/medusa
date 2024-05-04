import {
  AdminPostRegionsReq,
  AdminRegionsRes,
  AdminPostRegionsRegionReq,
  AdminRegionsDeleteRes,
  AdminRegionsListRes,
  AdminGetRegionsParams,
  AdminPostRegionsRegionCountriesReq,
  AdminPostRegionsRegionFulfillmentProvidersReq,
  AdminPostRegionsRegionPaymentProvidersReq,
  AdminGetRegionsRegionFulfillmentOptionsRes,
  AdminGetRegionsRegionParams,
} from "@medusajs/medusa"
import qs from "qs"
import { ResponsePromise } from "../../typings"
import BaseResource from "../base"

/**
 * This class is used to send requests to [Admin Region API Routes](https://docs.medusajs.com/api/admin#regions). All its method
 * are available in the JS Client under the `medusa.admin.regions` property.
 *
 * All methods in this class require {@link AdminAuthResource.createSession | user authentication}.
 *
 * Regions are different countries or geographical regions that the commerce store serves customers in.
 * Admins can manage these regions, their providers, and more.
 *
 * Related Guide: [How to manage regions](https://docs.medusajs.com/modules/regions-and-currencies/admin/manage-regions).
 */
class AdminRegionsResource extends BaseResource {
  /**
   * Create a region.
   * @param {AdminPostRegionsReq} payload - The region to create.
   * @param {Record<string, any>} customHeaders - Custom headers to attach to the request.
   * @returns {ResponsePromise<AdminRegionsRes>} Resolves to the region's details.
   *
   * @example
   * import Medusa from "@medusajs/medusa-js"
   * const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
   * // must be previously logged in or use api token
   * medusa.admin.regions.create({
   *   name: "Europe",
   *   currency_code: "eur",
   *   tax_rate: 0,
   *   payment_providers: [
   *     "manual"
   *   ],
   *   fulfillment_providers: [
   *     "manual"
   *   ],
   *   countries: [
   *     "DK"
   *   ]
   * })
   * .then(({ region }) => {
   *   console.log(region.id);
   * })
   */
  create(
    payload: AdminPostRegionsReq,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminRegionsRes> {
    const path = `/admin/regions`
    return this.client.request("POST", path, payload, {}, customHeaders)
  }

  /**
   * Update a region's details.
   * @param {string} id - The region's ID.
   * @param {AdminPostRegionsRegionReq} payload - The attributes to update in the region.
   * @param {Record<string, any>} customHeaders - Custom headers to attach to the request.
   * @returns {ResponsePromise<AdminRegionsRes>} Resolves to the region's details.
   *
   * @example
   * import Medusa from "@medusajs/medusa-js"
   * const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
   * // must be previously logged in or use api token
   * medusa.admin.regions.update(regionId, {
   *   name: "Europe"
   * })
   * .then(({ region }) => {
   *   console.log(region.id);
   * })
   */
  update(
    id: string,
    payload: AdminPostRegionsRegionReq,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminRegionsRes> {
    const path = `/admin/regions/${id}`
    return this.client.request("POST", path, payload, {}, customHeaders)
  }

  /**
   * Delete a region. Associated resources, such as providers or currencies are not deleted. Associated tax rates are deleted.
   * @param {string} id - The region's ID.
   * @param {Record<string, any>} customHeaders - Custom headers to attach to the request.
   * @returns {ResponsePromise<AdminRegionsDeleteRes>} Resolves to the deletion operation's details.
   *
   * @example
   * import Medusa from "@medusajs/medusa-js"
   * const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
   * // must be previously logged in or use api token
   * medusa.admin.regions.delete(regionId)
   * .then(({ id, object, deleted }) => {
   *   console.log(id);
   * })
   */
  delete(
    id: string,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminRegionsDeleteRes> {
    const path = `/admin/regions/${id}`
    return this.client.request("DELETE", path, undefined, {}, customHeaders)
  }

  /**
   * Retrieve a region's details.
   * @param {string} id - The region's ID.
   * @param query - Query params
   * @param {Record<string, any>} customHeaders - Custom headers to attach to the request.
   * @returns {ResponsePromise<AdminRegionsRes>}  Resolves to the region's details.
   *
   * @example
   * import Medusa from "@medusajs/medusa-js"
   * const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
   * // must be previously logged in or use api token
   * medusa.admin.regions.retrieve(regionId)
   * .then(({ region }) => {
   *   console.log(region.id);
   * })
   */
  retrieve(
    id: string,
    query?: AdminGetRegionsRegionParams,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminRegionsRes> {
    let path = `/admin/regions/${id}`

    if (query) {
      const queryString = qs.stringify(query)
      path = `/admin/regions/${id}?${queryString}`
    }

    return this.client.request("GET", path, undefined, {}, customHeaders)
  }

  /**
   * Retrieve a list of Regions. The regions can be filtered by fields such as `created_at` passed in the `query` parameter. The regions can also be paginated.
   * @param {AdminGetRegionsParams} query - Filters and pagination configurations to apply on the retrieved regions.
   * @param {Record<string, any>} customHeaders - Custom headers to attach to the request.
   * @returns {ResponsePromise<AdminRegionsListRes>} Resolves to the list of regions with pagination fields.
   *
   * @example
   * To list regions:
   *
   * ```ts
   * import Medusa from "@medusajs/medusa-js"
   * const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
   * // must be previously logged in or use api token
   * medusa.admin.regions.list()
   * .then(({ regions, limit, offset, count }) => {
   *   console.log(regions.length);
   * })
   * ```
   *
   * By default, only the first `50` records are retrieved. You can control pagination by specifying the `limit` and `offset` properties:
   *
   * ```ts
   * import Medusa from "@medusajs/medusa-js"
   * const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
   * // must be previously logged in or use api token
   * medusa.admin.regions.list({
   *   limit,
   *   offset
   * })
   * .then(({ regions, limit, offset, count }) => {
   *   console.log(regions.length);
   * })
   * ```
   */
  list(
    query?: AdminGetRegionsParams,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminRegionsListRes> {
    let path = `/admin/regions`

    if (query) {
      const queryString = qs.stringify(query)
      path = `/admin/regions?${queryString}`
    }

    return this.client.request("GET", path, undefined, {}, customHeaders)
  }

  /**
   * Add a country to the list of countries in a region.
   * @param {string} id - The region's ID.
   * @param {AdminPostRegionsRegionCountriesReq} payload - The country to add.
   * @param {Record<string, any>} customHeaders - Custom headers to attach to the request.
   * @returns {ResponsePromise<AdminRegionsRes>} Resolves to the region's details.
   *
   * @example
   * import Medusa from "@medusajs/medusa-js"
   * const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
   * // must be previously logged in or use api token
   * medusa.admin.regions.addCountry(regionId, {
   *   country_code: "dk"
   * })
   * .then(({ region }) => {
   *   console.log(region.id);
   * })
   */
  addCountry(
    id: string,
    payload: AdminPostRegionsRegionCountriesReq,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminRegionsRes> {
    const path = `/admin/regions/${id}/countries`
    return this.client.request("POST", path, payload, {}, customHeaders)
  }

  /**
   * Delete a country from the list of countries in a region. The country will still be available in the system, and it can be used in other regions.
   * @param {string} id - The region's ID.
   * @param {string} country_code - The code of the country to delete from the region.
   * @param {Record<string, any>} customHeaders - Custom headers to attach to the request.
   * @returns {ResponsePromise<AdminRegionsRes>} Resolves to the region's details.
   *
   * @example
   * import Medusa from "@medusajs/medusa-js"
   * const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
   * // must be previously logged in or use api token
   * medusa.admin.regions.deleteCountry(regionId, "dk")
   * .then(({ region }) => {
   *   console.log(region.id);
   * })
   */
  deleteCountry(
    id: string,
    country_code: string,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminRegionsRes> {
    const path = `/admin/regions/${id}/countries/${country_code}`
    return this.client.request("DELETE", path, undefined, {}, customHeaders)
  }

  /**
   * Add a fulfillment provider to the list of fulfullment providers in a region.
   * @param {string} id - The region's ID.
   * @param {AdminPostRegionsRegionFulfillmentProvidersReq} payload - The fulfillment provider to add.
   * @param {Record<string, any>} customHeaders - Custom headers to attach to the request.
   * @returns {ResponsePromise<AdminRegionsRes>} Resolves to the region's details.
   *
   * @example
   * import Medusa from "@medusajs/medusa-js"
   * const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
   * // must be previously logged in or use api token
   * medusa.admin.regions.addFulfillmentProvider(regionId, {
   *   provider_id: "manual"
   * })
   * .then(({ region }) => {
   *   console.log(region.id);
   * })
   */
  addFulfillmentProvider(
    id: string,
    payload: AdminPostRegionsRegionFulfillmentProvidersReq,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminRegionsRes> {
    const path = `/admin/regions/${id}/fulfillment-providers`
    return this.client.request("POST", path, payload, {}, customHeaders)
  }

  /**
   * Delete a fulfillment provider from a region. The fulfillment provider will still be available for usage in other regions.
   * @param {string} id - The region's ID.
   * @param {string} provider_id - The ID of the fulfillment provider to delete from the region.
   * @param {Record<string, any>} customHeaders - Custom headers to attach to the request.
   * @returns {ResponsePromise<AdminRegionsRes>} Resolves to the region's details.
   *
   * @example
   * import Medusa from "@medusajs/medusa-js"
   * const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
   * // must be previously logged in or use api token
   * medusa.admin.regions.deleteFulfillmentProvider(regionId, "manual")
   * .then(({ region }) => {
   *   console.log(region.id);
   * })
   */
  deleteFulfillmentProvider(
    id: string,
    provider_id: string,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminRegionsRes> {
    const path = `/admin/regions/${id}/fulfillment-providers/${provider_id}`
    return this.client.request("DELETE", path, undefined, {}, customHeaders)
  }

  /**
   * Retrieve a list of fulfillment options available in a region.
   * @param {string} id - The region's ID.
   * @param {Record<string, any>} customHeaders - Custom headers to attach to the request.
   * @returns {ResponsePromise<AdminGetRegionsRegionFulfillmentOptionsRes>} Resolves to the list of fulfillment options.
   *
   * @example
   * import Medusa from "@medusajs/medusa-js"
   * const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
   * // must be previously logged in or use api token
   * medusa.admin.regions.retrieveFulfillmentOptions(regionId)
   * .then(({ fulfillment_options }) => {
   *   console.log(fulfillment_options.length);
   * })
   */
  retrieveFulfillmentOptions(
    id: string,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminGetRegionsRegionFulfillmentOptionsRes> {
    const path = `/admin/regions/${id}/fulfillment-options`
    return this.client.request("GET", path, undefined, {}, customHeaders)
  }

  /**
   * Add a payment provider to the list of payment providers in a region.
   * @param {string} id - The region's ID.
   * @param {AdminPostRegionsRegionPaymentProvidersReq} payload - The payment provider to add.
   * @param {Record<string, any>} customHeaders - Custom headers to attach to the request.
   * @returns {ResponsePromise<AdminRegionsRes>} Resolves to the region's details.
   *
   * @example
   * import Medusa from "@medusajs/medusa-js"
   * const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
   * // must be previously logged in or use api token
   * medusa.admin.regions.addPaymentProvider(regionId, {
   *   provider_id: "manual"
   * })
   * .then(({ region }) => {
   *   console.log(region.id);
   * })
   */
  addPaymentProvider(
    id: string,
    payload: AdminPostRegionsRegionPaymentProvidersReq,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminRegionsRes> {
    const path = `/admin/regions/${id}/payment-providers`
    return this.client.request("POST", path, payload, {}, customHeaders)
  }

  /**
   * Delete a payment provider from a region. The payment provider will still be available for usage in other regions.
   * @param {string} id - The region's ID.
   * @param {string} provider_id - The ID of the payment provider to delete from the region.
   * @param {Record<string, any>} customHeaders - Custom headers to attach to the request.
   * @returns {ResponsePromise<AdminRegionsRes>} Resolves to the region's details.
   *
   * @example
   * import Medusa from "@medusajs/medusa-js"
   * const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
   * // must be previously logged in or use api token
   * medusa.admin.regions.deletePaymentProvider(regionId, "manual")
   * .then(({ region }) => {
   *   console.log(region.id);
   * })
   */
  deletePaymentProvider(
    id: string,
    provider_id: string,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminRegionsRes> {
    const path = `/admin/regions/${id}/payment-providers/${provider_id}`
    return this.client.request("DELETE", path, undefined, {}, customHeaders)
  }
}

export default AdminRegionsResource
