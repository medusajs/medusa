/**
 * @oas [get] /customers/{id}/payment-methods
 * operationId: GetCustomersCustomerPaymentMethods
 * summary: Retrieve saved payment methods
 * description: "Retrieves a list of a Customer's saved payment methods. Payment methods are saved with Payment Providers and it is their responsibility to fetch saved methods."
 * parameters:
 *   - (path) id=* {string} The id of the Customer.
 * tags:
 *   - Customer
 * responses:
 *   200:
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           properties:
 *             payment_methods:
 *               type: array
 *               items:
 *                 properties:
 *                   provider_id:
 *                     type: string
 *                     description: The id of the Payment Provider where the payment method is saved.
 *                   data:
 *                     type: object
 *                     description: The data needed for the Payment Provider to use the saved payment method.
 */
export default async (req, res) => {
  const { id } = req.params
  try {
    const storeService = req.scope.resolve("storeService")
    const paymentProviderService = req.scope.resolve("paymentProviderService")
    const customerService = req.scope.resolve("customerService")

    let customer = await customerService.retrieve(id)

    const store = await storeService.retrieve(["payment_providers"])

    const methods = await Promise.all(
      store.payment_providers.map(async next => {
        const provider = paymentProviderService.retrieveProvider(next)

        const pMethods = await provider.retrieveSavedMethods(customer)
        return pMethods.map(m => ({
          provider_id: next,
          data: m,
        }))
      })
    )

    res.json({ payment_methods: methods.flat() })
  } catch (err) {
    throw err
  }
}
