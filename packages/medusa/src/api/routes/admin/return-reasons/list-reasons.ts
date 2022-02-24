import {
  defaultAdminReturnReasonsFields,
  defaultAdminReturnReasonsRelations,
} from "."
import { ReturnReasonService } from "../../../../services"
import { Request } from "@interfaces/http"

/**
 * @oas [get] /return-reasons
 * operationId: "GetReturnReasons"
 * summary: "List Return Reasons"
 * description: "Retrieves a list of Return Reasons."
 * x-authenticated: true
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
export default async (req: Request, res) => {
  const returnReasonService: ReturnReasonService = req.scope.resolve(
    "returnReasonService"
  )

  const query = { parent_return_reason_id: null }
  const data = await returnReasonService.list(query, {
    select: defaultAdminReturnReasonsFields,
    relations: defaultAdminReturnReasonsRelations,
  })

  res.status(200).json({ return_reasons: data })
}
