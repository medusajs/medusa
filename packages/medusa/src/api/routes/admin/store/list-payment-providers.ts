import { Response } from "express"
import { PaymentProviderService } from "../../../../services"
import { AdminPaymentProvidersList } from "."
/**
 * @oas [get] /store/payment-providers
 * operationId: "GetStorePaymentProviders"
 * summary: "Retrieve configured Payment Providers"
 * description: "Retrieves the configured Payment Providers"
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
 *                 $ref: "#/components/schemas/store"
 */
export default async (req, res: Response<AdminPaymentProvidersList>) => {
  const paymentProviderService: PaymentProviderService = req.scope.resolve(
    "paymentProviderService"
  )
  const paymentProviders = await paymentProviderService.list()
  res.status(200).json({ payment_providers: paymentProviders })
}
