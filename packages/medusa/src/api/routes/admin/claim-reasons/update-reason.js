import { MedusaError, Validator } from "medusa-core-utils"
import { defaultRelations, defaultFields } from "./"

/**
 * @oas [post] /claim-reasons/{id}
 * operationId: "PostClaimReasonsReason"
 * summary: "Update a Claim Reason"
 * description: "Updates a Claim Reason"
 * parameters:
 *   - (path) id=* {string} The id of the Claim Reason.
 * requestBody:
 *   content:
 *     application/json:
 *       schema:
 *         properties:
 *           label:
 *             description: "The label to display to the Customer."
 *             type: string
 *           value:
 *             description: "The value that the Claim Reason will be identified by. Must be unique."
 *             type: string
 *           description:
 *             description: "An optional description to for the Reason."
 *             type: string
 *           metadata:
 *             description: An optional set of key-value pairs with additional information.
 *             type: object
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

  const schema = Validator.object().keys({
    label: Validator.string().optional(),
    parent_claim_reason_id: Validator.string().optional(),
    description: Validator.string()
      .optional()
      .allow(""),
    metadata: Validator.object().optional(),
  })

  const { value, error } = schema.validate(req.body)
  if (error) {
    throw new MedusaError(MedusaError.Types.INVALID_DATA, error.details)
  }

  try {
    const claimReasonService = req.scope.resolve("claimReasonService")

    await claimReasonService.update(id, value)

    const reason = await claimReasonService.retrieve(id, {
      select: defaultFields,
      relations: defaultRelations,
    })

    res.status(200).json({ claim_reason: reason })
  } catch (err) {
    throw err
  }
}
