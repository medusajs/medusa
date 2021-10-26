/**
 * @oas [get] /returns
 * operationId: "GetReturns"
 * summary: "List Returns"
 * description: "Retrieves a list of Returns"
 * tags:
 *   - Return
 * responses:
 *   200:
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           properties:
 *             returns:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/return"
 */
export default async (req, res) => {
  const returnService = req.scope.resolve("returnService")

  const limit = parseInt(req.query.limit) || 50
  const offset = parseInt(req.query.offset) || 0

  const selector = {}

  const listConfig = {
    relations: ["swap", "order"],
    skip: offset,
    take: limit,
    order: { created_at: "DESC" },
  }

  const returns = await returnService.list(selector, { ...listConfig })

  res.json({ returns, count: returns.length, offset, limit })
}
