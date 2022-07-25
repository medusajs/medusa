import { StoreCustomersListPaymentMethodsRes } from '@medusajs/medusa'
import { ResponsePromise } from "../typings"
import BaseResource from "./base"

class PaymentMethodsResource extends BaseResource {
  /**
   * Lists customer payment methods
   * @param {string} id id of cart
   * @param customHeaders
   * @return {StoreCustomersListPaymentMethodsRes}
   */
  list(id: string, customHeaders: Record<string, any> = {}): ResponsePromise<StoreCustomersListPaymentMethodsRes> {
    const path = `/store/carts/${id}/payment-methods`
    return this.client.request("GET", path, undefined, {}, customHeaders)
  }
}

export default PaymentMethodsResource
