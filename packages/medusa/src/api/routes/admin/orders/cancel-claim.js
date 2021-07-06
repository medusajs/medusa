import { MedusaError } from "medusa-core-utils"

/**
 * @oas [post] /orders/{id}/claims/{claim_id}/cancel
 * operationId: "PostOrdersClaimCancel"
 * summary: "Cancels a Claim"
 * description: "Cancels a Claim"
 * parameters:
 *   - (path) id=* {string} The id of the Order.
 *   . (path) claim_id=* {string} The id of the Claim.
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
 *               $ref: "#/components/schemas/claim"
 */
export default async (req, res) => {
  const { id, claim_id } = req.params

  try {
    const claimService = req.scope.resolve("claimService")

    const claim = await claimService.retrieve(claim_id)

    if (claim.order_id !== id) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `no claim was found with the id: ${claim_id} related to order: ${id}`
      )
    }

    const result = await claimService.cancel(claim_id)

    res.json({ result })
  } catch (error) {
    throw error
  }
}
