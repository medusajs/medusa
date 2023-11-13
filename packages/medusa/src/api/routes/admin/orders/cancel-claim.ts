import { ClaimService, OrderService } from "../../../../services"

import { EntityManager } from "typeorm"
import { MedusaError } from "medusa-core-utils"
import { FindParams } from "../../../../types/common"
import { cleanResponseData } from "../../../../utils/clean-response-data"

/**
 * @oas [post] /admin/orders/{id}/claims/{claim_id}/cancel
 * operationId: "PostOrdersClaimCancel"
 * summary: "Cancel a Claim"
 * description: "Cancel a Claim and change its status. A claim can't be canceled if it has a refund, if its fulfillments haven't been canceled, of if its associated return hasn't been canceled."
 * x-authenticated: true
 * externalDocs:
 *   description: Canceling a claim
 *   url: https://docs.medusajs.com/modules/orders/claims#cancel-a-claim
 * parameters:
 *   - (path) id=* {string} The ID of the order the claim is associated with.
 *   - (path) claim_id=* {string} The ID of the Claim.
 *   - (query) expand {string} Comma-separated relations that should be expanded in the returned order.
 *   - (query) fields {string} Comma-separated fields that should be included in the returned order.
 * x-codegen:
 *   method: cancelClaim
 *   params: AdminPostOrdersClaimCancel
 * x-codeSamples:
 *   - lang: JavaScript
 *     label: JS Client
 *     source: |
 *       import Medusa from "@medusajs/medusa-js"
 *       const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
 *       // must be previously logged in or use api token
 *       medusa.admin.orders.cancelClaim(orderId, claimId)
 *       .then(({ order }) => {
 *         console.log(order.id);
 *       })
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl -X POST '{backend_url}/admin/orders/{id}/claims/{claim_id}/cancel' \
 *       -H 'x-medusa-access-token: {api_token}'
 * security:
 *   - api_token: []
 *   - cookie_auth: []
 *   - jwt_token: []
 * tags:
 *   - Orders
 * responses:
 *   200:
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           $ref: "#/components/schemas/AdminOrdersRes"
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
  const { id, claim_id } = req.params

  const claimService: ClaimService = req.scope.resolve("claimService")
  const orderService: OrderService = req.scope.resolve("orderService")

  const claim = await claimService.retrieve(claim_id)

  if (claim.order_id !== id) {
    throw new MedusaError(
      MedusaError.Types.NOT_FOUND,
      `no claim was found with the id: ${claim_id} related to order: ${id}`
    )
  }

  const manager: EntityManager = req.scope.resolve("manager")
  await manager.transaction(async (transactionManager) => {
    return await claimService
      .withTransaction(transactionManager)
      .cancel(claim_id)
  })

  const order = await orderService.retrieveWithTotals(id, req.retrieveConfig, {
    includes: req.includes,
  })

  res.json({ order: cleanResponseData(order, []) })
}

export class AdminPostOrdersClaimCancel extends FindParams {}
