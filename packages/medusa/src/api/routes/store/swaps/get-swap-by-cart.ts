import SwapService from "../../../../services/swap"
import { defaultStoreSwapRelations } from "."

/**
 * @oas [get] /store/swaps/{cart_id}
 * operationId: GetSwapsSwapCartId
 * summary: Get by Cart ID
 * description: "Retrieve a Swap's details by the ID of its cart."
 * parameters:
 *   - (path) cart_id {string} The id of the Cart
 * x-codegen:
 *   method: retrieveByCartId
 * x-codeSamples:
 *   - lang: JavaScript
 *     label: JS Client
 *     source: |
 *       import Medusa from "@medusajs/medusa-js"
 *       const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
 *       medusa.swaps.retrieveByCartId(cartId)
 *       .then(({ swap }) => {
 *         console.log(swap.id);
 *       })
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl '{backend_url}/store/swaps/{cart_id}'
 * tags:
 *   - Swaps
 * responses:
 *   200:
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           $ref: "#/components/schemas/StoreSwapsRes"
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
  const { cart_id } = req.params

  const swapService: SwapService = req.scope.resolve("swapService")

  const swap = await swapService.retrieveByCartId(
    cart_id,
    defaultStoreSwapRelations
  )

  res.json({ swap })
}
