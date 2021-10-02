import { MedusaError, Validator } from "medusa-core-utils"
import { defaultRelations, defaultFields } from "./"

/**
 * @oas [get] /claim-reasons
 * operationId: "GetClaimReasons"
 * summary: "List Claim Reasons"
 * description: "Retrieves a list of Claim Reasons."
 * tags:
 *   - Claim Reason
 * responses:
 *   200:
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           properties:
 *             claim_reasons:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/claim_reason"
 */
export default async (req, res) => {
  try {
    const claimReasonService = req.scope.resolve("claimReasonService")

    const query = { parent_claim_reason_id: null }
    const data = await claimReasonService.list(query, {
      select: defaultFields,
      relations: defaultRelations,
    })

    res.status(200).json({ claim_reasons: data })
  } catch (err) {
    throw err
  }
}
