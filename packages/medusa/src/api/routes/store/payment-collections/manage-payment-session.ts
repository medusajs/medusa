import { IsString } from "class-validator"

import { EntityManager } from "typeorm"
import { PaymentCollectionService } from "../../../../services"

/**
 * @oas [post] /payment-collections/{id}/sessions
 * operationId: "PostPaymentCollectionsSessions"
 * summary: "Manage a Payment Session"
 * description: "Manages Payment Sessions from Payment Collections."
 * x-authenticated: false
 * parameters:
 *   - (path) id=* {string} The ID of the Payment Collection.
 * requestBody:
 *   content:
 *     application/json:
 *       schema:
 *         $ref: "#/components/schemas/StorePaymentCollectionSessionsReq"
 * x-codegen:
 *   method: managePaymentSession
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
 *       // Adding a payment session
 *       medusa.paymentCollections.managePaymentSession(payment_id, { provider_id: "stripe" })
 *       .then(({ payment_collection }) => {
 *         console.log(payment_collection.id);
 *       });
 *
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl --location --request POST 'https://medusa-url.com/store/payment-collections/{id}/sessions'
 * security:
 *   - api_token: []
 *   - cookie_auth: []
 * tags:
 *   - PaymentCollection
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
  const data = req.validatedBody as StorePaymentCollectionSessionsReq
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
        .setPaymentSession(id, data, customerId)
    }
  )

  res.status(200).json({ payment_collection: paymentCollection })
}

/**
 * @schema StorePaymentCollectionSessionsReq
 * type: object
 * required:
 *   - provider_id
 * properties:
 *   provider_id:
 *     type: string
 *     description: The ID of the Payment Provider.
 */
export class StorePaymentCollectionSessionsReq {
  @IsString()
  provider_id: string
}
