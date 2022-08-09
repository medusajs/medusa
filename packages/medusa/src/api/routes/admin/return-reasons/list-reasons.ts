import { FindConfig, Selector } from "../../../../types/common"
import {
  defaultAdminReturnReasonsFields,
  defaultAdminReturnReasonsRelations,
} from "."

import { ReturnReason } from "../../../../models"
import { ReturnReasonService } from "../../../../services"

/**
 * @oas [get] /return-reasons
 * operationId: "GetReturnReasons"
 * summary: "List Return Reasons"
 * description: "Retrieves a list of Return Reasons."
 * x-authenticated: true
 * x-codeSamples:
 *   - lang: JavaScript
 *     label: JS Client
 *     source: |
 *       import Medusa from "@medusajs/medusa-js"
 *       const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
 *       // must be previously logged in or use api token
 *       medusa.admin.returnReasons.list()
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl --location --request GET 'https://medusa-url.com/admin/return-reasons' \
 *       --header 'Authorization: Bearer {api_token}'
 * security:
 *   - api_token: []
 *   - cookie_auth: []
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

  const query: Selector<ReturnReason> = { parent_return_reason_id: null }
  const data = await returnReasonService.list(query, {
    select: defaultAdminReturnReasonsFields,
    relations: defaultAdminReturnReasonsRelations,
  })

  res.status(200).json({ return_reasons: data })
}
