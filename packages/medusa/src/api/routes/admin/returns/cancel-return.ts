import { OrderService, ReturnService } from "../../../../services"
import {
  defaultAdminOrdersFields,
  defaultAdminOrdersRelations,
} from "../orders"
import { EntityManager } from "typeorm"

/**
 * @oas [post] /returns/{id}/cancel
 * operationId: "PostReturnsReturnCancel"
 * summary: "Cancel a Return"
 * description: "Registers a Return as canceled."
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
 *       medusa.admin.returns.cancel(return_id)
 *       .then(({ order }) => {
 *         console.log(order.id);
 *       });
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl --location --request POST 'https://medusa-url.com/admin/returns/{id}/cancel' \
 *       --header 'Authorization: Bearer {api_token}'
 * security:
 *   - api_token: []
 *   - cookie_auth: []
 * tags:
 *   - Return
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
    select: defaultAdminOrdersFields,
    relations: defaultAdminOrdersRelations,
  })

  res.status(200).json({ order })
}
