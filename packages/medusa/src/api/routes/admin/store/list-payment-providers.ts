import { PaymentProviderService } from "../../../../services"
/**
 * @oas [get] /store/payment-providers
 * operationId: "GetStorePaymentProviders"
 * summary: "Retrieve configured Payment Providers"
 * description: "Retrieves the configured Payment Providers"
 * x-authenticated: true
 * tags:
 *   - Store
 * responses:
 *   200:
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           properties:
 *             payment_providers:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/payment_provider"
 */
export default async (req, res) => {
  const paymentProviderService: PaymentProviderService = req.scope.resolve(
    "paymentProviderService"
  )
  const paymentProviders = await paymentProviderService.list()
  res.status(200).json({ payment_providers: paymentProviders })
}
