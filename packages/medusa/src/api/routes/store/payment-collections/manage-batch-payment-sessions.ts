import { IsInt, IsNotEmpty, IsOptional, IsString } from "class-validator"
import { IsType } from "../../../../utils/validators/is-type"

import { EntityManager } from "typeorm"
import { PaymentCollectionService } from "../../../../services"

/**
 * @oas [post] /store/payment-collections/{id}/sessions/batch
 * operationId: "PostPaymentCollectionsPaymentCollectionSessionsBatch"
 * summary: "Manage Payment Sessions"
 * description: "Create, update, or delete a list of payment sessions of a Payment Collections. If a payment session is not provided in the `sessions` array, it's deleted."
 * x-authenticated: false
 * parameters:
 *   - (path) id=* {string} The ID of the Payment Collection.
 * requestBody:
 *   content:
 *     application/json:
 *       schema:
 *         $ref: "#/components/schemas/StorePostPaymentCollectionsBatchSessionsReq"
 * x-codegen:
 *   method: managePaymentSessionsBatch
 * x-codeSamples:
 *   - lang: JavaScript
 *     label: JS Client
 *     source: |
 *       import Medusa from "@medusajs/medusa-js"
 *       const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
 *       // must be previously logged in or use api token
 *
 *       // Total amount = 10000
 *
 *       // Example 1: Adding two new sessions
 *       medusa.paymentCollections.managePaymentSessionsBatch(paymentId, {
 *         sessions: [
 *           {
 *             provider_id: "stripe",
 *             amount: 5000,
 *           },
 *           {
 *             provider_id: "manual",
 *             amount: 5000,
 *           },
 *         ]
 *       })
 *       .then(({ payment_collection }) => {
 *         console.log(payment_collection.id);
 *       })
 *
 *       // Example 2: Updating one session and removing the other
 *       medusa.paymentCollections.managePaymentSessionsBatch(paymentId, {
 *         sessions: [
 *           {
 *             provider_id: "stripe",
 *             amount: 10000,
 *             session_id: "ps_123456"
 *           },
 *         ]
 *       })
 *       .then(({ payment_collection }) => {
 *         console.log(payment_collection.id);
 *       })
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl -X POST '{backend_url}/store/payment-collections/{id}/sessions/batch' \
 *       -H 'Content-Type: application/json' \
 *       --data-raw '{
 *         "sessions": [
 *           {
 *             "provider_id": "stripe",
 *             "amount": 5000
 *           },
 *           {
 *             "provider_id": "manual",
 *             "amount": 5000
 *           }
 *         ]
 *       }'
 * security:
 *   - cookie_auth: []
 *   - jwt_token: []
 * tags:
 *   - Payment Collections
 * responses:
 *   200:
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           $ref: "#/components/schemas/StorePaymentCollectionsRes"
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
  const data = req.validatedBody as StorePostPaymentCollectionsBatchSessionsReq
  const { id } = req.params

  const customerId = req.user?.customer_id

  const paymentCollectionService: PaymentCollectionService = req.scope.resolve(
    "paymentCollectionService"
  )

  const manager: EntityManager = req.scope.resolve("manager")
  const paymentCollection = await manager.transaction(
    async (transactionManager) => {
      return await paymentCollectionService
        .withTransaction(transactionManager)
        .setPaymentSessionsBatch(id, data.sessions, customerId)
    }
  )

  res.status(200).json({ payment_collection: paymentCollection })
}

export class StorePostPaymentCollectionsSessionsReq {
  @IsString()
  provider_id: string

  @IsInt()
  @IsNotEmpty()
  amount: number

  @IsString()
  @IsOptional()
  session_id?: string
}

/**
 * @schema StorePostPaymentCollectionsBatchSessionsReq
 * type: object
 * required:
 *   - sessions
 * properties:
 *   sessions:
 *     description: "Payment sessions related to the Payment Collection. Existing sessions that are not added in this array will be deleted."
 *     type: array
 *     items:
 *       type: object
 *       required:
 *         - provider_id
 *         - amount
 *       properties:
 *         provider_id:
 *           type: string
 *           description: The ID of the Payment Provider.
 *         amount:
 *           type: integer
 *           description: "The payment amount"
 *         session_id:
 *           type: string
 *           description: "The ID of the Payment Session to be updated. If no ID is provided, a new payment session is created."
 */
export class StorePostPaymentCollectionsBatchSessionsReq {
  @IsType([[StorePostPaymentCollectionsSessionsReq]])
  sessions: StorePostPaymentCollectionsSessionsReq[]
}
