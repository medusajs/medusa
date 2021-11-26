import { StoreCustomersListPaymentMethodsRes } from '@medusajs/medusa'
import { ResponsePromise } from "../typings"
import BaseResource from "./base"

class PaymentMethodsResource extends BaseResource {
  /**
   * Lists customer payment methods
   * @param {string} id id of cart
   * @return {StoreCustomersListPaymentMethodsRes}
   */
  list(id: string): ResponsePromise<StoreCustomersListPaymentMethodsRes> {
    const path = `/store/carts/${id}/payment-methods`
    return this.client.request("GET", path)
  }
}

export default PaymentMethodsResource
