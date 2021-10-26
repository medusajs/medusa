import { defaultFields, defaultRelations } from "./"

/**
 * @oas [get] /swaps/{id}
 * operationId: "GetSwapsSwap"
 * summary: "Retrieve a Swap"
 * description: "Retrieves a Swap."
 * parameters:
 *   - (path) id=* {string} The id of the Swap.
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

  const swapService = req.scope.resolve("swapService")

  const swap = await swapService.retrieve(id, {
    select: defaultFields,
    relations: defaultRelations,
  })

  res.json({ swap })
}
