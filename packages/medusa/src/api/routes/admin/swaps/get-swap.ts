import { defaultAdminSwapFields, defaultAdminSwapRelations } from "."

import { SwapService } from "../../../../services"

/**
 * @oas [get] /swaps/{id}
 * operationId: "GetSwapsSwap"
 * summary: "Retrieve a Swap"
 * description: "Retrieves a Swap."
 * x-authenticated: true
 * parameters:
 *   - (path) id=* {string} The ID of the Swap.
 * x-codeSamples:
 *   - lang: JavaScript
 *     label: JS Client
 *     source: |
 *       import Medusa from "@medusajs/medusa-js"
 *       const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
 *       // must be previously logged in
 *       medusa.admin.swaps.retrieve(swap_id)
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl --location --request GET 'localhost:9000/admin/swaps/{id}' \
 *       --header 'Authorization: Bearer {api_token}'
 * tags:
 *   - Swap
 * responses:
 *   200:
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           properties:
 *             swap:
 *               $ref: "#/components/schemas/swap"
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
