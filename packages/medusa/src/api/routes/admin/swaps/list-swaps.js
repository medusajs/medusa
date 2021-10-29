/**
 * @oas [get] /swaps
 * operationId: "GetSwaps"
 * summary: "List Swaps"
 * description: "Retrieves a list of Swaps."
 * tags:
 *   - Swap
 * responses:
 *   200:
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           properties:
 *             swaps:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/swap"
 */
export default async (req, res) => {
  const swapService = req.scope.resolve("swapService")

  const limit = parseInt(req.query.limit) || 50
  const offset = parseInt(req.query.offset) || 0

  const selector = {}

  const listConfig = {
    skip: offset,
    take: limit,
    order: { created_at: "DESC" },
  }

  const swaps = await swapService.list(selector, { ...listConfig })

  res.json({ swaps, count: swaps.length, offset, limit })
}
