import {
  ClaimService,
  FulfillmentService,
  OrderService,
} from "../../../../services"
import { defaultAdminOrdersFields, defaultAdminOrdersRelations } from "."

import { EntityManager } from "typeorm"
import { MedusaError } from "medusa-core-utils"

/**
 * @oas [post] /orders/{id}/claims/{claim_id}/fulfillments/{fulfillment_id}/cancel
 * operationId: "PostOrdersClaimFulfillmentsCancel"
 * summary: "Cancels a fulfilmment related to a Claim"
 * description: "Registers a Fulfillment as canceled."
 * x-authenticated: true
 * parameters:
 *   - (path) id=* {string} The ID of the Order which the Claim relates to.
 *   - (path) claim_id=* {string} The ID of the Claim which the Fulfillment relates to.
 *   - (path) fulfillment_id=* {string} The ID of the Fulfillment.
 * tags:
 *   - Fulfillment
 * responses:
 *   200:
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           properties:
 *             order:
 *               $ref: "#/components/schemas/order"
 */
export default async (req, res) => {
  const { id, claim_id, fulfillment_id } = req.params

  const fulfillmentService: FulfillmentService =
    req.scope.resolve("fulfillmentService")
  const claimService: ClaimService = req.scope.resolve("claimService")
  const orderService: OrderService = req.scope.resolve("orderService")

  const fulfillment = await fulfillmentService.retrieve(fulfillment_id)

  if (fulfillment.claim_order_id !== claim_id) {
    throw new MedusaError(
      MedusaError.Types.NOT_FOUND,
      `no fulfillment was found with the id: ${fulfillment_id} related to claim: ${claim_id}`
    )
  }

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
      .cancelFulfillment(fulfillment_id)
  })

  const order = await orderService.retrieve(id, {
    select: defaultAdminOrdersFields,
    relations: defaultAdminOrdersRelations,
  })
  res.json({ order })
}
