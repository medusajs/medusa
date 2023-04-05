import { Customer } from "../../../.."
import CustomerService from "../../../../services/customer"
import PaymentProviderService from "../../../../services/payment-provider"
import { PaymentProvider } from "../../../../models"

/**
 * @oas [get] /store/customers/me/payment-methods
 * operationId: GetCustomersCustomerPaymentMethods
 * summary: Get Payment Methods
 * description: "Retrieves a list of a Customer's saved payment methods. Payment methods are saved with Payment Providers and it is their responsibility to fetch saved methods."
 * x-authenticated: true
 * x-codegen:
 *   method: listPaymentMethods
 * x-codeSamples:
 *   - lang: JavaScript
 *     label: JS Client
 *     source: |
 *       import Medusa from "@medusajs/medusa-js"
 *       const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
 *       // must be previously logged
 *       medusa.customers.paymentMethods.list()
 *       .then(({ payment_methods }) => {
 *         console.log(payment_methods.length);
 *       });
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl --location --request GET 'https://medusa-url.com/store/customers/me/payment-methods' \
 *       --header 'Cookie: connect.sid={sid}'
 * security:
 *   - cookie_auth: []
 * tags:
 *   - Customers
 * responses:
 *   200:
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           $ref: "#/components/schemas/StoreCustomersListPaymentMethodsRes"
 *   "400":
 *     $ref: "#/components/responses/400_error"
 *   "401":
 *     $ref: "#/components/responses/unauthorized"
 *   "404":
 *     $ref: "#/components/responses/not_found_error"
 *   "409":
 *     $ref: "#/components/responses/invalid_state_error"
 *   "422":
 *     $ref: "#/components/responses/invalid_request_error"
 *   "500":
 *     $ref: "#/components/responses/500_error"
 */
export default async (req, res) => {
  const id = req.user.customer_id

  const paymentProviderService: PaymentProviderService = req.scope.resolve(
    "paymentProviderService"
  )

  const customerService: CustomerService = req.scope.resolve("customerService")

  const customer: Customer = await customerService.retrieve(id)

  const paymentProviders: PaymentProvider[] =
    await paymentProviderService.list()

  const methods = await Promise.all(
    paymentProviders.map(async (paymentProvider: PaymentProvider) => {
      const provider = paymentProviderService.retrieveProvider(
        paymentProvider.id
      )

      const pMethods = await provider.retrieveSavedMethods(customer)
      return pMethods.map((m) => ({
        provider_id: paymentProvider.id,
        data: m,
      }))
    })
  )

  res.json({
    payment_methods: methods.flat(),
  })
}
