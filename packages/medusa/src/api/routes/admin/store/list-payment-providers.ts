import { PaymentProviderService } from "../../../../services"
/**
 * @oas [get] /store/payment-providers
 * operationId: "GetStorePaymentProviders"
 * summary: "Retrieve configured Payment Providers"
 * description: "Retrieves the configured Payment Providers"
 * x-authenticated: true
 * x-codeSamples:
 *   - lang: JavaScript
 *     label: JS Client
 *     source: |
 *       import Medusa from "@medusajs/medusa-js"
 *       const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
 *       // must be previously logged in
 *       medusa.admin.store.listPaymentProviders()
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl --location --request GET 'localhost:9000/admin/store/payment-providers' \
 *       --header 'Authorization: Bearer {api_token}'
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
