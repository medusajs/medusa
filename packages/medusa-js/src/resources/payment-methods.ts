import BaseResource from "./base"
import { AxiosPromise } from "axios"

class PaymentMethodsResource extends BaseResource {
  /**
   * Lists customer payment methods
   * @param {string} id id of cart
   * @return {AxiosPromise<{ payment_methods: object[] }>}
   */
  list(id: string): AxiosPromise<{ payment_methods: object[] }> {
    const path = `/store/carts/${id}/payment-methods`
    return this.client.request("GET", path)
  }
}

export default PaymentMethodsResource
