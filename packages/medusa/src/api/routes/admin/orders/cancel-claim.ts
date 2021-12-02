import { MedusaError } from "medusa-core-utils"
import { defaultAdminOrdersRelations, defaultAdminOrdersFields } from "."
import { ClaimService, OrderService, ServiceIdentifiers } from "../../../../services"

/**
 * @oas [post] /orders/{id}/claims/{claim_id}/cancel
 * operationId: "PostOrdersClaimCancel"
 * summary: "Cancels a Claim"
 * description: "Cancels a Claim"
 * x-authenticated: true
 * parameters:
 *   - (path) id=* {string} The id of the Order.
 *   - (path) claim_id=* {string} The id of the Claim.
 * tags:
 *   - Claim
 * responses:
 *   200:
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           properties:
 *             order:
 *               $ref: "#/components/schemas/claim_order"
 */
export default async (req, res) => {
  const { id, claim_id } = req.params

  const claimService: ClaimService = req.scope.resolve(
    ServiceIdentifiers.claimService
  )
  const orderService: OrderService = req.scope.resolve(
    ServiceIdentifiers.orderService
  )

  const claim = await claimService.retrieve(claim_id)

  if (claim.order_id !== id) {
    throw new MedusaError(
      MedusaError.Types.NOT_FOUND,
      `no claim was found with the id: ${claim_id} related to order: ${id}`
    )
  }

  await claimService.cancel(claim_id)

  const order = await orderService.retrieve(id, {
    select: defaultAdminOrdersFields,
    relations: defaultAdminOrdersRelations,
  })

  res.json({ order })
}
