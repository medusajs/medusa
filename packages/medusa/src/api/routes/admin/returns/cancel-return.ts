import { OrderService, ReturnService } from "../../../../services"
import {
  defaultAdminOrdersFields,
  defaultAdminOrdersRelations,
} from "../orders"

/**
 * @oas [post] /returns/{id}/cancel
 * operationId: "PostReturnsReturnCancel"
 * summary: "Cancel a Return"
 * description: "Registers a Return as canceled."
 * parameters:
 *   - (path) id=* {string} The id of the Return.
 * tags:
 *   - Return
 * responses:
 *   200:
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           properties:
 *             return:
 *               $ref: "#/components/schemas/order"
 */
export default async (req, res) => {
  const { id } = req.params

  const returnService: ReturnService = req.scope.resolve(ServiceIdentifiers.returnService)
  const orderService: OrderService = req.scope.resolve(ServiceIdentifiers.orderService)

  let result = await returnService.cancel(id)

  if (result.swap_id) {
    const swapService = req.scope.resolve(ServiceIdentifiers.swapService)
    result = await swapService.retrieve(result.swap_id)
  } else if (result.claim_order_id) {
    const claimService = req.scope.resolve(ServiceIdentifiers.claimService)
    result = await claimService.retrieve(result.claim_order_id)
  }

  const order = await orderService.retrieve(result.order_id, {
    select: defaultAdminOrdersFields,
    relations: defaultAdminOrdersRelations,
  })

  res.status(200).json({ order })
}
