import { defaultAdminSwapFields, defaultAdminSwapRelations } from "."

import { SwapService } from "../../../../services"

/**
 * @oas [get] /admin/swaps/{id}
 * operationId: "GetSwapsSwap"
 * summary: "Get a Swap"
 * description: "Retrieves a Swap."
 * x-authenticated: true
 * parameters:
 *   - (path) id=* {string} The ID of the Swap.
 * x-codegen:
 *   method: retrieve
 * x-codeSamples:
 *   - lang: JavaScript
 *     label: JS Client
 *     source: |
 *       import Medusa from "@medusajs/medusa-js"
 *       const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
 *       // must be previously logged in or use api token
 *       medusa.admin.swaps.retrieve(swap_id)
 *       .then(({ swap }) => {
 *         console.log(swap.id);
 *       });
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl --location --request GET 'https://medusa-url.com/admin/swaps/{id}' \
 *       --header 'Authorization: Bearer {api_token}'
 * security:
 *   - api_token: []
 *   - cookie_auth: []
 * tags:
 *   - Swaps
 * responses:
 *   200:
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           $ref: "#/components/schemas/AdminSwapsRes"
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
  const { id } = req.params

  const swapService: SwapService = req.scope.resolve("swapService")

  const swap = await swapService.retrieve(id, {
    select: defaultAdminSwapFields,
    relations: defaultAdminSwapRelations,
  })

  res.json({ swap })
}
