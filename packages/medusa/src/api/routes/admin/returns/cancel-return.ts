import { OrderService, ReturnService } from "../../../../services"
import { EntityManager } from "typeorm"
import { defaultReturnCancelFields, defaultReturnCancelRelations } from "."

/**
 * @oas [post] /admin/returns/{id}/cancel
 * operationId: "PostReturnsReturnCancel"
 * summary: "Cancel a Return"
 * description: "Registers a Return as canceled. The return can be associated with an order, claim, or swap."
 * parameters:
 *   - (path) id=* {string} The ID of the Return.
 * x-codegen:
 *   method: cancel
 * x-codeSamples:
 *   - lang: JavaScript
 *     label: JS Client
 *     source: |
 *       import Medusa from "@medusajs/medusa-js"
 *       const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
 *       // must be previously logged in or use api token
 *       medusa.admin.returns.cancel(returnId)
 *       .then(({ order }) => {
 *         console.log(order.id)
 *       })
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl -X POST '{backend_url}/admin/returns/{id}/cancel' \
 *       -H 'x-medusa-access-token: {api_token}'
 * security:
 *   - api_token: []
 *   - cookie_auth: []
 *   - jwt_token: []
 * tags:
 *   - Returns
 * responses:
 *   200:
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           $ref: "#/components/schemas/AdminReturnsCancelRes"
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

  const returnService: ReturnService = req.scope.resolve("returnService")
  const orderService: OrderService = req.scope.resolve("orderService")

  const manager: EntityManager = req.scope.resolve("manager")
  let result = await manager.transaction(async (transactionManager) => {
    return await returnService.withTransaction(transactionManager).cancel(id)
  })

  if (result.swap_id) {
    const swapService = req.scope.resolve("swapService")
    result = await swapService.retrieve(result.swap_id)
  } else if (result.claim_order_id) {
    const claimService = req.scope.resolve("claimService")
    result = await claimService.retrieve(result.claim_order_id)
  }

  const order = await orderService.retrieve(result.order_id!, {
    select: defaultReturnCancelFields,
    relations: defaultReturnCancelRelations,
  })

  res.status(200).json({ order })
}
