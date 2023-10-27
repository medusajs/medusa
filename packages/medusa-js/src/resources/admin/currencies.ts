import {
  AdminCurrenciesListRes,
  AdminCurrenciesRes,
  AdminGetCurrenciesParams,
  AdminPostCurrenciesCurrencyReq,
} from "@medusajs/medusa"
import qs from "qs"
import { ResponsePromise } from "../../typings"
import BaseResource from "../base"

/**
 * This class is used to send requests to [Admin Currency API Routes](https://docs.medusajs.com/api/admin#currencies).
 * 
 * All methods in this class require {@link auth.createSession | user authentication}.
 */
class AdminCurrenciesResource extends BaseResource {
  /**
   * Retrieve a list of currencies. The currencies can be filtered by fields such as `code`. The currencies can also be sorted or paginated.
   * @param {AdminGetCurrenciesParams} query - Filters and pagination configurations to apply on retrieved currencies.
   * @param {Record<string, any>} customHeaders - Custom headers to attach to the request.
   * @returns {ResponsePromise<AdminCurrenciesListRes>} The list of currencies with pagination fields.
   * 
   * @example
   * To list currencies:
   * 
   * ```ts
   * import Medusa from "@medusajs/medusa-js"
   * const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
   * // must be previously logged in or use api token
   * medusa.admin.currencies.list()
   * .then(({ currencies, count, offset, limit }) => {
   *   console.log(currencies.length);
   * });
   * ```
   * 
   * By default, only the first `20` records are retrieved. You can control pagination by specifying the skip and take parameters:
   * 
   * ```ts
   * import Medusa from "@medusajs/medusa-js"
   * const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
   * // must be previously logged in or use api token
   * medusa.admin.currencies.list({
   *   limit,
   *   offset
   * })
   * .then(({ currencies, count, offset, limit }) => {
   *   console.log(currencies.length);
   * });
   * ```
   */
  list(
    query?: AdminGetCurrenciesParams,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminCurrenciesListRes> {
    let path = `/admin/currencies`

    if (query) {
      const queryString = qs.stringify(query)
      path += `?${queryString}`
    }

    return this.client.request("GET", path, undefined, {}, customHeaders)
  }

  /**
   * Update a Currency's details.
   * @param {string} code - The code of the currency to update.
   * @param {AdminPostCurrenciesCurrencyReq} payload - The attributes to update in the currency.
   * @param {Record<string, any>} customHeaders - Custom headers to attach to the request.
   * @returns {ResponsePromise<AdminCurrenciesRes>} The currency's details.
   * 
   * @example
   * import Medusa from "@medusajs/medusa-js"
   * const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
   * // must be previously logged in or use api token
   * medusa.admin.currencies.update(code, {
   *   includes_tax: true
   * })
   * .then(({ currency }) => {
   *   console.log(currency.code);
   * });
   */
  update(
    code: string,
    payload: AdminPostCurrenciesCurrencyReq,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminCurrenciesRes> {
    const path = `/admin/currencies/${code}`
    return this.client.request("POST", path, payload, {}, customHeaders)
  }
}

export default AdminCurrenciesResource
