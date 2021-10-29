import { defaultRelations, defaultFields } from "./"

/**
 * @oas [get] /return-reasons/{id}
 * operationId: "GetReturnReasonsReason"
 * summary: "Retrieve a Return Reason"
 * description: "Retrieves a Return Reason."
 * parameters:
 *   - (path) id=* {string} The id of the Return Reason.
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
  const returnReasonService = req.scope.resolve("returnReasonService")

  const data = await returnReasonService.retrieve(id, {
    select: defaultFields,
    relations: defaultRelations,
  })

  res.status(200).json({ return_reason: data })
}
