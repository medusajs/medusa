import { StoreCustomersListPaymentMethodsRes } from "@medusajs/medusa"
import { ResponsePromise } from "../typings"
import BaseResource from "./base"

/**
 * This class is used to send requests to Payment Method API Routes part of the [Store Customer API Routes](https://docs.medusajs.com/api/store#customers_postcustomers). All its method
 * are available in the JS Client under the `medusa.customers.paymentMethods` property.
 * 
 * All methods in this class require {@link AuthResource.authenticate | customer authentication}.
 */
class PaymentMethodsResource extends BaseResource {
  /**
   * Retrieve the logged-in customer's saved payment methods. This method only works with payment providers created with the deprecated Payment Service interface.
   * The payment methods are saved using the Payment Service's third-party service, and not on the Medusa backend. So, they're retrieved from the third-party service.
   * @param {Record<string, any>} customHeaders - Custom headers to attach to the request.
   * @returns {StoreCustomersListPaymentMethodsRes} Resolves to the customer's payment methods.
   * 
   * @example
   * import Medusa from "@medusajs/medusa-js"
   * const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
   * // must be previously logged
   * medusa.customers.paymentMethods.list()
   * .then(({ payment_methods }) => {
   *   console.log(payment_methods.length);
   * })
   */
  list(
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<StoreCustomersListPaymentMethodsRes> {
    const path = `/store/customers/me/payment-methods`
    return this.client.request("GET", path, undefined, {}, customHeaders)
  }
}

export default PaymentMethodsResource
