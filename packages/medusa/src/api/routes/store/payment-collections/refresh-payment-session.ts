import { IsInt, IsNotEmpty, IsString } from "class-validator"

import { EntityManager } from "typeorm"
import { PaymentCollectionService } from "../../../../services"

/**
 * @oas [post] /payment-collections/{id}/sessions/{session_id}/refresh
 * operationId: PostPaymentCollectionsPaymentCollectionPaymentSessionsSession
 * summary: Refresh a Payment Session
 * description: "Refreshes a Payment Session to ensure that it is in sync with the Payment Collection."
 * parameters:
 *   - (path) id=* {string} The id of the PaymentCollection.
 *   - (path) session_id=* {string} The id of the Payment Session to be refreshed.
 * requestBody:
 *   content:
 *     application/json:
 *       schema:
 *         required:
 *           - provider_id
 *           - customer_id
 *         properties:
 *           provider_id:
 *             description: The Payment Provider id.
 *             type: string
 *           customer_id:
 *             description: The Customer id.
 *             type: string
 * x-codeSamples:
 *   - lang: JavaScript
 *     label: JS Client
 *     source: |
 *       import Medusa from "@medusajs/medusa-js"
 *       const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
 *       medusa.paymentCollections.refreshPaymentSession(payment_collection_id, session_id, payload)
 *       .then(({ payment_collection }) => {
 *         console.log(payment_collection.id);
 *       });
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl --location --request POST 'https://medusa-url.com/store/payment-collections/{id}/sessions/{session_id}/refresh'
 * tags:
 *   - PaymentCollection
 * responses:
 *   200:
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           properties:
 *             payment_session:
 *               $ref: "#/components/schemas/payment_session"
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
  const data = req.validatedBody as StoreRefreshPaymentCollectionSessionRequest
  const { id, session_id } = req.params

  const paymentCollectionService: PaymentCollectionService = req.scope.resolve(
    "paymentCollectionService"
  )

  const manager: EntityManager = req.scope.resolve("manager")
  const paymentSession = await manager.transaction(
    async (transactionManager) => {
      return await paymentCollectionService
        .withTransaction(transactionManager)
        .refreshPaymentSession(id, session_id, data)
    }
  )

  res.status(200).json({ payment_session: paymentSession })
}

export class StoreRefreshPaymentCollectionSessionRequest {
  @IsString()
  provider_id: string

  @IsString()
  customer_id: string
}
