import { defaultRelations, defaultFields } from "./"

/**
 * @param {object} req Request see below
 * @param {object} res Response see referenced object #/components/schemas/return_reason
 * @oas [get] /return-reasons
 * operationId: "GetReturnReasons"
 * summary: "List Return Reasons"
 * description: "Retrieves a list of Return Reasons."
 * tags:
 *   - Return Reason
 * responses:
 *   200:
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           properties:
 *             return_reasons:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/return_reason"
 */
export default async (req, res) => {
  const returnReasonService = req.scope.resolve("returnReasonService")

  const query = { parent_return_reason_id: null }
  const data = await returnReasonService.list(query, {
    select: defaultFields,
    relations: defaultRelations,
  })

  res.status(200).json({ return_reasons: data })
}
