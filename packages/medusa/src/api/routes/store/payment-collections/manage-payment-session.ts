import { IsString } from "class-validator"

import { EntityManager } from "typeorm"
import { PaymentCollectionService } from "../../../../services"

/**
 * @oas [post] /payment-collections/{id}/session
 * operationId: "PostPaymentCollectionsSession"
 * summary: "Manage Payment Sessions from Payment Collections"
 * description: "Manages Payment Sessions from Payment Collections."
 * x-authenticated: true
 * parameters:
 *   - (path) id=* {string} The ID of the Payment Collections.
 * requestBody:
 *   content:
 *     application/json:
 *       schema:
 *         properties:
 *           sessions:
 *             description: "An array or a single entry of payment sessions related to the Payment Collection. If the session_id is not provided the existing sessions not present will be deleted and the provided ones will be created."
 *             type: array
 *             items:
 *               required:
 *                 - provider_id
 *                 - customer_id
 *                 - amount
 *               properties:
 *                 provider_id:
 *                   type: string
 *                   description: The ID of the Payment Provider.
 *                 customer_id:
 *                   type: string
 *                   description: "The ID of the Customer."
 *                 amount:
 *                   type: integer
 *                   description: "The amount ."
 *                 session_id:
 *                   type: string
 *                   description: "The ID of the Payment Session to be updated."
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
 *       curl --location --request POST 'https://medusa-url.com/store/payment-collections/{id}/session' \
 *       --header 'Authorization: Bearer {api_token}'
 * security:
 *   - api_token: []
 *   - cookie_auth: []
 * tags:
 *   - Payment
 * responses:
 *   200:
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           properties:
 *             payment_collection:
 *               $ref: "#/components/schemas/payment_collection"
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
  const data = req.validatedBody as StoreManagePaymentCollectionSessionRequest
  const { id } = req.params

  const customer_id = req.user?.customer_id

  const paymentCollectionService: PaymentCollectionService = req.scope.resolve(
    "paymentCollectionService"
  )

  const manager: EntityManager = req.scope.resolve("manager")

  const paymentCollection = await manager.transaction(
    async (transactionManager) => {
      return await paymentCollectionService
        .withTransaction(transactionManager)
        .setPaymentSession(id, data, customer_id)
    }
  )

  res.status(200).json({ payment_collection: paymentCollection })
}

export class StoreManagePaymentCollectionSessionRequest {
  @IsString()
  provider_id: string
}
