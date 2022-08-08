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
