import { MedusaError } from "medusa-core-utils"
import { PaymentSessionStatus } from "../../../../models"
import { PaymentCollectionService } from "../../../../services"

/**
 * @oas [post] /store/payment-collections/{id}/sessions/{session_id}/authorize
 * operationId: "PostPaymentCollectionsSessionsSessionAuthorize"
 * summary: "Authorize Payment Session"
 * description: "Authorizes a Payment Session of a Payment Collection."
 * x-authenticated: false
 * parameters:
 *   - (path) id=* {string} The ID of the Payment Collections.
 *   - (path) session_id=* {string} The ID of the Payment Session.
 * x-codegen:
 *   method: authorizePaymentSession
 * x-codeSamples:
 *   - lang: JavaScript
 *     label: JS Client
 *     source: |
 *       import Medusa from "@medusajs/medusa-js"
 *       const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
 *       // must be previously logged in or use api token
 *       medusa.paymentCollections.authorize(payment_id, session_id)
 *       .then(({ payment_collection }) => {
 *         console.log(payment_collection.id);
 *       });
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl --location --request POST 'https://medusa-url.com/store/payment-collections/{id}/sessions/{session_id}/authorize'
 * security:
 *   - api_token: []
 *   - cookie_auth: []
 * tags:
 *   - Payment Collections
 * responses:
 *   200:
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           $ref: "#/components/schemas/StorePaymentCollectionsSessionRes"
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
  const { id, session_id } = req.params

  const paymentCollectionService: PaymentCollectionService = req.scope.resolve(
    "paymentCollectionService"
  )

  const payment_collection =
    await paymentCollectionService.authorizePaymentSessions(
      id,
      [session_id],
      req.request_context
    )

  const session = payment_collection.payment_sessions.find(
    ({ id }) => id === session_id
  )

  if (session?.status !== PaymentSessionStatus.AUTHORIZED) {
    throw new MedusaError(
      MedusaError.Types.PAYMENT_AUTHORIZATION_ERROR,
      `Failed to authorize Payment Session id "${id}"`
    )
  }

  res.status(200).json({ payment_session: session })
}
