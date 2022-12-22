import {
  AdminPaymentProvidersList,
  AdminTaxProvidersList,
  AdminPostStoreReq,
  AdminStoresRes,
} from "@medusajs/medusa"
import { ResponsePromise } from "../../typings"
import BaseResource from "../base"

class AdminStoresResource extends BaseResource {
  /**
   * @description Updates the store
   * @param payload update to apply to the store.
   * @param customHeaders
   * @returns the updated store.
   */
  update(
    payload: AdminPostStoreReq,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminStoresRes> {
    const path = `/admin/store/`
    return this.client.request("POST", path, payload, {}, customHeaders)
  }

  /**
   * @description adds a currency to the store.
   * @param currency_code code of the currency to add
   * @param customHeaders
   * @returns updated store.
   */
  addCurrency(
    currency_code: string,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminStoresRes> {
    const path = `/admin/store/${currency_code}`
    return this.client.request("POST", path, undefined, {}, customHeaders)
  }

  /**
   * @description deletes a currency from the available store currencies
   * @param currency_code currency code of the currency to delete from the store.
   * @param customHeaders
   * @returns updated store
   */
  deleteCurrency(
    currency_code: string,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminStoresRes> {
    const path = `/admin/store/currencies/${currency_code}`
    return this.client.request("DELETE", path, undefined, {}, customHeaders)
  }

  /**
   * @description gets a medusa store
   * @returns a medusa store
   */
  retrieve(
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminStoresRes> {
    const path = `/admin/store/`
    return this.client.request("GET", path, undefined, {}, customHeaders)
  }

  /**
   * @description Lists the store's payment providers
   * @returns a list of payment providers configured on the store
   */
  listPaymentProviders(
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminPaymentProvidersList> {
    const path = `/admin/store/payment-providers`
    return this.client.request("GET", path, undefined, {}, customHeaders)
  }

  /**
   * @description Lists the store's payment providers
   * @returns a list of payment providers configured on the store
   */
  listTaxProviders(
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminTaxProvidersList> {
    const path = `/admin/store/tax-providers`
    return this.client.request("GET", path, undefined, {}, customHeaders)
  }
}

export default AdminStoresResource
