import { IsBoolean, IsObject, IsOptional } from "class-validator"
import { EntityManager } from "typeorm"
import { defaultAdminOrdersRelations, defaultAdminOrdersFields } from "."
import { ClaimService, OrderService } from "../../../../services"
import { validator } from "../../../../utils/validator"
/**
 * @oas [post] /orders/{id}/claims/{claim_id}/fulfillments
 * operationId: "PostOrdersOrderClaimsClaimFulfillments"
 * summary: "Create a Claim Fulfillment"
 * description: "Creates a Fulfillment for a Claim."
 * x-authenticated: true
 * parameters:
 *   - (path) id=* {string} The id of the Order.
 *   - (path) claim_id=* {string} The id of the Claim.
 * requestBody:
 *   content:
 *     application/json:
 *       schema:
 *         properties:
 *           metadata:
 *             description: An optional set of key-value pairs to hold additional information.
 *             type: object
 *           no_notification:
 *             description: If set to true no notification will be send related to this Claim.
 *             type: boolean
 * tags:
 *   - Order
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
  const { id, claim_id } = req.params

  const validated = await validator(
    AdminPostOrdersOrderClaimsClaimFulfillmentsReq,
    req.body
  )

  const orderService: OrderService = req.scope.resolve("orderService")
  const claimService: ClaimService = req.scope.resolve("claimService")
  const entityManager: EntityManager = req.scope.resolve("manager")

  await entityManager.transaction(async (manager) => {
    await claimService.withTransaction(manager).createFulfillment(claim_id, {
      metadata: validated.metadata,
      no_notification: validated.no_notification,
    })
  })

  const order = await orderService.retrieve(id, {
    select: defaultAdminOrdersFields,
    relations: defaultAdminOrdersRelations,
  })

  res.status(200).json({ order })
}

export class AdminPostOrdersOrderClaimsClaimFulfillmentsReq {
  @IsObject()
  @IsOptional()
  metadata?: Record<string, unknown>

  @IsBoolean()
  @IsOptional()
  no_notification?: boolean
}
