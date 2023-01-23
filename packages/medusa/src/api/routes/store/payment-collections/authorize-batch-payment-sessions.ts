import { IsArray, IsString } from "class-validator"
import { PaymentCollectionService } from "../../../../services"

/**
 * @oas [post] /payment-collections/{id}/sessions/batch/authorize
 * operationId: "PostPaymentCollectionsSessionsBatchAuthorize"
 * summary: "Authorize PaymentSessions"
 * description: "Authorizes Payment Sessions of a Payment Collection."
 * x-authenticated: false
 * parameters:
 *   - (path) id=* {string} The ID of the Payment Collections.
 * requestBody:
 *   content:
 *     application/json:
 *       schema:
 *         $ref: "#/components/schemas/StorePostPaymentCollectionsBatchSessionsAuthorizeReq"
 * x-codegen:
 *   method: authorizePaymentSessionsBatch
 * x-codeSamples:
 *   - lang: JavaScript
 *     label: JS Client
 *     source: |
 *       import Medusa from "@medusajs/medusa-js"
 *       const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
 *       // must be previously logged in or use api token
 *       medusa.paymentCollections.authorize(payment_id)
 *       .then(({ payment_collection }) => {
 *         console.log(payment_collection.id);
 *       });
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl --location --request POST 'https://medusa-url.com/store/payment-collections/{id}/sessions/batch/authorize'
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
  const { id } = req.params
  const data =
    req.validatedBody as StorePostPaymentCollectionsBatchSessionsAuthorizeReq

  const paymentCollectionService: PaymentCollectionService = req.scope.resolve(
    "paymentCollectionService"
  )

  const payment_collection =
    await paymentCollectionService.authorizePaymentSessions(
      id,
      data.session_ids,
      req.request_context
    )

  res.status(207).json({ payment_collection })
}

/**
 * @schema StorePostPaymentCollectionsBatchSessionsAuthorizeReq
 * type: object
 * required:
 *   - session_ids
 * properties:
 *   session_ids:
 *     description: "List of Payment Session IDs to authorize."
 *     type: array
 *     items:
 *       type: string
 */
export class StorePostPaymentCollectionsBatchSessionsAuthorizeReq {
  @IsArray()
  @IsString({ each: true })
  session_ids: string[]
}
