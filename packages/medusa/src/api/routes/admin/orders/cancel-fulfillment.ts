import { FulfillmentService, OrderService } from "../../../../services"
import { defaultAdminOrdersFields, defaultAdminOrdersRelations } from "."

import { EntityManager } from "typeorm"
import { MedusaError } from "medusa-core-utils"

/**
 * @oas [post] /orders/{id}/fulfillments/{fulfillment_id}/cancel
 * operationId: "PostOrdersOrderFulfillmentsCancel"
 * summary: "Cancels a fulfilmment"
 * description: "Registers a Fulfillment as canceled."
 * x-authenticated: true
 * parameters:
 *   - (path) id=* {string} The ID of the Order which the Fulfillment relates to.
 *   - (path) fulfillment_id=* {string} The ID of the Fulfillment
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
  const { id, fulfillment_id } = req.params

  const orderService: OrderService = req.scope.resolve("orderService")
  const fulfillmentService: FulfillmentService =
    req.scope.resolve("fulfillmentService")

  const fulfillment = await fulfillmentService.retrieve(fulfillment_id)

  if (fulfillment.order_id !== id) {
    throw new MedusaError(
      MedusaError.Types.NOT_FOUND,
      `no fulfillment was found with the id: ${fulfillment_id} related to order: ${id}`
    )
  }

  const manager: EntityManager = req.scope.resolve("manager")
  await manager.transaction(async (transactionManager) => {
    return await orderService
      .withTransaction(transactionManager)
      .cancelFulfillment(fulfillment_id)
  })

  const order = await orderService.retrieve(id, {
    select: defaultAdminOrdersFields,
    relations: defaultAdminOrdersRelations,
  })

  res.json({ order })
}
