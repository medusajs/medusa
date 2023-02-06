import { EntityManager } from "typeorm"
import { PaymentCollectionService } from "../../../../services"

/**
 * @oas [post] /payment-collections/{id}/sessions/{session_id}
 * operationId: PostPaymentCollectionsPaymentCollectionPaymentSessionsSession
 * summary: "Refresh a Payment Session"
 * description: "Refreshes a Payment Session to ensure that it is in sync with the Payment Collection."
 * x-authenticated: false
 * parameters:
 *   - (path) id=* {string} The id of the PaymentCollection.
 *   - (path) session_id=* {string} The id of the Payment Session to be refreshed.
 * x-codegen:
 *   method: refreshPaymentSession
 * x-codeSamples:
 *   - lang: JavaScript
 *     label: JS Client
 *     source: |
 *       import Medusa from "@medusajs/medusa-js"
 *       const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
 *       medusa.paymentCollections.refreshPaymentSession(payment_collection_id, session_id)
 *       .then(({ payment_session }) => {
 *         console.log(payment_session.id);
 *       });
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl --location --request POST 'https://medusa-url.com/store/payment-collections/{id}/sessions/{session_id}'
 * tags:
 *   - PaymentCollection
 * responses:
 *   200:
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           $ref: "#/components/schemas/StorePaymentCollectionsSessionRes"
 *   "400":
 *     $ref: "#/components/responses/400_error"
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

  const customerId = req.user?.customer_id

  const manager: EntityManager = req.scope.resolve("manager")
  const paymentSession = await manager.transaction(
    async (transactionManager) => {
      return await paymentCollectionService
        .withTransaction(transactionManager)
        .refreshPaymentSession(id, session_id, customerId)
    }
  )

  res.status(200).json({ payment_session: paymentSession })
}
