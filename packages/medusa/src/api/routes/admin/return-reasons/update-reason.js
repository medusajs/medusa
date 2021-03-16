import { MedusaError, Validator } from "medusa-core-utils"
import { defaultRelations, defaultFields } from "./"

/**
 * @oas [post] /return-reasons/:id
 * operationId: "PostReturnReasonsReason"
 * summary: "Update a Return Reason"
 * description: "Updates a Return Reason"
 * parameters:
 *   - (path) id=* {string} The id of the Return Reason.
 * requestBody:
 *   content:
 *     application/json:
 *       schema:
 *         properties:
 *           label:
 *             description: "The label to display to the Customer."
 *             type: string
 *           value:
 *             description: "The value that the Return Reason will be identified by. Must be unique."
 *             type: string
 *           description:
 *             description: "An optional description to for the Reason."
 *             type: string
 *           metadata:
 *             description: An optional set of key-value pairs with additional information.
 *             type: object
 * tags:
 *   - Return Reason
 * responses:
 *   200:
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           properties:
 *             return_reason:
 *               $ref: "#/components/schemas/return_reason"
 */
export default async (req, res) => {
  const { id } = req.params

  const schema = Validator.object().keys({
    label: Validator.string().optional(),
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
    const returnReasonService = req.scope.resolve("returnReasonService")

    await returnReasonService.update(id, value)

    const reason = await returnReasonService.retrieve(id, {
      select: defaultFields,
      relations: defaultRelations,
    })

    res.status(200).json({ return_reason: reason })
  } catch (err) {
    throw err
  }
}
