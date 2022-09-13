import {
  AdminCurrenciesListRes,
  AdminCurrenciesRes,
  AdminGetCurrenciesParams,
  AdminPostCurrenciesCurrencyReq,
} from "@medusajs/medusa"
import qs from "qs"
import { ResponsePromise } from "../../typings"
import BaseResource from "../base"

class AdminCurrenciesResource extends BaseResource {
  /**
   * @description Lists currencies.
   * @experimental This feature is under development and may change in the future.
   * To use this feature please enable featureflag `tax_inclusive_pricing` in your medusa backend project.
   * @param payload optional
   * @param customHeaders
   * @returns the list of currencies as well as the pagination properties.
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
   * @description Updates a currency
   * @experimental This feature is under development and may change in the future.
   * To use this feature please enable featureflag `tax_inclusive_pricing` in your medusa backend project.
   * @param code code of the currency to update.
   * @param payload update to apply to currency.
   * @param customHeaders
   * @returns the updated currency.
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
