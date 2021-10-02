import { MedusaError, Validator } from "medusa-core-utils"
import { defaultRelations, defaultFields } from "./"

/**
 * @oas [get] /claim-reasons/{id}
 * operationId: "GetClaimReasonsReason"
 * summary: "Retrieve a Claim Reason"
 * description: "Retrieves a Claim Reason."
 * parameters:
 *   - (path) id=* {string} The id of the Claim Reason.
 * tags:
 *   - Claim Reason
 * responses:
 *   200:
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           properties:
 *             claim_reason:
 *               $ref: "#/components/schemas/claim_reason"
 */
export default async (req, res) => {
  const { id } = req.params
  try {
    const claimReasonService = req.scope.resolve("claimReasonService")

    const data = await claimReasonService.retrieve(id, {
      select: defaultFields,
      relations: defaultRelations,
    })

    res.status(200).json({ claim_reason: data })
  } catch (err) {
    throw err
  }
}
