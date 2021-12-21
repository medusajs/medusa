import {
  AdminPaymentProvidersList,
  AdminPostStoreReq,
  AdminStoresRes,
} from "@medusajs/medusa"
import { ResponsePromise } from "../../typings"
import BaseResource from "../base"

class AdminStoresResource extends BaseResource {
  /**
   * @description Updates the store
   * @param payload update to apply to the store.
   * @returns the updated store.
   */
  update(payload: AdminPostStoreReq): ResponsePromise<AdminStoresRes> {
    const path = `/admin/store/`
    return this.client.request("POST", path, payload)
  }

  /**
   * @description adds a currency to the store.
   * @param currency_code code of the currency to add
   * @returns updated store.
   */
  addCurrency(currency_code: string): ResponsePromise<AdminStoresRes> {
    const path = `/admin/store/${currency_code}`
    return this.client.request("POST", path)
  }

  /**
   * @description deletes a currency from the available store currencies
   * @param currency_code currency code of the currency to delete from the store.
   * @returns updated store
   */
  deleteCurrency(currency_code: string): ResponsePromise<AdminStoresRes> {
    const path = `/admin/store/currencies/${currency_code}`
    return this.client.request("DELETE", path)
  }

  /**
   * @description gets a medusa store
   * @returns a medusa store
   */
  retrieve(): ResponsePromise<AdminStoresRes> {
    const path = `/admin/store/`
    return this.client.request("GET", path)
  }

  /**
   * @description Lists the store's payment providers
   * @returns a list of payment providers configured on the store
   */
  listPaymentProviders(): ResponsePromise<AdminPaymentProvidersList> {
    const path = `/admin/store/payment-providers`
    return this.client.request("GET", path)
  }
}

export default AdminStoresResource
