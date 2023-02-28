import {
  defaultAdminReturnReasonsFields,
  defaultAdminReturnReasonsRelations,
} from "."
import { ReturnReason } from "../../../../models"
import { ReturnReasonService } from "../../../../services"
import { Selector } from "../../../../types/common"

/**
 * @oas [get] /admin/return-reasons
 * operationId: "GetReturnReasons"
 * summary: "List Return Reasons"
 * description: "Retrieves a list of Return Reasons."
 * x-authenticated: true
 * x-codegen:
 *   method: list
 * x-codeSamples:
 *   - lang: JavaScript
 *     label: JS Client
 *     source: |
 *       import Medusa from "@medusajs/medusa-js"
 *       const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
 *       // must be previously logged in or use api token
 *       medusa.admin.returnReasons.list()
 *       .then(({ return_reasons }) => {
 *         console.log(return_reasons.length);
 *       });
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl --location --request GET 'https://medusa-url.com/admin/return-reasons' \
 *       --header 'Authorization: Bearer {api_token}'
 * security:
 *   - api_token: []
 *   - cookie_auth: []
 * tags:
 *   - Return Reasons
 * responses:
 *   200:
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           $ref: "#/components/schemas/AdminReturnReasonsListRes"
 *   "400":
 *     $ref: "#/components/responses/400_error"
 *   "401":
 *     $ref: "#/components/responses/unauthorized"
 *   "404":
 *     $ref: "#/components/responses/not_found_error"
 *   "409":
 *     $ref: "#/components/responses/invalid_state_error"
 *   "422":
 *     $ref: "#/components/responses/invalid_request_error"
 *   "500":
 *     $ref: "#/components/responses/500_error"
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
