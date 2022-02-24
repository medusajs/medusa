import {
  defaultStoreReturnReasonFields,
  defaultStoreReturnReasonRelations,
} from "."
import ReturnReasonService from "../../../../services/return-reason"
import { Request } from "@interfaces/http"

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
export default async (req: Request, res) => {
  const { id } = req.params

  const returnReasonService: ReturnReasonService = req.scope.resolve(
    "returnReasonService"
  )

  const return_reason = await returnReasonService.retrieve(id, {
    select: defaultStoreReturnReasonFields,
    relations: defaultStoreReturnReasonRelations,
  })

  res.status(200).json({ return_reason })
}
