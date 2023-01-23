import {
  defaultStoreReturnReasonFields,
  defaultStoreReturnReasonRelations,
} from "."
import ReturnReasonService from "../../../../services/return-reason"

/**
 * @oas [get] /return-reasons/{id}
 * operationId: "GetReturnReasonsReason"
 * summary: "Get a Return Reason"
 * description: "Retrieves a Return Reason."
 * parameters:
 *   - (path) id=* {string} The id of the Return Reason.
 * x-codegen:
 *   method: retrieve
 * x-codeSamples:
 *   - lang: JavaScript
 *     label: JS Client
 *     source: |
 *       import Medusa from "@medusajs/medusa-js"
 *       const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
 *       medusa.returnReasons.retrieve(reason_id)
 *       .then(({ return_reason }) => {
 *         console.log(return_reason.id);
 *       });
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl --location --request GET 'https://medusa-url.com/store/return-reasons/{id}'
 * tags:
 *   - Return Reason
 * responses:
 *   200:
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           $ref: "#/components/schemas/StoreReturnReasonsRes"
 *   "400":
 *     $ref: "#/components/responses/400_error"
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
