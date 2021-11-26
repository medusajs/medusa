import {
  defaultStoreReturnReasonFields,
  defaultStoreReturnReasonRelations,
} from "."
import ReturnReasonService from "../../../../services/return-reason"

/**
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
  const returnReasonService: ReturnReasonService = req.scope.resolve(
    "returnReasonService"
  )

  const query = { parent_return_reason_id: null }

  const return_reasons = await returnReasonService.list(query, {
    select: defaultStoreReturnReasonFields,
    relations: defaultStoreReturnReasonRelations,
  })

  res.status(200).json({ return_reasons })
}
