import { EntityManager } from "typeorm"
import { PaymentCollectionService } from "../../../../services"

/**
 * @oas [post] /admin/payment-collections/{id}/authorize
 * operationId: "PostPaymentCollectionsPaymentCollectionAuthorize"
 * summary: "Mark Authorized"
 * description: "Set the status of a Payment Collection as `authorized`. This will also change the `authorized_amount` of the payment collection."
 * x-authenticated: true
 * parameters:
 *   - (path) id=* {string} The ID of the Payment Collection.
 * x-codegen:
 *   method: markAsAuthorized
 * x-codeSamples:
 *   - lang: JavaScript
 *     label: JS Client
 *     source: |
 *       import Medusa from "@medusajs/medusa-js"
 *       const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
 *       // must be previously logged in or use api token
 *       medusa.admin.paymentCollections.markAsAuthorized(paymentCollectionId)
 *       .then(({ payment_collection }) => {
 *         console.log(payment_collection.id)
 *       })
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl -X POST '{backend_url}/admin/payment-collections/{id}/authorize' \
 *       -H 'x-medusa-access-token: {api_token}'
 * security:
 *   - api_token: []
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
 *           $ref: "#/components/schemas/AdminPaymentCollectionsRes"
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

  const paymentCollectionService: PaymentCollectionService = req.scope.resolve(
    "paymentCollectionService"
  )

  const manager: EntityManager = req.scope.resolve("manager")
  const paymentCollection = await manager.transaction(
    async (transactionManager) => {
      return await paymentCollectionService
        .withTransaction(transactionManager)
        .markAsAuthorized(id)
    }
  )

  res.status(200).json({ payment_collection: paymentCollection })
}
