import { PaymentService } from "../../../../services"
import { FindParams } from "../../../../types/common"

/**
 * @oas [get] /admin/payments/{id}
 * operationId: "GetPaymentsPayment"
 * summary: "Get Payment details"
 * description: "Retrieves the Payment details"
 * x-authenticated: true
 * parameters:
 *   - (path) id=* {string} The ID of the Payment.
 * x-codegen:
 *   method: retrieve
 *   queryParams: GetPaymentsParams
 * x-codeSamples:
 *   - lang: JavaScript
 *     label: JS Client
 *     source: |
 *       import Medusa from "@medusajs/medusa-js"
 *       const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
 *       // must be previously logged in or use api token
 *       medusa.admin.payments.retrieve(payment_id)
 *       .then(({ payment }) => {
 *         console.log(payment.id);
 *       });
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl --location --request GET 'https://medusa-url.com/admin/payments/{id}' \
 *       --header 'Authorization: Bearer {api_token}'
 * security:
 *   - api_token: []
 *   - cookie_auth: []
 * tags:
 *   - Payments
 * responses:
 *   200:
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           $ref: "#/components/schemas/AdminPaymentRes"
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
  const { id } = req.params
  const retrieveConfig = req.retrieveConfig

  const paymentService: PaymentService = req.scope.resolve("paymentService")

  const payment = await paymentService.retrieve(id, retrieveConfig)

  res.status(200).json({ payment })
}

export class GetPaymentsParams extends FindParams {}
